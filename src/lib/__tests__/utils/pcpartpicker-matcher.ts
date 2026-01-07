/**
 * PCPartPicker Matcher Utility
 *
 * Matches seed component data against PCPartPicker dataset to identify pricing gaps.
 * Mirrors the matching logic in src/lib/pcpartpicker-prices.ts
 */

/**
 * Known GPU chipset aliases for matching seed names to PCPartPicker names
 * Key: our seed data name, Value: PCPartPicker chipset name
 * MUST be kept in sync with src/lib/pcpartpicker-prices.ts
 */
const GPU_ALIASES: Record<string, string> = {
  "GeForce GTX 1650": "GeForce GTX 1650 G6", // GDDR6 version (more common in 2024+)
}

/**
 * Regex to strip VRAM suffixes from GPU names for fallback matching
 * Matches: " 8GB", " 16GB", " 12GB", " 10GB", " 6GB", " 4GB", etc.
 */
const VRAM_SUFFIX_REGEX = /\s+\d+GB$/i

// Types for PCPartPicker dataset (from docyx/pc-part-dataset)
export interface PCPartPickerCPU {
  name: string
  price: number | null
  core_count?: number
  core_clock?: number
  boost_clock?: number
  tdp?: number
  graphics?: string
  smt?: boolean
}

export interface PCPartPickerGPU {
  name: string
  price: number | null
  chipset: string
  memory?: number
  core_clock?: number
  boost_clock?: number
  color?: string
  length?: number
}

export interface MatchResult {
  seedBrand: string
  seedModel: string
  pcppMatch: string | null
  pcppChipset: string | null
  hasPrice: boolean
  confidence: "exact" | "partial" | "none"
}

export interface GapReport {
  matched: MatchResult[]
  unmatched: MatchResult[]
  partialMatches: MatchResult[]
  suggestions: Array<{
    seedModel: string
    possibleMatches: string[]
  }>
}

/**
 * Normalize CPU model for matching
 * Mirrors logic in pcpartpicker-prices.ts getCPUPrice (line 113-116)
 */
export function normalizeCpuModel(model: string): string {
  return model
    .replace(/^Intel\s+/i, "")
    .replace(/^AMD\s+/i, "")
    .trim()
}

/**
 * Normalize GPU model for matching
 * Mirrors logic in pcpartpicker-prices.ts getGPUPrice (line 39-42)
 */
export function normalizeGpuModel(model: string): string {
  return model
    .replace(/^NVIDIA\s+/i, "")
    .replace(/^AMD\s+/i, "")
    .trim()
}

/**
 * Extract chipset from PCPartPicker CPU name
 * PCPartPicker format: "AMD Ryzen 5 7600" or "Intel Core i5-14400F"
 */
function extractCpuChipset(pcppName: string): string {
  return pcppName
    .replace(/^Intel\s+/i, "")
    .replace(/^AMD\s+/i, "")
    .trim()
}

/**
 * Match a seed CPU against PCPartPicker dataset
 */
export function matchCpuToDataset(
  seedBrand: string,
  seedModel: string,
  pcppCpus: PCPartPickerCPU[]
): MatchResult {
  const normalizedSeed = normalizeCpuModel(seedModel)

  // Exact match on extracted chipset
  const exactMatch = pcppCpus.find((cpu) => {
    const chipset = extractCpuChipset(cpu.name)
    return chipset.toLowerCase() === normalizedSeed.toLowerCase()
  })

  if (exactMatch) {
    return {
      seedBrand,
      seedModel,
      pcppMatch: exactMatch.name,
      pcppChipset: extractCpuChipset(exactMatch.name),
      hasPrice: exactMatch.price !== null,
      confidence: "exact",
    }
  }

  // Partial match - contains the normalized model
  const partialMatch = pcppCpus.find((cpu) => {
    const chipset = extractCpuChipset(cpu.name)
    return chipset.toLowerCase().includes(normalizedSeed.toLowerCase())
  })

  if (partialMatch) {
    return {
      seedBrand,
      seedModel,
      pcppMatch: partialMatch.name,
      pcppChipset: extractCpuChipset(partialMatch.name),
      hasPrice: partialMatch.price !== null,
      confidence: "partial",
    }
  }

  return {
    seedBrand,
    seedModel,
    pcppMatch: null,
    pcppChipset: null,
    hasPrice: false,
    confidence: "none",
  }
}

/**
 * Helper to find exact GPU match by chipset
 */
