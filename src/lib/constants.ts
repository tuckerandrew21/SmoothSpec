/**
 * Centralized constants for SmoothSpec
 * Extracted from various files to improve maintainability
 */

// Benchmark score scales (PassMark-style)
export const BENCHMARK_SCALES = {
  CPU_MAX: 60000,
  GPU_MAX: 40000,
} as const

// Bottleneck detection
export const BOTTLENECK_THRESHOLD = 10 // Percentage within which system is considered "balanced"

// Expected component lifespans in years
export const COMPONENT_LIFESPANS: Record<string, number> = {
  cpu: 5,
  gpu: 4,
  ram: 7,
  storage: 5,
  psu: 8,
}

// Age-based upgrade urgency thresholds (ratio of age to lifespan)
export const URGENCY_THRESHOLDS = {
  high: 0.8,
  medium: 0.5,
} as const

// Priority calculation weights (must sum to 1.0)
export const PRIORITY_WEIGHTS = {
  bottleneck: 0.4,
  age: 0.2,
  value: 0.4,
} as const

// Build score deductions
export const SCORE_DEDUCTIONS = {
  maxBottleneckPerGame: 15, // Max points deducted per game for bottleneck
  ramInsufficient: 5,       // Points deducted for insufficient RAM
  highAgeComponent: 10,     // Points deducted for high-urgency component
  mediumAgeComponent: 5,    // Points deducted for medium-urgency component
} as const

// Default build score when no games selected
export const DEFAULT_BUILD_SCORE = 50

// "Good build" threshold - no upgrades recommended above this score
export const GOOD_BUILD_THRESHOLD = 80

// Priority label thresholds
export const PRIORITY_THRESHOLDS = {
  high: 70,
  medium: 40,
} as const

// Estimated RAM upgrade costs (USD)
export const RAM_UPGRADE_COSTS: Record<number, number> = {
  16: 50,
  32: 100,
  64: 200,
}

// Best Buy API configuration
export const API_CONFIG = {
  cacheTtlHours: 168, // 7 days - prices are refreshed daily via seed/cron job
  rateLimit: 4, // Requests per second (stay under 5/sec limit)
} as const

// Supabase query defaults
export const QUERY_CONFIG = {
  defaultTimeoutMs: 10000, // 10 second timeout
} as const

// Storage performance scores (higher = faster)
export const STORAGE_PERFORMANCE: Record<string, number> = {
  nvme: 100,
  'sata-ssd': 60,
  hdd: 20,
}

// Storage type labels for display
export const STORAGE_LABELS: Record<string, string> = {
  nvme: 'NVMe SSD',
  'sata-ssd': 'SATA SSD',
  hdd: 'HDD',
}

// Estimated power draw by component tier (watts)
// Based on typical TDP values
export const POWER_ESTIMATES = {
  cpu: {
    budget: 65,      // i3/Ryzen 3
    mid: 95,         // i5/Ryzen 5
    high: 125,       // i7/Ryzen 7
    enthusiast: 170, // i9/Ryzen 9
  },
  gpu: {
    budget: 75,      // GTX 1650, RX 6500
    mid: 170,        // RTX 3060, RX 6700
    high: 250,       // RTX 3080, RX 6800
    enthusiast: 350, // RTX 4090, RX 7900
  },
  system: 100, // Motherboard, RAM, storage, fans, etc.
} as const

// PSU headroom recommendation (80% rule)
export const PSU_HEADROOM = 0.8
