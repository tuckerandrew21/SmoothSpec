/**
 * Benchmark scoring utilities for Smoothspec
 *
 * Scores are based on PassMark-style benchmarks:
 * - CPUs: Multi-thread performance (scale: 0-60000)
 * - GPUs: 3D graphics performance (scale: 0-40000)
 *
 * Higher scores = better performance
 */

import {
  BENCHMARK_SCALES,
  BOTTLENECK_THRESHOLD,
  COMPONENT_LIFESPANS,
  URGENCY_THRESHOLDS,
  PRIORITY_WEIGHTS,
} from './constants'

// Score tiers for quick categorization
export const CPU_TIERS = {
  BUDGET: { min: 0, max: 15000, label: 'Budget' },
  MID: { min: 15000, max: 30000, label: 'Mid-Range' },
  HIGH: { min: 30000, max: 45000, label: 'High-End' },
  ENTHUSIAST: { min: 45000, max: 60000, label: 'Enthusiast' },
} as const

export const GPU_TIERS = {
  BUDGET: { min: 0, max: 10000, label: 'Budget' },
  MID: { min: 10000, max: 20000, label: 'Mid-Range' },
  HIGH: { min: 20000, max: 30000, label: 'High-End' },
  ENTHUSIAST: { min: 30000, max: 40000, label: 'Enthusiast' },
} as const

/**
 * Get the performance tier for a CPU based on benchmark score
 */
export function getCpuTier(score: number): string {
  if (score >= CPU_TIERS.ENTHUSIAST.min) return CPU_TIERS.ENTHUSIAST.label
  if (score >= CPU_TIERS.HIGH.min) return CPU_TIERS.HIGH.label
  if (score >= CPU_TIERS.MID.min) return CPU_TIERS.MID.label
  return CPU_TIERS.BUDGET.label
}

/**
 * Get the performance tier for a GPU based on benchmark score
 */
export function getGpuTier(score: number): string {
  if (score >= GPU_TIERS.ENTHUSIAST.min) return GPU_TIERS.ENTHUSIAST.label
  if (score >= GPU_TIERS.HIGH.min) return GPU_TIERS.HIGH.label
  if (score >= GPU_TIERS.MID.min) return GPU_TIERS.MID.label
  return GPU_TIERS.BUDGET.label
}

/**
 * Calculate bottleneck percentage between CPU and GPU
 * Returns positive if GPU is bottlenecked, negative if CPU is bottlenecked
 *
 * @param cpuScore - CPU benchmark score
 * @param gpuScore - GPU benchmark score
 * @param cpuWeight - Game-specific CPU importance (default 1.0)
 * @param gpuWeight - Game-specific GPU importance (default 1.0)
 */
export function calculateBottleneck(
  cpuScore: number,
  gpuScore: number,
  cpuWeight: number = 1.0,
  gpuWeight: number = 1.0
): { component: 'cpu' | 'gpu' | 'balanced'; percentage: number } {
  // Normalize scores to same scale (0-100)
  const normalizedCpu = (cpuScore / BENCHMARK_SCALES.CPU_MAX) * 100 * cpuWeight
  const normalizedGpu = (gpuScore / BENCHMARK_SCALES.GPU_MAX) * 100 * gpuWeight

  const diff = normalizedCpu - normalizedGpu

  if (Math.abs(diff) < BOTTLENECK_THRESHOLD) {
    return { component: 'balanced', percentage: 0 }
  }

  if (diff > 0) {
    // CPU is stronger, GPU is the bottleneck
    return { component: 'gpu', percentage: Math.round(diff) }
  }

  // GPU is stronger, CPU is the bottleneck
  return { component: 'cpu', percentage: Math.round(Math.abs(diff)) }
}

/**
 * Calculate component age in years from purchase date
 */
export function getComponentAge(purchaseDate: Date): number {
  const now = new Date()
  const years = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  return Math.round(years * 10) / 10 // Round to 1 decimal
}

/**
 * Get upgrade urgency based on component age and type
 */
export function getUpgradeUrgency(
  componentType: 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu',
  ageYears: number
): 'low' | 'medium' | 'high' {
  const expectedLifespan = COMPONENT_LIFESPANS[componentType] || 5
  const ageRatio = ageYears / expectedLifespan

  if (ageRatio >= URGENCY_THRESHOLDS.high) return 'high'
  if (ageRatio >= URGENCY_THRESHOLDS.medium) return 'medium'
  return 'low'
}

/**
 * Calculate upgrade priority score (higher = more urgent)
 * Considers bottleneck impact, age, and budget efficiency
 */
export function calculateUpgradePriority(params: {
  bottleneckPercentage: number
  ageYears: number
  componentType: 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu'
  estimatedCost: number
  performanceGain: number // Expected benchmark score improvement
}): number {
  const { bottleneckPercentage, ageYears, componentType, estimatedCost, performanceGain } = params

  // Bottleneck score (0-100)
  const bottleneckScore = Math.min(bottleneckPercentage, 100)

  // Age score (0-100)
  const urgency = getUpgradeUrgency(componentType, ageYears)
  const ageScore = urgency === 'high' ? 100 : urgency === 'medium' ? 50 : 20

  // Value score (performance per dollar, normalized)
  const valueScore = estimatedCost > 0
    ? Math.min((performanceGain / estimatedCost) * 100, 100)
    : 0

  return Math.round(
    bottleneckScore * PRIORITY_WEIGHTS.bottleneck +
    ageScore * PRIORITY_WEIGHTS.age +
    valueScore * PRIORITY_WEIGHTS.value
  )
}
