/**
 * Comparison storage utilities
 * Uses sessionStorage to avoid URL size limits when comparing builds
 */

import type { BuildData } from "@/types/build"

const STORAGE_KEY_PREFIX = "smoothspec_build_"
const BUILD_A_KEY = `${STORAGE_KEY_PREFIX}a`
const BUILD_B_KEY = `${STORAGE_KEY_PREFIX}b`

export interface StoredBuild {
  data: BuildData
  savedAt: number
  label?: string
}

/**
 * Save a build for comparison
 */
export function saveBuildForComparison(
  build: BuildData,
  slot: "a" | "b",
  label?: string
): void {
  if (typeof window === "undefined") return

  const stored: StoredBuild = {
    data: build,
    savedAt: Date.now(),
    label,
  }

  const key = slot === "a" ? BUILD_A_KEY : BUILD_B_KEY
  sessionStorage.setItem(key, JSON.stringify(stored))
}

/**
 * Get a saved build
 */
export function getSavedBuild(slot: "a" | "b"): StoredBuild | null {
  if (typeof window === "undefined") return null

  const key = slot === "a" ? BUILD_A_KEY : BUILD_B_KEY
  const stored = sessionStorage.getItem(key)

  if (!stored) return null

  try {
    return JSON.parse(stored) as StoredBuild
  } catch {
    return null
  }
}

/**
 * Check if a build is saved in a slot
 */
export function hasSavedBuild(slot: "a" | "b"): boolean {
  if (typeof window === "undefined") return false

  const key = slot === "a" ? BUILD_A_KEY : BUILD_B_KEY
  return sessionStorage.getItem(key) !== null
}

/**
 * Clear a saved build
 */
export function clearSavedBuild(slot: "a" | "b"): void {
  if (typeof window === "undefined") return

  const key = slot === "a" ? BUILD_A_KEY : BUILD_B_KEY
  sessionStorage.removeItem(key)
}

/**
 * Clear all saved builds
 */
export function clearAllSavedBuilds(): void {
  if (typeof window === "undefined") return

  sessionStorage.removeItem(BUILD_A_KEY)
  sessionStorage.removeItem(BUILD_B_KEY)
}

/**
 * Get both builds for comparison
 */
export function getComparisonBuilds(): {
  buildA: StoredBuild | null
  buildB: StoredBuild | null
} {
  return {
    buildA: getSavedBuild("a"),
    buildB: getSavedBuild("b"),
  }
}
