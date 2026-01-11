/**
 * Recommendation generator for SmoothSpec
 * Handles upgrade suggestions with budget filtering and priority ranking
 */

import { supabase } from '../supabase'
import { calculateUpgradePriority, calculateBottleneck } from '../benchmarks'
import { BOTTLENECK_THRESHOLD, PRIORITY_THRESHOLDS, RAM_UPGRADE_COSTS, COMPONENT_LIFESPANS } from '../constants'
import type { OperationResult, PartialFailure } from '../errors'
import type { Component, GameAnalysis, ComponentAge, UpgradeRecommendation, UpgradePathWarning, UpgradeCandidate } from '@/types/analysis'

/**
 * Check if a component is past its expected gaming lifespan
 */
function isComponentAged(releaseYear: number | undefined, componentType: 'cpu' | 'gpu'): boolean {
  if (!releaseYear) return false
  const currentYear = new Date().getFullYear()
  const age = currentYear - releaseYear
  const lifespan = COMPONENT_LIFESPANS[componentType]
  return age >= lifespan
}

/**
 * Find upgrade candidates for a component type within budget
 * Returns OperationResult to surface any errors that occurred
 */
// Candidate with seed price for client-side budget validation
export interface CandidateWithPrice {
  component: Component
  seedPrice: number
}

// How many alternative candidates to return (sorted by performance, descending)
const MAX_CANDIDATES = 3

export async function findUpgradeCandidates(
  currentBenchmarkScore: number,
  budget: number,
  componentType: 'cpu' | 'gpu'
): Promise<OperationResult<CandidateWithPrice[]>> {
  const warnings: string[] = []
  const partialFailures: PartialFailure[] = []

  // Get components with higher benchmark scores
  const { data: components, error: componentError } = await supabase
    .from('components')
    .select('*')
    .eq('type', componentType)
    .gt('benchmark_score', currentBenchmarkScore)
    .order('benchmark_score', { ascending: true })

  if (componentError || !components) {
    warnings.push(`Could not fetch ${componentType.toUpperCase()} upgrade options`)
    partialFailures.push({
      operation: `fetch_${componentType}_candidates`,
      error: componentError?.message || 'No components found',
    })
    return { data: [], warnings, partialFailures }
  }

  // Get prices for these components
  const componentIds = components.map((c) => c.id)
  const { data: prices, error: priceError } = await supabase
    .from('prices')
    .select('*')
    .in('component_id', componentIds)
    .eq('in_stock', true)
    .order('price', { ascending: true })

  if (priceError) {
    warnings.push(`Price data unavailable for some ${componentType.toUpperCase()} options`)
    partialFailures.push({
      operation: `fetch_${componentType}_prices`,
      error: priceError.message,
    })
  }

  // Build price map (lowest price per component)
  const priceMap = new Map<string, number>()
  if (prices) {
    for (const price of prices) {
      const existing = priceMap.get(price.component_id)
      if (!existing || price.price < existing) {
        priceMap.set(price.component_id, price.price)
      }
    }
  }

  // Filter components that have at least one price within budget
  // Include seed price for client-side real-price validation
  const affordableCandidates: CandidateWithPrice[] = []
  for (const comp of components) {
    const lowestPrice = priceMap.get(comp.id)
    if (lowestPrice !== undefined && lowestPrice <= budget) {
      affordableCandidates.push({
        component: comp as Component,
        seedPrice: lowestPrice,
      })
    }
  }

  // Return top N candidates by performance (highest benchmark scores)
  // They're already sorted ascending, so we take from the end
  const topCandidates = affordableCandidates.slice(-MAX_CANDIDATES).reverse()

  return { data: topCandidates, warnings, partialFailures }
}

/**
 * Get the lowest price for a component
 */
export async function getLowestPrice(componentId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('prices')
    .select('price')
    .eq('component_id', componentId)
    .eq('in_stock', true)
    .order('price', { ascending: true })
    .limit(1)

  if (error || !data || data.length === 0) {
    return null
  }

  return data[0].price
}

/**
 * Generate human-readable recommendation reason
 */
