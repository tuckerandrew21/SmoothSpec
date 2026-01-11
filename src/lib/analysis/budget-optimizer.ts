/**
 * Budget Split Advisor - Finds optimal CPU+GPU combinations within budget
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { calculateBottleneck } from '../benchmarks'
import { BENCHMARK_SCALES } from '../constants'
import { findUpgradeCandidates, type CandidateWithPrice } from './recommendations'
import type { Component, GameAnalysis, ComboRecommendation } from '@/types/analysis'

/**
 * Calculate weighted performance gain for a combo upgrade
 * Uses min(cpu_gain, gpu_gain) because bottleneck limits total gain
 */
function calculateComboPerformanceGain(
  currentCpuScore: number,
  currentGpuScore: number,
  newCpuScore: number,
  newGpuScore: number,
  perGameAnalysis: GameAnalysis[]
): { totalGain: number; perGameImpact: ComboRecommendation['perGameImpact'] } {
  const perGameImpact: ComboRecommendation['perGameImpact'] = []
  let totalWeightedGain = 0
  let totalWeight = 0

  for (const analysis of perGameAnalysis) {
    const game = analysis.game

    // Calculate individual component gains
    const cpuGain = ((newCpuScore - currentCpuScore) / currentCpuScore) * 100 * game.cpu_weight
    const gpuGain = ((newGpuScore - currentGpuScore) / currentGpuScore) * 100 * game.gpu_weight

    // Total improvement is limited by the bottleneck (min gain)
    const effectiveGain = Math.min(cpuGain, gpuGain)
    const totalImprovement = Math.max(0, effectiveGain)

    // Weight by game importance (higher weights = more important games)
    const gameWeight = game.cpu_weight + game.gpu_weight
    totalWeightedGain += totalImprovement * gameWeight
    totalWeight += gameWeight

    perGameImpact.push({
      gameName: game.name,
      cpuContribution: cpuGain,
      gpuContribution: gpuGain,
      totalImprovement: Math.round(totalImprovement),
    })
  }

  const totalGain = totalWeight > 0 ? totalWeightedGain / totalWeight : 0

  return { totalGain, perGameImpact }
}

/**
 * Detect if combo creates a new severe bottleneck
 * Returns true if after upgrade, opposite component becomes bottleneck >40%
 */
function detectNewBottleneck(
  newCpuScore: number,
  newGpuScore: number,
  perGameAnalysis: GameAnalysis[]
): { warnsAboutNewBottleneck: boolean; newBottleneckComponent?: 'cpu' | 'gpu'; severity: number } {
  let severeBottleneckCount = 0
  let cpuBottleneckCount = 0
  let gpuBottleneckCount = 0

  for (const analysis of perGameAnalysis) {
    const newBottleneck = calculateBottleneck(
      newCpuScore,
      newGpuScore,
      analysis.game.cpu_weight,
      analysis.game.gpu_weight
    )

    if (newBottleneck.percentage > 40) {
      severeBottleneckCount++
      if (newBottleneck.component === 'cpu') cpuBottleneckCount++
      if (newBottleneck.component === 'gpu') gpuBottleneckCount++
    }
  }

  const gamesCount = perGameAnalysis.length
  const severeBottleneckPercentage = (severeBottleneckCount / gamesCount) * 100

  // Warn if >30% of games hit severe new bottleneck
  const warnsAboutNewBottleneck = severeBottleneckPercentage > 30
  const newBottleneckComponent = cpuBottleneckCount > gpuBottleneckCount ? 'cpu' : 'gpu'

  return {
    warnsAboutNewBottleneck,
    newBottleneckComponent: warnsAboutNewBottleneck ? newBottleneckComponent : undefined,
    severity: severeBottleneckPercentage,
  }
}

/**
 * Compare combo to best single-component upgrade
 */
function compareToSingleUpgrade(
  comboGain: number,
  comboCost: number,
  cpuCandidate: CandidateWithPrice | null,
  gpuCandidate: CandidateWithPrice | null,
  currentCpuScore: number,
  currentGpuScore: number,
  perGameAnalysis: GameAnalysis[]
): ComboRecommendation['comparedToSingleUpgrade'] | undefined {
  // Find which single upgrade would be better
  const candidates: Array<{ component: 'cpu' | 'gpu'; cost: number; gain: number }> = []

  if (cpuCandidate) {
    // Calculate CPU-only gain
    const { totalGain } = calculateComboPerformanceGain(
      currentCpuScore,
      currentGpuScore,
      cpuCandidate.component.benchmark_score,
      currentGpuScore,
      perGameAnalysis
    )
    candidates.push({ component: 'cpu', cost: cpuCandidate.seedPrice, gain: totalGain })
  }

  if (gpuCandidate) {
    // Calculate GPU-only gain
    const { totalGain } = calculateComboPerformanceGain(
      currentCpuScore,
      currentGpuScore,
      currentCpuScore,
      gpuCandidate.component.benchmark_score,
      perGameAnalysis
    )
    candidates.push({ component: 'gpu', cost: gpuCandidate.seedPrice, gain: totalGain })
  }

  if (candidates.length === 0) return undefined

  // Pick the better single upgrade
  const bestSingle = candidates.reduce((best, curr) =>
    curr.gain > best.gain ? curr : best
  )

  return {
    component: bestSingle.component,
    cost: bestSingle.cost,
    gain: Math.round(bestSingle.gain),
    differenceGain: Math.round(comboGain - bestSingle.gain),
  }
}

