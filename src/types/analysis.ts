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
  warnings: string[]
  dataQuality: DataQuality
  partialFailures: PartialFailure[]
}