export function generateRecommendationReason(
  componentType: 'cpu' | 'gpu' | 'ram',
  currentComponent: string,
  recommendedComponent: Component,
  affectedGames: GameAnalysis[],
  performanceGain: number,
  ageWarning?: ComponentAge
): string {
  const parts: string[] = []

  // Performance gain
  parts.push(
    `Upgrading from ${currentComponent} to ${recommendedComponent.brand} ${recommendedComponent.model} offers ~${performanceGain}% performance improvement.`
  )

  // Game-specific impact
  if (affectedGames.length > 0) {
    const gameNames = affectedGames.slice(0, 3).map((a) => a.game.name)
    const gameList = gameNames.join(', ')
    if (componentType === 'gpu') {
      parts.push(`This will particularly benefit ${gameList} where GPU is the bottleneck.`)
    } else if (componentType === 'cpu') {
      parts.push(`This will help with ${gameList} which rely heavily on CPU performance.`)
    }
  }

  // Age consideration
  if (ageWarning && ageWarning.urgency !== 'low') {
    parts.push(
      `Your current ${componentType.toUpperCase()} is ${ageWarning.ageYears.toFixed(1)} years old.`
    )
  }

  return parts.join(' ')
}

/**
 * Calculate per-game performance impact for a component upgrade
 * Returns all games sorted by impact (highest first)
 */
function calculatePerGameImpact(
  componentType: 'cpu' | 'gpu' | 'ram',
  performanceGain: number,
  perGameAnalysis: GameAnalysis[]
): Array<{gameName: string, estimatedImprovement: number, impactLevel: 'high'|'medium'|'low'}> {
  const impacts = perGameAnalysis.map(analysis => {
    const game = analysis.game
    let relevance = 1.0

    // Component relevance based on game weights and current bottleneck
    if (componentType === 'gpu') {
      // GPU upgrade helps GPU-bound games most
      relevance = game.gpu_weight
      if (analysis.bottleneck.component === 'gpu') {
        relevance *= (analysis.bottleneck.percentage / 100)
      } else {
        relevance *= 0.2 // Still some benefit even if not bottleneck
      }
    } else if (componentType === 'cpu') {
      // CPU upgrade helps CPU-bound games most
      relevance = game.cpu_weight
      if (analysis.bottleneck.component === 'cpu') {
        relevance *= (analysis.bottleneck.percentage / 100)
      } else {
        relevance *= 0.2
      }
    } else if (componentType === 'ram') {
      // RAM upgrade helps RAM-starved games
      relevance = analysis.ramSufficient ? 0.1 : 1.0
    }

    const estimatedImprovement = Math.round(performanceGain * relevance)

    // Determine impact level
    let impactLevel: 'high' | 'medium' | 'low'
    if (estimatedImprovement >= 15) impactLevel = 'high'
    else if (estimatedImprovement >= 5) impactLevel = 'medium'
    else impactLevel = 'low'

    return {
      gameName: game.name,
      estimatedImprovement,
      impactLevel
    }
  })

  // Sort by improvement descending
  return impacts.sort((a, b) => b.estimatedImprovement - a.estimatedImprovement)
}

/**
 * Generate RAM upgrade recommendation
 */
export function generateRamRecommendation(
  currentRam: number,
  ramDeficit: number,
  affectedGames: GameAnalysis[],
  budget: number,
  ramType: string = 'DDR5'
): UpgradeRecommendation | null {
  if (ramDeficit <= 0) {
    return null
  }

  // Determine recommended RAM amount
  const recommendedRam = currentRam < 16 ? 16 : currentRam < 32 ? 32 : 64
  const estimatedCost = RAM_UPGRADE_COSTS[recommendedRam] || 100

  if (estimatedCost > budget) {
    return null
  }

  const gameNames = affectedGames
    .filter((a) => !a.ramSufficient)
    .map((a) => a.game.name)
    .slice(0, 3)

  return {
    componentType: 'ram',
    currentComponent: `${currentRam}GB ${ramType} RAM`,
    recommendedComponent: {
      id: 'ram-upgrade',
      type: 'ram',
      brand: '',  // Empty - will use matched brand from PCPartPicker
      model: `${ramType} ${recommendedRam}GB Kit`,
      release_year: ramType === 'DDR5' ? 2024 : 2020,
      benchmark_score: recommendedRam * 100,
      specs: { capacity: recommendedRam, type: ramType },
    },
    priorityScore: 60,
    priorityLabel: 'Medium',
    estimatedPerformanceGain: Math.round(((recommendedRam - currentRam) / currentRam) * 50),
    reason: `${gameNames.join(', ')} recommend more RAM. Upgrading to ${recommendedRam}GB will ensure smooth performance.`,
    affectedGames: gameNames,
    prices: [],
    perGameImpact: gameNames.map(name => ({
      gameName: name,
      estimatedImprovement: 10, // RAM gives ~10% improvement when insufficient
      impactLevel: 'medium' as const
    }))
  }
}

