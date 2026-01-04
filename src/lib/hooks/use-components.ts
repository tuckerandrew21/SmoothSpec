"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

interface Component {
  id: string
  type: string
  brand: string
  model: string
  release_year: number
  benchmark_score: number
  specs: Record<string, unknown>
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

export function getSystemDemand(cpuWeight: number, gpuWeight: number): string {
  const avgWeight = (cpuWeight + gpuWeight) / 2
  if (avgWeight >= 1.3) return "Very High"
  if (avgWeight >= 1.1) return "High"
  if (avgWeight >= 0.9) return "Medium"
  return "Low"
}
