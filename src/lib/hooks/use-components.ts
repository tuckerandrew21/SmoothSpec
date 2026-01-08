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
  // Intel CPUs
  "14th Gen": "e.g. i7-14700K",
  "13th Gen": "e.g. i5-13600K",
  "12th Gen": "e.g. i5-12400F",
  "10th Gen": "e.g. i3-10100F",
  // AMD CPUs
  "Ryzen 9000": "e.g. Ryzen 7 9700X",
  "Ryzen 7000": "e.g. Ryzen 7 7800X3D",
  "Ryzen 5000": "e.g. Ryzen 5 5600X",
  "Ryzen 3000": "e.g. Ryzen 5 3600",
  // NVIDIA GPUs
  "RTX 40 Series": "e.g. RTX 4070",
  "RTX 30 Series": "e.g. RTX 3070",
  "GTX 16 Series": "e.g. GTX 1660 Super",
  // AMD GPUs
  "RX 7000 Series": "e.g. RX 7800 XT",
  "RX 6000 Series": "e.g. RX 6700 XT",
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
        .order("name")

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
