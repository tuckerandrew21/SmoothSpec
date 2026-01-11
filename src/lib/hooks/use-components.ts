"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export interface Component {
  id: string
  type: string
  brand: string
  model: string
  family?: string
  release_year: number
  benchmark_score: number
  specs: Record<string, unknown>
}

/**
 * Helper text examples for each family
 */
export const FAMILY_EXAMPLES: Record<string, string> = {
  // Intel CPUs (newest first)
  "14th Gen": "e.g. i7-14700K",
  "13th Gen": "e.g. i5-13600K",
  "12th Gen": "e.g. i5-12400F",
  "11th Gen": "e.g. i7-11700K",
  "10th Gen": "e.g. i5-10400F",
  "9th Gen": "e.g. i5-9400F",
  "8th Gen": "e.g. i5-8400",
  "7th Gen": "e.g. i5-7500",
  "6th Gen": "e.g. i5-6500",
  "5th Gen": "e.g. i5-5675C",
  "4th Gen": "e.g. i5-4690K",

  // AMD CPUs
  "Ryzen 9000": "e.g. Ryzen 7 9700X",
  "Ryzen 7000": "e.g. Ryzen 7 7800X3D",
  "Ryzen 5000": "e.g. Ryzen 5 5600X",
  "Ryzen 4000": "e.g. Ryzen 5 4600G",
  "Ryzen 3000": "e.g. Ryzen 5 3600",
  "Ryzen 2000": "e.g. Ryzen 5 2600",
  "Ryzen 1000": "e.g. Ryzen 5 1600",
  "FX Series": "e.g. FX-8350",
  "A-Series": "e.g. A10-7850K",

  // NVIDIA GPUs (newest first)
  "RTX 50 Series": "e.g. RTX 5070",
  "RTX 40 Series": "e.g. RTX 4070",
  "RTX 30 Series": "e.g. RTX 3070",
  "RTX 20 Series": "e.g. RTX 2070",
  "GTX 16 Series": "e.g. GTX 1660 Super",
  "GTX 10 Series": "e.g. GTX 1060",
  "GTX 900 Series": "e.g. GTX 970",
  "GTX 700 Series": "e.g. GTX 760",
  "GTX 600 Series": "e.g. GTX 660",
  "GTX 500 Series": "e.g. GTX 560 Ti",
  "GTX 400 Series": "e.g. GTX 460",
  "Titan Series": "e.g. Titan X",

  // AMD GPUs
  "RX 7000 Series": "e.g. RX 7800 XT",
  "RX 6000 Series": "e.g. RX 6700 XT",
  "RX 5000 Series": "e.g. RX 5700 XT",
  "RX Vega": "e.g. RX Vega 64",
  "RX 500 Series": "e.g. RX 580",
  "RX 400 Series": "e.g. RX 480",
  "R9/R7 300 Series": "e.g. R9 390",
  "R9/R7 200 Series": "e.g. R9 290",
  "HD 7000 Series": "e.g. HD 7970",
  "HD 6000 Series": "e.g. HD 6950",
  "HD 5000 Series": "e.g. HD 5870",

  // Intel GPUs
  "Arc": "e.g. Arc A770",
}

export interface Game {
  id: string
  name: string
  steam_id: string | null
  cpu_weight: number
  gpu_weight: number
  ram_requirement: number
  recommended_specs?: Record<string, string>
  popularity_rank?: number // 1 = most popular, 999 = not ranked
}

export function useComponents(type: "cpu" | "gpu" | "ram" | "storage" | "psu") {
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComponents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from("components")
        .select("*")
        .eq("type", type)
        .order("brand")
        .order("model")

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setComponents(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load components")
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchComponents()
  }, [fetchComponents])

  const retry = useCallback(() => {
    fetchComponents()
  }, [fetchComponents])

  return { components, loading, error, retry }
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGames = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from("games")
        .select("*")
        .order("popularity_rank", { ascending: true }) // Most popular first
        .order("name", { ascending: true }) // Alphabetical tiebreaker

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setGames(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load games")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  const retry = useCallback(() => {
    fetchGames()
  }, [fetchGames])

  return { games, loading, error, retry }
}

export function formatComponentName(component: Component): string {
  return `${component.brand} ${component.model}`
}

/**
 * Hook to get unique brands for a component type
 */
export function useComponentBrands(type: "cpu" | "gpu") {
  const [brands, setBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBrands() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchError } = await supabase
          .from("components")
          .select("brand")
          .eq("type", type)

        if (fetchError) {
          setError(fetchError.message)
        } else {
          // Get unique brands
          const uniqueBrands = [...new Set(data?.map((d) => d.brand) || [])]
          setBrands(uniqueBrands.sort())
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load brands")
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [type])

  return { brands, loading, error }
}

/**
 * Hook to get unique families for a component type and brand
 */
export function useComponentFamilies(type: "cpu" | "gpu", brand: string | null) {
  const [families, setFamilies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!brand) {
      setFamilies([])
      return
    }

    async function fetchFamilies() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchError } = await supabase
          .from("components")
          .select("family")
          .eq("type", type)
          .eq("brand", brand)
          .not("family", "is", null)

        if (fetchError) {
          setError(fetchError.message)
        } else {
          // Get unique families, sorted by relevance (newer first for CPUs)
          const uniqueFamilies = [...new Set(data?.map((d) => d.family).filter(Boolean) || [])] as string[]
          // Sort: for CPUs put higher gen first, for GPUs put newer series first
          uniqueFamilies.sort((a, b) => {
            // Extract numbers for comparison
            const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10)
            const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10)
            return numB - numA // Descending (newer first)
          })
          setFamilies(uniqueFamilies)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load families")
      } finally {
        setLoading(false)
      }
    }
    fetchFamilies()
  }, [type, brand])

  return { families, loading, error }
}

/**
 * Hook to get components filtered by type, brand, and family
 */
export function useComponentsByFamily(
  type: "cpu" | "gpu",
  brand: string | null,
  family: string | null
) {
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!brand || !family) {
      setComponents([])
      return
    }

    async function fetchComponents() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchError } = await supabase
          .from("components")
          .select("*")
          .eq("type", type)
          .eq("brand", brand)
          .eq("family", family)
          .order("benchmark_score", { ascending: false })

        if (fetchError) {
          setError(fetchError.message)
        } else {
          setComponents(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load components")
      } finally {
        setLoading(false)
      }
    }
    fetchComponents()
  }, [type, brand, family])

  return { components, loading, error }
}

export function getSystemDemand(cpuWeight: number, gpuWeight: number): string {
  const avgWeight = (cpuWeight + gpuWeight) / 2
  if (avgWeight >= 1.3) return "Very High"
  if (avgWeight >= 1.1) return "High"
  if (avgWeight >= 0.9) return "Medium"
  return "Low"
}

/**
 * Hook to fetch all CPUs and GPUs for weight derivation
 */
export function useAllCpusAndGpus() {
  const [cpus, setCpus] = useState<Component[]>([])
  const [gpus, setGpus] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        const [cpuResult, gpuResult] = await Promise.all([
          supabase.from("components").select("*").eq("type", "cpu"),
          supabase.from("components").select("*").eq("type", "gpu"),
        ])

        if (cpuResult.error) throw cpuResult.error
        if (gpuResult.error) throw gpuResult.error

        setCpus(cpuResult.data || [])
        setGpus(gpuResult.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load components")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return { cpus, gpus, loading, error }
}
