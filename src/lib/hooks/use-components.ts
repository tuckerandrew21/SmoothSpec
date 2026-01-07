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
  "14th Gen": "i5-14600K, i7-14700K, i9-14900K",
  "13th Gen": "i5-13400F, i5-13600K, i7-13700K",
  "12th Gen": "i5-12400F, i5-12600K, i7-12700K",
  "10th Gen": "i3-10100F",
  // AMD CPUs
  "Ryzen 9000": "Ryzen 5 9600X, Ryzen 7 9700X",
  "Ryzen 7000": "Ryzen 5 7600, Ryzen 7 7800X3D, Ryzen 9 7950X",
  "Ryzen 5000": "Ryzen 5 5600X, Ryzen 7 5800X, Ryzen 9 5900X",
  "Ryzen 3000": "Ryzen 3 3200G, Ryzen 5 3600",
  // NVIDIA GPUs
  "RTX 40 Series": "RTX 4060, RTX 4070, RTX 4080, RTX 4090",
  "RTX 30 Series": "RTX 3060, RTX 3070, RTX 3080, RTX 3090",
  "GTX 16 Series": "GTX 1650, GTX 1660 Super",
  // AMD GPUs
  "RX 7000 Series": "RX 7600, RX 7800 XT, RX 7900 XTX",
  "RX 6000 Series": "RX 6600, RX 6700 XT, RX 6800 XT",
}

interface Game {
  id: string
  name: string
  steam_id: string | null
  cpu_weight: number
  gpu_weight: number
  ram_requirement: number
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
