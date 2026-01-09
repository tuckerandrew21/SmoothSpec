/**
 * Component Matcher Utility
 *
 * Matches game requirement spec strings (e.g., "Intel Core i7-12700", "RTX 4070")
 * to components in our database and derives CPU/GPU weights from benchmark scores.
 */

// Minimal interface for components - compatible with both analysis.ts and use-components.ts
interface ComponentLike {
  model: string
  benchmark_score: number
}

/**
 * Regex to strip VRAM suffixes from GPU names
 * Matches: " 8GB", " 16GB", " 12GB", " 10GB", " 6GB", " 4GB", etc.
 */
const VRAM_SUFFIX_REGEX = /\s+\d+GB$/i

/**
 * Normalize CPU model name for matching
 * "Intel Core i7-12700" → "Core i7-12700"
 * "AMD Ryzen 9 7950X" → "Ryzen 9 7950X"
 * "i7-12700" → "Core i7-12700"
 */
export function normalizeCpuName(name: string): string {
  let normalized = name
    .replace(/^Intel\s+/i, "")
    .replace(/^AMD\s+/i, "")
    .trim()

  // Expand abbreviated Intel names: "i7-12700" → "Core i7-12700"
  if (/^i[3579]-/i.test(normalized)) {
    normalized = "Core " + normalized
  }

  return normalized
}

/**
 * Normalize GPU model name for matching
 * "NVIDIA GeForce RTX 4070" → "GeForce RTX 4070"
 * "RTX 4070 Ti 16GB" → "GeForce RTX 4070 Ti"
 * "AMD Radeon RX 7900 XT" → "Radeon RX 7900 XT"
 */
export function normalizeGpuName(name: string): string {
  let normalized = name
    .replace(/^NVIDIA\s+/i, "")
    .replace(/^AMD\s+/i, "")
    .trim()

  // Strip VRAM suffix
  normalized = normalized.replace(VRAM_SUFFIX_REGEX, "")

  // Add "GeForce " prefix if it's an RTX/GTX without it
  if (/^(RTX|GTX)\s+/i.test(normalized)) {
    normalized = "GeForce " + normalized
  }

  return normalized
}

/**
 * Find a CPU in the components list by spec name
 * Returns the component if found, null otherwise
 */
export function findCpuBySpec(
  specName: string,
  cpus: ComponentLike[]
): ComponentLike | null {
  const normalized = normalizeCpuName(specName).toLowerCase()

  // Exact match on model
  const exactMatch = cpus.find(
    (cpu) => cpu.model.toLowerCase() === normalized
  )
  if (exactMatch) return exactMatch

  // Partial match - model contains the normalized spec
  const partialMatch = cpus.find(
    (cpu) => cpu.model.toLowerCase().includes(normalized)
  )
  if (partialMatch) return partialMatch

  // Reverse partial - spec contains the model
  const reverseMatch = cpus.find(
    (cpu) => normalized.includes(cpu.model.toLowerCase())
  )
  if (reverseMatch) return reverseMatch

  return null
}

/**
 * Find a GPU in the components list by spec name
 * Returns the component if found, null otherwise
 */
export function findGpuBySpec(
  specName: string,
  gpus: ComponentLike[]
): ComponentLike | null {
  const normalized = normalizeGpuName(specName).toLowerCase()

  // Exact match on model
  const exactMatch = gpus.find(
    (gpu) => gpu.model.toLowerCase() === normalized
  )
  if (exactMatch) return exactMatch

  // Try without "GeForce " prefix for matching
  const withoutGeforce = normalized.replace(/^geforce\s+/i, "")
  const geforceMatch = gpus.find(
    (gpu) => gpu.model.toLowerCase().includes(withoutGeforce)
  )
  if (geforceMatch) return geforceMatch

  // Partial match
  const partialMatch = gpus.find(
    (gpu) => gpu.model.toLowerCase().includes(normalized)
  )
  if (partialMatch) return partialMatch

  return null
}

/**
 * Get benchmark score ranges for a component type
 */
export function getScoreRange(components: ComponentLike[]): {
  min: number
  max: number
} {
  if (components.length === 0) return { min: 0, max: 1 }

  const scores = components.map((c) => c.benchmark_score)
  return {
    min: Math.min(...scores),
    max: Math.max(...scores),
  }
}

/**
 * Convert a benchmark score to a percentile (0-1) within the component type
 */
export function scoreToPercentile(
  score: number,
  range: { min: number; max: number }
): number {
  if (range.max === range.min) return 0.5
  return (score - range.min) / (range.max - range.min)
}

export interface DerivedWeights {
  cpuWeight: number
  gpuWeight: number
  confidence: "high" | "medium" | "low" | "fallback"
  matchedCpu: string | null
  matchedGpu: string | null
}

/**
 * Derive CPU/GPU weights from recommended specs
 *
 * Algorithm:
 * 1. Parse rec_cpu and rec_gpu from game specs
 * 2. Look up benchmark scores in components
 * 3. Convert to percentiles within each type
 * 4. Higher GPU percentile = GPU-heavy game = higher gpu_weight
 */
export function deriveWeightsFromSpecs(
  recommendedSpecs: Record<string, string> | undefined,
  cpus: ComponentLike[],
  gpus: ComponentLike[]
): DerivedWeights {
  const fallback: DerivedWeights = {
    cpuWeight: 1.0,
    gpuWeight: 1.0,
    confidence: "fallback",
    matchedCpu: null,
    matchedGpu: null,
  }

  if (!recommendedSpecs) return fallback

  const recCpu = recommendedSpecs.rec_cpu
  const recGpu = recommendedSpecs.rec_gpu

  if (!recCpu || !recGpu) return fallback

  // Find matching components
  const matchedCpu = findCpuBySpec(recCpu, cpus)
  const matchedGpu = findGpuBySpec(recGpu, gpus)

  // If we can't find either, fall back
  if (!matchedCpu && !matchedGpu) return fallback

  // Get score ranges
  const cpuRange = getScoreRange(cpus)
  const gpuRange = getScoreRange(gpus)

  // Calculate percentiles (use 0.5 if no match)
  const cpuPercentile = matchedCpu
    ? scoreToPercentile(matchedCpu.benchmark_score, cpuRange)
    : 0.5
  const gpuPercentile = matchedGpu
    ? scoreToPercentile(matchedGpu.benchmark_score, gpuRange)
    : 0.5

  // Calculate gap: positive = GPU requirement is higher tier
  const gap = gpuPercentile - cpuPercentile

  // Convert gap to weights (0.5-1.5 scale)
  // Gap of +0.5 means GPU is 50% higher tier → gpu_weight should be higher
  const baseWeight = 1.0
  const cpuWeight = Math.max(0.5, Math.min(1.5, baseWeight - gap * 0.8))
  const gpuWeight = Math.max(0.5, Math.min(1.5, baseWeight + gap * 0.8))

  // Determine confidence
  let confidence: DerivedWeights["confidence"] = "high"
  if (!matchedCpu || !matchedGpu) {
    confidence = "medium"
  }
  if (!matchedCpu && !matchedGpu) {
    confidence = "low"
  }

  return {
    cpuWeight: Math.round(cpuWeight * 100) / 100,
    gpuWeight: Math.round(gpuWeight * 100) / 100,
    confidence,
    matchedCpu: matchedCpu?.model || null,
    matchedGpu: matchedGpu?.model || null,
  }
}
