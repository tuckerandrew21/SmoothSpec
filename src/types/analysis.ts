/**
 * Types for the SmoothSpec recommendation engine
 */

import type { PartialFailure, DataQuality } from '@/lib/errors'

export interface Component {
  id: string
  type: 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu'
  brand: string
  model: string
  release_year: number
  benchmark_score: number
  specs: Record<string, unknown>
}

export interface Game {
  id: string
  name: string
  steam_id: string | null
  cpu_weight: number
  gpu_weight: number
  ram_requirement: number
  recommended_specs?: Record<string, string>
}

export interface GameAnalysis {
  game: Game
  bottleneck: {
    component: 'cpu' | 'gpu' | 'balanced'
    percentage: number
  }
  ramSufficient: boolean
  ramDeficit: number // 0 if sufficient, else GB needed
  recommendation: string
}

export interface ComponentAge {
  type: 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu'
  componentName: string
  ageYears: number
  urgency: 'low' | 'medium' | 'high'
  warning?: string
}

export interface PriceInfo {
  retailer: string
  price: number
  url: string
  inStock: boolean
  onSale?: boolean
}

export interface UpgradeCandidate {
  component: Component
  estimatedPerformanceGain: number
  seedPrice: number // Price used for filtering (from our DB)
}

export interface UpgradePathWarning {
  willCreateBottleneck: boolean
  timeframe: '6-months' | '1-year'
  newBottleneckComponent: 'cpu' | 'gpu'
  newBottleneckSeverity: number
  estimatedNextUpgradeCost: number
  totalUpgradeCost: number
  affectedGames: string[]
  recommendation: string
}

export interface UpgradeRecommendation {
  componentType: 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu'
  currentComponent: string
  recommendedComponent: Component
  priorityScore: number
  priorityLabel: 'High' | 'Medium' | 'Low'
  estimatedPerformanceGain: number
  reason: string
  affectedGames: string[] // Game names where this upgrade helps most
  prices: PriceInfo[]
  // Alternative candidates for fallback if primary is over budget
  alternatives?: UpgradeCandidate[]
  // Per-game impact breakdown
  perGameImpact?: Array<{
    gameName: string
    estimatedImprovement: number // percentage (0-100)
    impactLevel: 'high' | 'medium' | 'low'
  }>
  // Upgrade path warning (sequential bottleneck detection)
  pathWarning?: UpgradePathWarning
}

export interface ComboRecommendation {
  components: { cpu: Component; gpu: Component }
  totalCost: number
  totalPerformanceGain: number // Weighted average across games
  reasonForCombo: string
  affectedGames: string[]
  perGameImpact: Array<{
    gameName: string
    cpuContribution: number
    gpuContribution: number
    totalImprovement: number
  }>
  warnsAboutNewBottleneck: boolean
  newBottleneckComponent?: 'cpu' | 'gpu'
  comparedToSingleUpgrade?: {
    component: 'cpu' | 'gpu'
    cost: number
    gain: number
    differenceGain: number
  }
}

export interface StorageAnalysis {
  storageType: string // 'nvme', 'sata-ssd', 'hdd'
  performanceScore: number // 0-100
  recommendation: string
  needsUpgrade: boolean
}

export interface PsuAnalysis {
  currentWattage: number
  estimatedDraw: number
  headroomPercent: number // How much headroom (positive = good, negative = insufficient)
  sufficient: boolean
  recommendation: string
}

export interface BuildAnalysisResult {
  buildScore: number
  perGameAnalysis: GameAnalysis[]
  aggregateBottleneck: {
    component: 'cpu' | 'gpu' | 'balanced'
    averagePercentage: number
  }
  componentAges: ComponentAge[]
  storageAnalysis: StorageAnalysis | null
  psuAnalysis: PsuAnalysis | null
  recommendations: UpgradeRecommendation[]
  comboRecommendations?: ComboRecommendation[]
  warnings: string[]
  dataQuality: DataQuality
  partialFailures: PartialFailure[]
}
