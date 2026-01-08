"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import {
  analyzeGamePerformance,
  aggregateGameAnalyses,
  generateComponentAgeWarnings,
  calculateBuildScore,
  parseRamAmount,
  parseRamType,
  analyzeStorage,
  analyzePsu,
} from "@/lib/analysis/engine"
import { generateUpgradeRecommendations } from "@/lib/analysis/recommendations"
import { assessDataQuality, type PartialFailure } from "@/lib/errors"
import type { BuildData } from "@/types/build"
import type { Component, Game, BuildAnalysisResult } from "@/types/analysis"

export function useBuildAnalysis(buildData: BuildData | null) {
  const [analysis, setAnalysis] = useState<BuildAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasRun = useRef(false)

  // Stringify for stable dependency comparison
  const buildDataKey = buildData ? JSON.stringify(buildData) : null

  useEffect(() => {
    // Prevent duplicate runs
    if (hasRun.current) return

    if (!buildData) {
      setLoading(false)
      setError("No build data provided")
      return
    }

    hasRun.current = true

    // Capture buildData for closure
    const data = buildData

    async function runAnalysis() {
      setLoading(true)
      setError(null)

      try {
        const partialFailures: PartialFailure[] = []
        const analysisWarnings: string[] = []

        // Fetch CPU details
        let cpu: Component | null = null
        if (data.cpu) {
          const { data: cpuData, error: cpuError } = await supabase
            .from("components")
            .select("*")
            .eq("id", data.cpu)
            .single()

          if (cpuError) {
            analysisWarnings.push("Could not load CPU details - some recommendations may be limited")
            partialFailures.push({
              operation: "fetch_cpu",
              error: cpuError.message,
            })
          } else {
            cpu = cpuData as Component
          }
        }

        // Fetch GPU details
        let gpu: Component | null = null
        if (data.gpu) {
          const { data: gpuData, error: gpuError } = await supabase
            .from("components")
            .select("*")
            .eq("id", data.gpu)
            .single()

          if (gpuError) {
            analysisWarnings.push("Could not load GPU details - bottleneck analysis may be incomplete")
            partialFailures.push({
              operation: "fetch_gpu",
              error: gpuError.message,
            })
          } else {
            gpu = gpuData as Component
          }
        }

        // Fetch selected games
        let games: Game[] = []
        if (data.games && data.games.length > 0) {
          const { data: gamesData, error: gamesError } = await supabase
            .from("games")
            .select("*")
            .in("id", data.games)

          if (gamesError) {
            analysisWarnings.push("Could not load some game requirements")
            partialFailures.push({
              operation: "fetch_games",
              error: gamesError.message,
            })
          } else {
            games = gamesData as Game[]
          }
        }

        // Parse RAM amount
        const userRam = parseRamAmount(data.ram)

        // Run per-game analysis
        const perGameAnalysis = games.map((game) =>
          analyzeGamePerformance(
            cpu?.benchmark_score || 0,
            gpu?.benchmark_score || 0,
            userRam,
            game
          )
        )

        // Aggregate results
        const aggregateBottleneck = aggregateGameAnalyses(perGameAnalysis)

        // Generate age warnings
        const componentAges = generateComponentAgeWarnings(data, cpu, gpu)

        // Analyze storage performance
        const storageAnalysis = data.storage ? analyzeStorage(data.storage) : null

        // Analyze PSU adequacy
        const psuWattage = parseInt(data.psu, 10) || 0
        const psuAnalysis = psuWattage > 0
          ? analyzePsu(psuWattage, cpu?.benchmark_score || 0, gpu?.benchmark_score || 0)
          : null

        // Calculate build score
        const buildScore = calculateBuildScore(perGameAnalysis, componentAges)

        // Generate upgrade recommendations
        const recommendationsResult = await generateUpgradeRecommendations({
          currentCpu: cpu,
          currentGpu: gpu,
          currentRam: userRam,
          currentRamType: parseRamType(data.ram),
          currentStorage: data.storage,
          perGameAnalysis,
          budget: data.budget,
          componentAges,
        })

        // Merge warnings and failures from recommendations
        analysisWarnings.push(...recommendationsResult.warnings)
        partialFailures.push(...recommendationsResult.partialFailures)

        // Compile all warnings (age-based + analysis + edge cases)
        const warnings = [
          ...analysisWarnings,
          ...componentAges
            .filter((age) => age.warning)
            .map((age) => age.warning!),
        ]

        // Handle edge cases
        if (perGameAnalysis.length === 0) {
          warnings.push("No games selected. Add games to get specific recommendations.")
        }

        if (recommendationsResult.data.length === 0 && perGameAnalysis.length > 0) {
          if (aggregateBottleneck.component === "balanced") {
            warnings.push("Your build is well-balanced for your selected games!")
          } else {
            warnings.push(
              `No upgrades found within your $${data.budget} budget. Consider increasing your budget for better options.`
            )
          }
        }

        // Add storage warning if HDD
        if (storageAnalysis?.needsUpgrade) {
          warnings.push(storageAnalysis.recommendation)
        }

        // Add PSU warning if insufficient
        if (psuAnalysis && !psuAnalysis.sufficient) {
          warnings.push(psuAnalysis.recommendation)
        }

        setAnalysis({
          buildScore,
          perGameAnalysis,
          aggregateBottleneck,
          componentAges,
          storageAnalysis,
          psuAnalysis,
          recommendations: recommendationsResult.data,
          warnings,
          dataQuality: assessDataQuality(partialFailures),
          partialFailures,
        })
      } catch (err) {
        console.error("Analysis error:", err)
        setError(err instanceof Error ? err.message : "Analysis failed")
      } finally {
        setLoading(false)
      }
    }

    runAnalysis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildDataKey])

  return { analysis, loading, error }
}