/**
 * Generate storage upgrade recommendation
 */
export function generateStorageRecommendation(
  currentStorage: string,
  budget: number
): UpgradeRecommendation | null {
  // Only recommend if using HDD
  if (currentStorage !== 'hdd') {
    return null
  }

  // Typical NVMe SSD costs
  const nvmeCost = 80 // 1TB NVMe

  if (nvmeCost > budget) {
    return null
  }

  return {
    componentType: 'storage',
    currentComponent: 'HDD',
    recommendedComponent: {
      id: 'storage-nvme',
      type: 'storage',
      brand: '',  // Empty - will use matched brand from PCPartPicker
      model: '1TB NVMe SSD',  // Generic search term, brand added from match
      release_year: 2024,
      benchmark_score: 100,
      specs: { capacity: '1TB', type: 'NVMe' },
    },
    priorityScore: 75,
    priorityLabel: 'High',
    estimatedPerformanceGain: 400, // HDDs are ~5x slower than NVMe
    reason: 'Upgrading from HDD to NVMe SSD will dramatically reduce game load times from minutes to seconds.',
    affectedGames: [],
    prices: [],
  }
}

/**
 * Helper to convert priority score to label
 */
function getPriorityLabel(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= PRIORITY_THRESHOLDS.high) return 'High'
  if (score >= PRIORITY_THRESHOLDS.medium) return 'Medium'
  return 'Low'
}

/**
 * Detect if single-component upgrade creates new severe bottleneck
 * Warning if after upgrade, opposite component becomes bottleneck in many games
 */
async function detectSequentialBottleneck(
  recommendation: UpgradeRecommendation,
  currentCpu: Component,
  currentGpu: Component,
  perGameAnalysis: GameAnalysis[]
): Promise<UpgradePathWarning | null> {
  // Only check for CPU and GPU upgrades
  if (recommendation.componentType !== 'cpu' && recommendation.componentType !== 'gpu') {
    return null
  }

  // Simulate new component scores after upgrade
  const newCpuScore = recommendation.componentType === 'cpu'
    ? recommendation.recommendedComponent.benchmark_score
    : currentCpu.benchmark_score

  const newGpuScore = recommendation.componentType === 'gpu'
    ? recommendation.recommendedComponent.benchmark_score
    : currentGpu.benchmark_score

  // Calculate new bottlenecks per game
  let severeBottleneckCount = 0
  let cpuBottleneckCount = 0
  let gpuBottleneckCount = 0
  const affectedGames: string[] = []

  for (const analysis of perGameAnalysis) {
    const newBottleneck = calculateBottleneck(
      newCpuScore,
      newGpuScore,
      analysis.game.cpu_weight,
      analysis.game.gpu_weight
    )

    // Check if new bottleneck is severe (>30%)
    if (newBottleneck.percentage > 30 && newBottleneck.component !== 'balanced') {
      severeBottleneckCount++
      affectedGames.push(analysis.game.name)

      if (newBottleneck.component === 'cpu') cpuBottleneckCount++
      if (newBottleneck.component === 'gpu') gpuBottleneckCount++
    }
  }

  const gamesCount = perGameAnalysis.length
  const severeBottleneckPercentage = gamesCount > 0 ? (severeBottleneckCount / gamesCount) * 100 : 0

  // Determine if warning is needed
  let timeframe: '6-months' | '1-year' | null = null
  if (severeBottleneckPercentage >= 50) {
    timeframe = '6-months'
  } else if (severeBottleneckPercentage >= 30) {
    timeframe = '1-year'
  }

  if (!timeframe) {
    return null // No warning needed
  }

  // Determine which component will become the bottleneck
  const newBottleneckComponent = cpuBottleneckCount > gpuBottleneckCount ? 'cpu' : 'gpu'

  // Query for next upgrade tier (20-30% higher benchmark score)
  const oppositeComponent = recommendation.componentType === 'cpu' ? currentGpu : currentCpu
  const targetScore = oppositeComponent.benchmark_score * 1.25 // 25% improvement

  const { data: nextTierComponents } = await supabase
    .from('components')
    .select('*')
    .eq('type', newBottleneckComponent)
    .gte('benchmark_score', targetScore)
    .order('benchmark_score', { ascending: true })
    .limit(1)

  // Estimate next upgrade cost
  let estimatedNextUpgradeCost = 200 // Default fallback
  if (nextTierComponents && nextTierComponents.length > 0) {
    const nextComponent = nextTierComponents[0]
    const { data: priceData } = await supabase
      .from('prices')
      .select('price')
      .eq('component_id', nextComponent.id)
      .eq('in_stock', true)
      .order('price', { ascending: true })
      .limit(1)

    if (priceData && priceData.length > 0) {
      estimatedNextUpgradeCost = priceData[0].price
    }
  }

  // Get lowest price for current recommendation
  const { data: currentPriceData } = await supabase
    .from('prices')
    .select('price')
    .eq('component_id', recommendation.recommendedComponent.id)
    .eq('in_stock', true)
    .order('price', { ascending: true })
    .limit(1)

  const currentUpgradeCost = currentPriceData && currentPriceData.length > 0
    ? currentPriceData[0].price
    : 300 // Default fallback

  const totalUpgradeCost = currentUpgradeCost + estimatedNextUpgradeCost

  const recommendationText = timeframe === '6-months'
    ? `This ${recommendation.componentType.toUpperCase()} upgrade will likely create a ${newBottleneckComponent.toUpperCase()} bottleneck within 6 months for your games. Plan for a ${newBottleneckComponent.toUpperCase()} upgrade (~$${estimatedNextUpgradeCost}) soon after.`
    : `This ${recommendation.componentType.toUpperCase()} upgrade may create a ${newBottleneckComponent.toUpperCase()} bottleneck within a year for your games. Consider saving ~$${totalUpgradeCost} total for both upgrades.`

  return {
    willCreateBottleneck: true,
    timeframe,
    newBottleneckComponent,
    newBottleneckSeverity: Math.round(severeBottleneckPercentage),
    estimatedNextUpgradeCost,
    totalUpgradeCost,
    affectedGames: affectedGames.slice(0, 5),
    recommendation: recommendationText,
  }
}

