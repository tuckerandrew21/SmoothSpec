/**
 * Analysis engine for SmoothSpec recommendation system
 * Handles bottleneck analysis, age warnings, and build scoring
 */

import { calculateBottleneck, getCpuTier, getGpuTier } from '../benchmarks'
import {
  BOTTLENECK_THRESHOLD,
  DEFAULT_BUILD_SCORE,
  SCORE_DEDUCTIONS,
  STORAGE_PERFORMANCE,
  STORAGE_LABELS,
  POWER_ESTIMATES,
  PSU_HEADROOM,
} from '../constants'
import type { BuildData } from '@/types/build'
import type { Component, Game, GameAnalysis, ComponentAge, StorageAnalysis, PsuAnalysis } from '@/types/analysis'

/**
 * Analyze performance for a single game given user's hardware
 */
export function analyzeGamePerformance(
  cpuScore: number,
  gpuScore: number,
  userRam: number,
  game: Game
): GameAnalysis {
  const bottleneck = calculateBottleneck(cpuScore, gpuScore, game.cpu_weight, game.gpu_weight)

  const ramSufficient = userRam >= game.ram_requirement
  const ramDeficit = ramSufficient ? 0 : game.ram_requirement - userRam

  // Generate game-specific recommendation
  let recommendation: string

  if (bottleneck.component === 'balanced' && ramSufficient) {
    recommendation = `Your system is well-balanced for ${game.name}.`
  } else if (bottleneck.component === 'gpu') {
    const severity = bottleneck.percentage > 25 ? 'significant' : 'moderate'
    recommendation = `GPU is the ${severity} bottleneck (${bottleneck.percentage}%). Consider upgrading for better performance in ${game.name}.`
  } else if (bottleneck.component === 'cpu') {
    const severity = bottleneck.percentage > 25 ? 'significant' : 'moderate'
    recommendation = `CPU is the ${severity} bottleneck (${bottleneck.percentage}%). This especially affects ${game.name}'s simulation/AI systems.`
  } else {
    recommendation = `Your system is balanced for ${game.name}.`
  }

  if (!ramSufficient) {
    recommendation += ` Also, ${game.name} recommends ${game.ram_requirement}GB RAM (you have ${userRam}GB).`
  }

  return {
    game,
    bottleneck,
    ramSufficient,
    ramDeficit,
    recommendation,
  }
}

/**
 * Aggregate analysis results across multiple games
 * Returns the overall system bottleneck trend
 */
export function aggregateGameAnalyses(
  analyses: GameAnalysis[]
): { component: 'cpu' | 'gpu' | 'balanced'; averagePercentage: number } {
  if (analyses.length === 0) {
    return { component: 'balanced', averagePercentage: 0 }
  }

  let cpuBottleneckSum = 0
  let gpuBottleneckSum = 0
  let cpuCount = 0
  let gpuCount = 0

  for (const analysis of analyses) {
    if (analysis.bottleneck.component === 'cpu') {
      cpuBottleneckSum += analysis.bottleneck.percentage
      cpuCount++
    } else if (analysis.bottleneck.component === 'gpu') {
      gpuBottleneckSum += analysis.bottleneck.percentage
      gpuCount++
    }
  }

  const cpuAvg = cpuCount > 0 ? cpuBottleneckSum / cpuCount : 0
  const gpuAvg = gpuCount > 0 ? gpuBottleneckSum / gpuCount : 0

  // Determine dominant bottleneck
  if (cpuCount > gpuCount && cpuAvg > BOTTLENECK_THRESHOLD) {
    return { component: 'cpu', averagePercentage: Math.round(cpuAvg) }
  } else if (gpuCount > cpuCount && gpuAvg > BOTTLENECK_THRESHOLD) {
    return { component: 'gpu', averagePercentage: Math.round(gpuAvg) }
  } else if (cpuAvg > gpuAvg && cpuAvg > BOTTLENECK_THRESHOLD) {
    return { component: 'cpu', averagePercentage: Math.round(cpuAvg) }
  } else if (gpuAvg > cpuAvg && gpuAvg > BOTTLENECK_THRESHOLD) {
    return { component: 'gpu', averagePercentage: Math.round(gpuAvg) }
  }

  return { component: 'balanced', averagePercentage: 0 }
}

/**
 * Generate age-based warnings for components
 * Note: Currently returns empty array as purchase dates are not collected in MVP
 */
export function generateComponentAgeWarnings(
  _buildData: BuildData,
  _cpu: Component | null,
  _gpu: Component | null
): ComponentAge[] {
  // Age warnings disabled - purchase dates not collected in MVP
  return []
}

/**
 * Calculate overall build score (0-100)
 * Higher = better gaming performance
 */