function findExactGpuMatch(
  chipset: string,
  pcppGpus: PCPartPickerGPU[]
): PCPartPickerGPU | null {
  return (
    pcppGpus.find(
      (gpu) => gpu.chipset?.toLowerCase() === chipset.toLowerCase()
    ) || null
  )
}

/**
 * Helper to find partial GPU match by chipset (contains)
 */
function findPartialGpuMatch(
  chipset: string,
  pcppGpus: PCPartPickerGPU[]
): PCPartPickerGPU | null {
  return (
    pcppGpus.find((gpu) =>
      gpu.chipset?.toLowerCase().includes(chipset.toLowerCase())
    ) || null
  )
}

/**
 * Match a seed GPU against PCPartPicker dataset
 * Uses multi-tier matching (mirrors pcpartpicker-prices.ts):
 * 1. Try ALL exact matches first (direct, VRAM-stripped, alias)
 * 2. Fall back to partial matching only if no exact match found
 */
export function matchGpuToDataset(
  seedBrand: string,
  seedModel: string,
  pcppGpus: PCPartPickerGPU[]
): MatchResult {
  const normalizedSeed = normalizeGpuModel(seedModel)
  const withoutVram = normalizedSeed.replace(VRAM_SUFFIX_REGEX, "")
  const alias = GPU_ALIASES[normalizedSeed] || GPU_ALIASES[withoutVram]

  // Phase 1: Try ALL exact matches first
  // 1a. Direct exact match
  let match = findExactGpuMatch(normalizedSeed, pcppGpus)
  if (match) {
    return {
      seedBrand,
      seedModel,
      pcppMatch: match.name,
      pcppChipset: match.chipset,
      hasPrice: match.price !== null,
      confidence: "exact",
    }
  }

  // 1b. Exact match after stripping VRAM suffix
  if (withoutVram !== normalizedSeed) {
    match = findExactGpuMatch(withoutVram, pcppGpus)
    if (match) {
      return {
        seedBrand,
        seedModel,
        pcppMatch: match.name,
        pcppChipset: match.chipset,
        hasPrice: match.price !== null,
        confidence: "exact",
      }
    }
  }

  // 1c. Exact match via alias
  if (alias) {
    match = findExactGpuMatch(alias, pcppGpus)
    if (match) {
      return {
        seedBrand,
        seedModel,
        pcppMatch: match.name,
        pcppChipset: match.chipset,
        hasPrice: match.price !== null,
        confidence: "exact",
      }
    }
  }

  // Phase 2: Fall back to partial matching (last resort)
  match = findPartialGpuMatch(normalizedSeed, pcppGpus)
  if (match) {
    return {
      seedBrand,
      seedModel,
      pcppMatch: match.name,
      pcppChipset: match.chipset,
      hasPrice: match.price !== null,
      confidence: "partial",
    }
  }

  return {
    seedBrand,
    seedModel,
    pcppMatch: null,
    pcppChipset: null,
    hasPrice: false,
    confidence: "none",
  }
}

/**
 * Find similar items for suggestion when no match found
 */
export function findSuggestions(
  seedModel: string,
  pcppItems: Array<{ name: string; chipset?: string }>
): string[] {
  const seedWords = seedModel
    .toLowerCase()
    .split(/[\s-]+/)
    .filter((w) => w.length > 2) // Skip short words like "i5"

  return pcppItems
    .filter((item) => {
      const itemText = (item.chipset || item.name).toLowerCase()
      const itemWords = itemText.split(/[\s-]+/)
      // At least 2 significant words in common
      const commonWords = seedWords.filter((w) => itemWords.includes(w))
      return commonWords.length >= 2
    })
    .slice(0, 5)
    .map((item) => item.chipset || item.name)
}

/**
 * Get unique chipsets from GPU dataset
 */
export function getUniqueGpuChipsets(pcppGpus: PCPartPickerGPU[]): string[] {
  const chipsets = new Set<string>()
  for (const gpu of pcppGpus) {
    if (gpu.chipset) {
      chipsets.add(gpu.chipset)
    }
  }
  return Array.from(chipsets).sort()
}

/**
 * Get unique CPU models from dataset
 */
export function getUniqueCpuModels(pcppCpus: PCPartPickerCPU[]): string[] {
  const models = new Set<string>()
  for (const cpu of pcppCpus) {
    models.add(extractCpuChipset(cpu.name))
  }
  return Array.from(models).sort()
}