/**
 * Generate all upgrade recommendations with priority ranking
 * Returns OperationResult to surface any partial failures
 */
export async function generateUpgradeRecommendations(params: {
  currentCpu: Component | null
  currentGpu: Component | null
  currentRam: number
  currentRamType?: string
  currentStorage?: string
  perGameAnalysis: GameAnalysis[]
  budget: number
  componentAges: ComponentAge[]
}): Promise<OperationResult<UpgradeRecommendation[]>> {
  const { currentCpu, currentGpu, currentRam, currentRamType = 'DDR5', currentStorage, perGameAnalysis, budget, componentAges } = params
  const recommendations: UpgradeRecommendation[] = []
  const warnings: string[] = []
  const partialFailures: PartialFailure[] = []

  // Find games where GPU is the bottleneck
  const gpuBottleneckGames = perGameAnalysis.filter(
    (a) => a.bottleneck.component === 'gpu' && a.bottleneck.percentage > BOTTLENECK_THRESHOLD
  )

  // Find games where CPU is the bottleneck
  const cpuBottleneckGames = perGameAnalysis.filter(
    (a) => a.bottleneck.component === 'cpu' && a.bottleneck.percentage > BOTTLENECK_THRESHOLD
  )

  // Find games with insufficient RAM
  const ramDeficitGames = perGameAnalysis.filter((a) => !a.ramSufficient)
  const maxRamDeficit = Math.max(...perGameAnalysis.map((a) => a.ramDeficit), 0)

  // GPU Upgrade recommendation - trigger on bottleneck OR component age
  const gpuIsAged = currentGpu && isComponentAged(currentGpu.release_year, 'gpu')
  if (currentGpu && (gpuBottleneckGames.length > 0 || gpuIsAged)) {
    const gpuResult = await findUpgradeCandidates(
      currentGpu.benchmark_score,
      budget,
      'gpu'
    )

    // Collect any warnings/failures from the lookup
    warnings.push(...gpuResult.warnings)
    partialFailures.push(...gpuResult.partialFailures)

    const currentYear = new Date().getFullYear()
    const gpuAgeYears = currentGpu.release_year ? currentYear - currentGpu.release_year : 0
    const gpuAge = componentAges.find((a) => a.type === 'gpu')

    if (gpuResult.data.length > 0) {
      // Primary candidate is the best performer (first in the list, sorted desc by performance)
      const primaryCandidate = gpuResult.data[0]
      const recommended = primaryCandidate.component
      const lowestPrice = primaryCandidate.seedPrice
      const performanceGain = Math.round(
        ((recommended.benchmark_score - currentGpu.benchmark_score) /
          currentGpu.benchmark_score) *
          100
      )

      // Build alternatives array (remaining candidates)
      const alternatives = gpuResult.data.slice(1).map((candidate) => ({
        component: candidate.component,
        estimatedPerformanceGain: Math.round(
          ((candidate.component.benchmark_score - currentGpu.benchmark_score) /
            currentGpu.benchmark_score) *
            100
        ),
        seedPrice: candidate.seedPrice,
      }))

      // Calculate value scores for all candidates (for diminishing returns visualization)
      const allCandidates: UpgradeCandidate[] = [
        {
          component: recommended,
          estimatedPerformanceGain: performanceGain,
          seedPrice: lowestPrice,
        },
        ...alternatives,
      ]

      const candidatesWithValue = allCandidates.map((candidate) => ({
        ...candidate,
        valueScore: candidate.seedPrice > 0 ? (candidate.estimatedPerformanceGain / candidate.seedPrice) * 100 : 0,
      }))

      // Find sweet spot (highest value score)
      const sweetSpotIndex = candidatesWithValue.reduce((maxIdx, candidate, idx, arr) =>
        candidate.valueScore > arr[maxIdx].valueScore ? idx : maxIdx
      , 0)

      // For age-only recommendations (no bottleneck), use lower priority
      const avgBottleneck = gpuBottleneckGames.length > 0
        ? gpuBottleneckGames.reduce((sum, g) => sum + g.bottleneck.percentage, 0) / gpuBottleneckGames.length
        : 0

      const priorityScore = gpuBottleneckGames.length > 0
        ? calculateUpgradePriority({
            bottleneckPercentage: avgBottleneck,
            ageYears: gpuAge?.ageYears || 0,
            componentType: 'gpu',
            estimatedCost: lowestPrice || budget,
            performanceGain: recommended.benchmark_score - currentGpu.benchmark_score,
          })
        : Math.min(50, calculateUpgradePriority({
            bottleneckPercentage: 0,
            ageYears: gpuAgeYears,
            componentType: 'gpu',
            estimatedCost: lowestPrice || budget,
            performanceGain: recommended.benchmark_score - currentGpu.benchmark_score,
          }))

      // Generate reason - different for age-based vs bottleneck-based
      const reason = gpuBottleneckGames.length > 0
        ? generateRecommendationReason(
            'gpu',
            `${currentGpu.brand} ${currentGpu.model}`,
            recommended,
            gpuBottleneckGames,
            performanceGain,
            gpuAge
          )
        : `Your ${currentGpu.brand} ${currentGpu.model} is ${gpuAgeYears} years old. ` +
          `GPUs typically remain competitive for ${COMPONENT_LIFESPANS.gpu} years. ` +
          `Upgrading to ${recommended.brand} ${recommended.model} offers ~${performanceGain}% improvement.`

      const gpuRecommendation: UpgradeRecommendation = {
        componentType: 'gpu',
        currentComponent: `${currentGpu.brand} ${currentGpu.model}`,
        recommendedComponent: recommended,
        priorityScore,
        priorityLabel: getPriorityLabel(priorityScore),
        estimatedPerformanceGain: performanceGain,
        reason,
        affectedGames: gpuBottleneckGames.map((a) => a.game.name),
        prices: [],
        alternatives: alternatives.length > 0 ? alternatives : undefined,
        perGameImpact: calculatePerGameImpact('gpu', performanceGain, perGameAnalysis),
        candidatesWithValue: candidatesWithValue.length > 2 ? candidatesWithValue : undefined,
        sweetSpotIndex: candidatesWithValue.length > 2 ? sweetSpotIndex : undefined,
      }

      // Detect if this upgrade creates a new bottleneck
      if (currentCpu) {
        const pathWarning = await detectSequentialBottleneck(
          gpuRecommendation,
          currentCpu,
          currentGpu,
          perGameAnalysis
        )
        if (pathWarning) {
          gpuRecommendation.pathWarning = pathWarning
        }
      }

      recommendations.push(gpuRecommendation)
    } else if (gpuIsAged) {
      // Fallback for age-based recommendation when no specific products found
      // Create a generic recommendation without a specific upgrade target
      const priorityScore = Math.min(50, 20 + gpuAgeYears * 5) // Base 20 + 5 per year of age

      recommendations.push({
        componentType: 'gpu',
        currentComponent: `${currentGpu.brand} ${currentGpu.model}`,
        recommendedComponent: {
          id: 'gpu-upgrade-generic',
          type: 'gpu',
          brand: '',
          model: 'Modern GPU',
          release_year: currentYear,
          benchmark_score: currentGpu.benchmark_score * 2, // Estimate 2x improvement
          specs: {},
        },
        priorityScore,
        priorityLabel: getPriorityLabel(priorityScore),
        estimatedPerformanceGain: 100, // Conservative estimate
        reason: `Your ${currentGpu.brand} ${currentGpu.model} is ${gpuAgeYears} years old. ` +
          `GPUs typically remain competitive for ${COMPONENT_LIFESPANS.gpu} years. ` +
          `Consider browsing current-generation GPUs for a significant performance upgrade.`,
        affectedGames: gpuBottleneckGames.map((a) => a.game.name),
        prices: [],
        perGameImpact: calculatePerGameImpact('gpu', 100, perGameAnalysis),
      })
    }
  }

  // CPU Upgrade recommendation - trigger on bottleneck OR component age
  const cpuIsAged = currentCpu && isComponentAged(currentCpu.release_year, 'cpu')
  if (currentCpu && (cpuBottleneckGames.length > 0 || cpuIsAged)) {
    const cpuResult = await findUpgradeCandidates(
      currentCpu.benchmark_score,
      budget,
      'cpu'
    )

    // Collect any warnings/failures from the lookup
    warnings.push(...cpuResult.warnings)
    partialFailures.push(...cpuResult.partialFailures)

    const currentYear = new Date().getFullYear()
    const cpuAgeYears = currentCpu.release_year ? currentYear - currentCpu.release_year : 0
    const cpuAge = componentAges.find((a) => a.type === 'cpu')

    if (cpuResult.data.length > 0) {
      // Primary candidate is the best performer (first in the list, sorted desc by performance)
      const primaryCandidate = cpuResult.data[0]
      const recommended = primaryCandidate.component
      const lowestPrice = primaryCandidate.seedPrice
      const performanceGain = Math.round(
        ((recommended.benchmark_score - currentCpu.benchmark_score) /
          currentCpu.benchmark_score) *
          100
      )

      // Build alternatives array (remaining candidates)
      const alternatives = cpuResult.data.slice(1).map((candidate) => ({
        component: candidate.component,
        estimatedPerformanceGain: Math.round(
          ((candidate.component.benchmark_score - currentCpu.benchmark_score) /
            currentCpu.benchmark_score) *
            100
        ),
        seedPrice: candidate.seedPrice,
      }))

      // Calculate value scores for all candidates (for diminishing returns visualization)
      const allCandidates: UpgradeCandidate[] = [
        {
          component: recommended,
          estimatedPerformanceGain: performanceGain,
          seedPrice: lowestPrice,
        },
        ...alternatives,
      ]

      const candidatesWithValue = allCandidates.map((candidate) => ({
        ...candidate,
        valueScore: candidate.seedPrice > 0 ? (candidate.estimatedPerformanceGain / candidate.seedPrice) * 100 : 0,
      }))

      // Find sweet spot (highest value score)
      const sweetSpotIndex = candidatesWithValue.reduce((maxIdx, candidate, idx, arr) =>
        candidate.valueScore > arr[maxIdx].valueScore ? idx : maxIdx
      , 0)

      // For age-only recommendations (no bottleneck), use lower priority
      const avgBottleneck = cpuBottleneckGames.length > 0
        ? cpuBottleneckGames.reduce((sum, g) => sum + g.bottleneck.percentage, 0) / cpuBottleneckGames.length
        : 0

      const priorityScore = cpuBottleneckGames.length > 0
        ? calculateUpgradePriority({
            bottleneckPercentage: avgBottleneck,
            ageYears: cpuAge?.ageYears || 0,
            componentType: 'cpu',
            estimatedCost: lowestPrice || budget,
            performanceGain: recommended.benchmark_score - currentCpu.benchmark_score,
          })
        : Math.min(50, calculateUpgradePriority({
            bottleneckPercentage: 0,
            ageYears: cpuAgeYears,
            componentType: 'cpu',
            estimatedCost: lowestPrice || budget,
            performanceGain: recommended.benchmark_score - currentCpu.benchmark_score,
          }))

      // Generate reason - different for age-based vs bottleneck-based
      const reason = cpuBottleneckGames.length > 0
        ? generateRecommendationReason(
            'cpu',
            `${currentCpu.brand} ${currentCpu.model}`,
            recommended,
            cpuBottleneckGames,
            performanceGain,
            cpuAge
          )
        : `Your ${currentCpu.brand} ${currentCpu.model} is ${cpuAgeYears} years old. ` +
          `CPUs typically remain competitive for ${COMPONENT_LIFESPANS.cpu} years. ` +
          `Upgrading to ${recommended.brand} ${recommended.model} offers ~${performanceGain}% improvement.`

      const cpuRecommendation: UpgradeRecommendation = {
        componentType: 'cpu',
        currentComponent: `${currentCpu.brand} ${currentCpu.model}`,
        recommendedComponent: recommended,
        priorityScore,
        priorityLabel: getPriorityLabel(priorityScore),
        estimatedPerformanceGain: performanceGain,
        reason,
        affectedGames: cpuBottleneckGames.map((a) => a.game.name),
        prices: [],
        alternatives: alternatives.length > 0 ? alternatives : undefined,
        perGameImpact: calculatePerGameImpact('cpu', performanceGain, perGameAnalysis),
        candidatesWithValue: candidatesWithValue.length > 2 ? candidatesWithValue : undefined,
        sweetSpotIndex: candidatesWithValue.length > 2 ? sweetSpotIndex : undefined,
      }

      // Detect if this upgrade creates a new bottleneck
      if (currentGpu) {
        const pathWarning = await detectSequentialBottleneck(
          cpuRecommendation,
          currentCpu,
          currentGpu,
          perGameAnalysis
        )
        if (pathWarning) {
          cpuRecommendation.pathWarning = pathWarning
        }
      }

      recommendations.push(cpuRecommendation)
    } else if (cpuIsAged) {
      // Fallback for age-based recommendation when no specific products found
      // Create a generic recommendation without a specific upgrade target
      const priorityScore = Math.min(50, 20 + cpuAgeYears * 5) // Base 20 + 5 per year of age

      recommendations.push({
        componentType: 'cpu',
        currentComponent: `${currentCpu.brand} ${currentCpu.model}`,
        recommendedComponent: {
          id: 'cpu-upgrade-generic',
          type: 'cpu',
          brand: '',
          model: 'Modern CPU',
          release_year: currentYear,
          benchmark_score: currentCpu.benchmark_score * 2, // Estimate 2x improvement
          specs: {},
        },
        priorityScore,
        priorityLabel: getPriorityLabel(priorityScore),
        estimatedPerformanceGain: 100, // Conservative estimate
        reason: `Your ${currentCpu.brand} ${currentCpu.model} is ${cpuAgeYears} years old. ` +
          `CPUs typically remain competitive for ${COMPONENT_LIFESPANS.cpu} years. ` +
          `Consider browsing current-generation CPUs for a significant performance upgrade.`,
        affectedGames: cpuBottleneckGames.map((a) => a.game.name),
        prices: [],
        perGameImpact: calculatePerGameImpact('cpu', 100, perGameAnalysis),
      })
    }
  }

  // RAM Upgrade recommendation
  if (maxRamDeficit > 0) {
    const ramRec = generateRamRecommendation(
      currentRam,
      maxRamDeficit,
      ramDeficitGames,
      budget,
      currentRamType
    )
    if (ramRec) {
      recommendations.push(ramRec)
    }
  }

  // Storage Upgrade recommendation
  if (currentStorage) {
    const storageRec = generateStorageRecommendation(currentStorage, budget)
    if (storageRec) {
      recommendations.push(storageRec)
    }
  }

  // Sort by priority score (highest first)
  recommendations.sort((a, b) => b.priorityScore - a.priorityScore)

  return { data: recommendations, warnings, partialFailures }
}
