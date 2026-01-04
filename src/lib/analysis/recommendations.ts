/**
 * Recommendation generator for SmoothSpec
 * Handles upgrade suggestions with budget filtering and priority ranking
 */

import { supabase } from '../supabase'
import { calculateUpgradePriority } from '../benchmarks'
import { BOTTLENECK_THRESHOLD, PRIORITY_THRESHOLDS, RAM_UPGRADE_COSTS } from '../constants'
import type { OperationResult, PartialFailure } from '../errors'
import type { Component, GameAnalysis, ComponentAge, UpgradeRecommendation } from '@/types/analysis'

/**
 * Find upgrade candidates for a component type within budget
 * Returns OperationResult to surface any errors that occurred
 */
export async function findUpgradeCandidates(
  currentBenchmarkScore: number,
  budget: number,
  componentType: 'cpu' | 'gpu'
): Promise<OperationResult<Component[]>> {
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

  // Filter components that have at least one price within budget
  const affordableComponents: Component[] = []
  const priceMap = new Map<string, number>()

  if (prices) {
    for (const price of prices) {
      const existing = priceMap.get(price.component_id)
      if (!existing || price.price < existing) {
        priceMap.set(price.component_id, price.price)
      }
    }
  }

  for (const comp of components) {
    const lowestPrice = priceMap.get(comp.id)
    if (lowestPrice !== undefined && lowestPrice <= budget) {
      affordableComponents.push(comp as Component)
    }
  }

  return { data: affordableComponents, warnings, partialFailures }
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
 * Generate RAM upgrade recommendation
 */
export function generateRamRecommendation(
  currentRam: number,
  ramDeficit: number,
  affectedGames: GameAnalysis[],
  budget: number
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
    currentComponent: `${currentRam}GB RAM`,
    recommendedComponent: {
      id: 'ram-upgrade',
      type: 'ram',
      brand: 'Generic',
      model: `${recommendedRam}GB DDR5`,
      release_year: 2024,
      benchmark_score: recommendedRam * 100,
      specs: { capacity: recommendedRam, type: 'DDR5' },
    },
    priorityScore: 60,
    priorityLabel: 'Medium',
    estimatedPerformanceGain: Math.round(((recommendedRam - currentRam) / currentRam) * 50),
    reason: `${gameNames.join(', ')} recommend more RAM. Upgrading to ${recommendedRam}GB will ensure smooth performance.`,
    affectedGames: gameNames,
    prices: [],
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
      brand: 'Generic',
      model: '1TB NVMe SSD',
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
 * Generate all upgrade recommendations with priority ranking
 * Returns OperationResult to surface any partial failures
 */
export async function generateUpgradeRecommendations(params: {
  currentCpu: Component | null
  currentGpu: Component | null
  currentRam: number
  currentStorage?: string
  perGameAnalysis: GameAnalysis[]
  budget: number
  componentAges: ComponentAge[]
}): Promise<OperationResult<UpgradeRecommendation[]>> {
  const { currentCpu, currentGpu, currentRam, currentStorage, perGameAnalysis, budget, componentAges } = params
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

  // GPU Upgrade recommendation
  if (currentGpu && gpuBottleneckGames.length > 0) {
    const gpuResult = await findUpgradeCandidates(
      currentGpu.benchmark_score,
      budget,
      'gpu'
    )

    // Collect any warnings/failures from the lookup
    warnings.push(...gpuResult.warnings)
    partialFailures.push(...gpuResult.partialFailures)

    if (gpuResult.data.length > 0) {
      // Pick the best value candidate (highest score within budget)
      const recommended = gpuResult.data[gpuResult.data.length - 1]
      const lowestPrice = await getLowestPrice(recommended.id)
      const performanceGain = Math.round(
        ((recommended.benchmark_score - currentGpu.benchmark_score) /
          currentGpu.benchmark_score) *
          100
      )

      const gpuAge = componentAges.find((a) => a.type === 'gpu')
      const avgBottleneck =
        gpuBottleneckGames.reduce((sum, g) => sum + g.bottleneck.percentage, 0) /
        gpuBottleneckGames.length

      const priorityScore = calculateUpgradePriority({
        bottleneckPercentage: avgBottleneck,
        ageYears: gpuAge?.ageYears || 0,
        componentType: 'gpu',
        estimatedCost: lowestPrice || budget,
        performanceGain: recommended.benchmark_score - currentGpu.benchmark_score,
      })

      recommendations.push({
        componentType: 'gpu',
        currentComponent: `${currentGpu.brand} ${currentGpu.model}`,
        recommendedComponent: recommended,
        priorityScore,
        priorityLabel: getPriorityLabel(priorityScore),
        estimatedPerformanceGain: performanceGain,
        reason: generateRecommendationReason(
          'gpu',
          `${currentGpu.brand} ${currentGpu.model}`,
          recommended,
          gpuBottleneckGames,
          performanceGain,
          gpuAge
        ),
        affectedGames: gpuBottleneckGames.map((a) => a.game.name),
        prices: [],
      })
    }
  }

  // CPU Upgrade recommendation
  if (currentCpu && cpuBottleneckGames.length > 0) {
    const cpuResult = await findUpgradeCandidates(
      currentCpu.benchmark_score,
      budget,
      'cpu'
    )

    // Collect any warnings/failures from the lookup
    warnings.push(...cpuResult.warnings)
    partialFailures.push(...cpuResult.partialFailures)

    if (cpuResult.data.length > 0) {
      const recommended = cpuResult.data[cpuResult.data.length - 1]
      const lowestPrice = await getLowestPrice(recommended.id)
      const performanceGain = Math.round(
        ((recommended.benchmark_score - currentCpu.benchmark_score) /
          currentCpu.benchmark_score) *
          100
      )

      const cpuAge = componentAges.find((a) => a.type === 'cpu')
      const avgBottleneck =
        cpuBottleneckGames.reduce((sum, g) => sum + g.bottleneck.percentage, 0) /
        cpuBottleneckGames.length

      const priorityScore = calculateUpgradePriority({
        bottleneckPercentage: avgBottleneck,
        ageYears: cpuAge?.ageYears || 0,
        componentType: 'cpu',
        estimatedCost: lowestPrice || budget,
        performanceGain: recommended.benchmark_score - currentCpu.benchmark_score,
      })

      recommendations.push({
        componentType: 'cpu',
        currentComponent: `${currentCpu.brand} ${currentCpu.model}`,
        recommendedComponent: recommended,
        priorityScore,
        priorityLabel: getPriorityLabel(priorityScore),
        estimatedPerformanceGain: performanceGain,
        reason: generateRecommendationReason(
          'cpu',
          `${currentCpu.brand} ${currentCpu.model}`,
          recommended,
          cpuBottleneckGames,
          performanceGain,
          cpuAge
        ),
        affectedGames: cpuBottleneckGames.map((a) => a.game.name),
        prices: [],
      })
    }
  }

  // RAM Upgrade recommendation
  if (maxRamDeficit > 0) {
    const ramRec = generateRamRecommendation(
      currentRam,
      maxRamDeficit,
      ramDeficitGames,
      budget
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