/**
 * Generate combo recommendations
 */
export async function generateComboRecommendations(params: {
  currentCpu: Component
  currentGpu: Component
  perGameAnalysis: GameAnalysis[]
  budget: number
  supabase: SupabaseClient
}): Promise<ComboRecommendation[]> {
  const { currentCpu, currentGpu, perGameAnalysis, budget } = params

  // Need at least $300 budget to make combo worthwhile
  if (budget < 300) {
    return []
  }

  // Get affordable CPU and GPU candidates
  const cpuCandidatesResult = await findUpgradeCandidates(
    currentCpu.benchmark_score,
    budget,
    'cpu'
  )

  const gpuCandidatesResult = await findUpgradeCandidates(
    currentGpu.benchmark_score,
    budget,
    'gpu'
  )

  const cpuCandidates = cpuCandidatesResult.data || []
  const gpuCandidates = gpuCandidatesResult.data || []

  if (cpuCandidates.length === 0 || gpuCandidates.length === 0) {
    return []
  }

  // Generate all affordable combinations
  const combos: Array<{
    cpu: CandidateWithPrice
    gpu: CandidateWithPrice
    totalCost: number
    totalGain: number
    valueScore: number
    perGameImpact: ComboRecommendation['perGameImpact']
    bottleneckInfo: ReturnType<typeof detectNewBottleneck>
  }> = []

  for (const cpuCandidate of cpuCandidates) {
    for (const gpuCandidate of gpuCandidates) {
      const totalCost = cpuCandidate.seedPrice + gpuCandidate.seedPrice

      // Skip if over budget
      if (totalCost > budget) continue

      // Skip if upgrade is too small (< 10% improvement in both components)
      const cpuImprovement = ((cpuCandidate.component.benchmark_score - currentCpu.benchmark_score) / currentCpu.benchmark_score) * 100
      const gpuImprovement = ((gpuCandidate.component.benchmark_score - currentGpu.benchmark_score) / currentGpu.benchmark_score) * 100
      if (cpuImprovement < 10 && gpuImprovement < 10) continue

      const { totalGain, perGameImpact } = calculateComboPerformanceGain(
        currentCpu.benchmark_score,
        currentGpu.benchmark_score,
        cpuCandidate.component.benchmark_score,
        gpuCandidate.component.benchmark_score,
        perGameAnalysis
      )

      const bottleneckInfo = detectNewBottleneck(
        cpuCandidate.component.benchmark_score,
        gpuCandidate.component.benchmark_score,
        perGameAnalysis
      )

      // Filter out combos that create severe new bottlenecks
      if (bottleneckInfo.severity > 50) continue

      const valueScore = totalCost > 0 ? (totalGain / totalCost) * 100 : 0

      combos.push({
        cpu: cpuCandidate,
        gpu: gpuCandidate,
        totalCost,
        totalGain,
        valueScore,
        perGameImpact,
        bottleneckInfo,
      })
    }
  }

  // Sort by value score (descending)
  combos.sort((a, b) => b.valueScore - a.valueScore)

  // Return top 2-3 combos
  const topCombos = combos.slice(0, 3)

  // Convert to ComboRecommendation format
  const recommendations: ComboRecommendation[] = topCombos.map((combo) => {
    const affectedGames = combo.perGameImpact
      .filter(impact => impact.totalImprovement > 5)
      .sort((a, b) => b.totalImprovement - a.totalImprovement)
      .slice(0, 5)
      .map(impact => impact.gameName)

    const reasonForCombo = `Upgrading both CPU and GPU together provides ~${Math.round(combo.totalGain)}% performance improvement across your games. This balanced approach ensures neither component becomes a bottleneck.`

    return {
      components: {
        cpu: combo.cpu.component,
        gpu: combo.gpu.component,
      },
      totalCost: combo.totalCost,
      totalPerformanceGain: Math.round(combo.totalGain),
      reasonForCombo,
      affectedGames,
      perGameImpact: combo.perGameImpact,
      warnsAboutNewBottleneck: combo.bottleneckInfo.warnsAboutNewBottleneck,
      newBottleneckComponent: combo.bottleneckInfo.newBottleneckComponent,
      comparedToSingleUpgrade: compareToSingleUpgrade(
        combo.totalGain,
        combo.totalCost,
        cpuCandidates[0] || null,
        gpuCandidates[0] || null,
        currentCpu.benchmark_score,
        currentGpu.benchmark_score,
        perGameAnalysis
      ),
    }
  })

  return recommendations
}