export function calculateBuildScore(
  analyses: GameAnalysis[],
  componentAges: ComponentAge[]
): number {
  if (analyses.length === 0) {
    return DEFAULT_BUILD_SCORE
  }

  // Base score starts at 100
  let score = 100

  // Deduct for bottlenecks
  for (const analysis of analyses) {
    if (analysis.bottleneck.component !== 'balanced') {
      // Deduct based on bottleneck severity
      score -= Math.min(analysis.bottleneck.percentage * 0.5, SCORE_DEDUCTIONS.maxBottleneckPerGame)
    }
    if (!analysis.ramSufficient) {
      score -= SCORE_DEDUCTIONS.ramInsufficient
    }
  }

  // Deduct for component age
  for (const age of componentAges) {
    if (age.urgency === 'high') {
      score -= SCORE_DEDUCTIONS.highAgeComponent
    } else if (age.urgency === 'medium') {
      score -= SCORE_DEDUCTIONS.mediumAgeComponent
    }
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Parse RAM string from BuildData to number
 * Handles both old format ("16") and new format ("ddr5-16")
 */
export function parseRamAmount(ramString: string): number {
  // New format: "ddr5-16" or "ddr4-32"
  if (ramString.includes('-')) {
    const size = ramString.split('-')[1]
    const parsed = parseInt(size, 10)
    return isNaN(parsed) ? 16 : parsed
  }
  // Old format: "16"
  const parsed = parseInt(ramString, 10)
  return isNaN(parsed) ? 16 : parsed // Default to 16GB if parsing fails
}

/**
 * Parse RAM type from BuildData
 * Returns "DDR4" or "DDR5" (uppercase for display)
 */
export function parseRamType(ramString: string): string {
  if (ramString.includes('-')) {
    const type = ramString.split('-')[0]
    return type.toUpperCase()
  }
  // Default to DDR5 for old format without type
  return 'DDR5'
}

/**
 * Analyze storage performance
 * Checks if HDD when SSD would significantly improve load times
 */
export function analyzeStorage(storageType: string): StorageAnalysis {
  const performanceScore = STORAGE_PERFORMANCE[storageType] || 50
  const storageLabel = STORAGE_LABELS[storageType] || storageType

  let recommendation: string
  let needsUpgrade = false

  if (storageType === 'hdd') {
    recommendation = 'HDD detected. Upgrading to an NVMe SSD will dramatically improve game load times and system responsiveness.'
    needsUpgrade = true
  } else if (storageType === 'sata-ssd') {
    recommendation = 'SATA SSD provides good performance. An NVMe SSD would offer faster load times for larger games.'
    needsUpgrade = false
  } else {
    recommendation = 'NVMe SSD provides optimal storage performance for gaming.'
    needsUpgrade = false
  }

  return {
    storageType: storageLabel,
    performanceScore,
    recommendation,
    needsUpgrade,
  }
}

/**
 * Map CPU tier string to power estimate key
 */
function cpuTierToPowerKey(tier: string): keyof typeof POWER_ESTIMATES.cpu {
  if (tier === 'Enthusiast') return 'enthusiast'
  if (tier === 'High-End') return 'high'
  if (tier === 'Mid-Range') return 'mid'
  return 'budget'
}

/**
 * Map GPU tier string to power estimate key
 */
function gpuTierToPowerKey(tier: string): keyof typeof POWER_ESTIMATES.gpu {
  if (tier === 'Enthusiast') return 'enthusiast'
  if (tier === 'High-End') return 'high'
  if (tier === 'Mid-Range') return 'mid'
  return 'budget'
}

/**
 * Analyze PSU adequacy
 * Estimates power draw based on CPU/GPU tiers and checks headroom
 */
export function analyzePsu(
  psuWattage: number,
  cpuScore: number,
  gpuScore: number
): PsuAnalysis {
  // Determine component tiers
  const cpuTier = getCpuTier(cpuScore)
  const gpuTier = getGpuTier(gpuScore)

  // Estimate power draw
  const cpuPower = POWER_ESTIMATES.cpu[cpuTierToPowerKey(cpuTier)]
  const gpuPower = POWER_ESTIMATES.gpu[gpuTierToPowerKey(gpuTier)]
  const estimatedDraw = cpuPower + gpuPower + POWER_ESTIMATES.system

  // Calculate headroom
  const maxSafeLoad = psuWattage * PSU_HEADROOM
  const headroomPercent = Math.round(((maxSafeLoad - estimatedDraw) / maxSafeLoad) * 100)
  const sufficient = estimatedDraw <= maxSafeLoad

  let recommendation: string
  if (!sufficient) {
    const recommendedWattage = Math.ceil(estimatedDraw / PSU_HEADROOM / 50) * 50 // Round up to nearest 50W
    recommendation = `Your ${psuWattage}W PSU may be insufficient. Estimated power draw is ~${estimatedDraw}W. Consider upgrading to at least ${recommendedWattage}W for stability.`
  } else if (headroomPercent < 10) {
    recommendation = `Your PSU is adequate but has minimal headroom. This could limit future upgrade options.`
  } else {
    recommendation = `Your ${psuWattage}W PSU provides adequate power with ${headroomPercent}% headroom.`
  }

  return {
    currentWattage: psuWattage,
    estimatedDraw,
    headroomPercent,
    sufficient,
    recommendation,
  }
}
