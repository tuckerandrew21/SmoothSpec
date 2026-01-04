"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    async function fetchComponents() {
      setLoading(true)
      const { data, error } = await supabase
        .from("components")
        .select("*")
        .eq("type", type)
        .order("brand")
        .order("model")

      if (error) {
        setError(error.message)
      } else {
        setComponents(data || [])
      }
      setLoading(false)
    }

    fetchComponents()
  }, [type])

  return { components, loading, error }
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGames() {
      setLoading(true)
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("name")

      if (error) {
        setError(error.message)
      } else {
        setGames(data || [])
      }
      setLoading(false)
    }

    fetchGames()
  }, [])

  return { games, loading, error }
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
