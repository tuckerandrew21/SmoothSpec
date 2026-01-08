"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorAlert } from "@/components/ui/error-alert"
import { DemandDots } from "@/components/ui/demand-dots"
import {
  useGames,
  useAllCpusAndGpus,
  getSystemDemand,
  type Game,
} from "@/lib/hooks/use-components"
import { deriveWeightsFromSpecs } from "@/lib/component-matcher"
import type { BuildData } from "@/types/build"

interface UsageStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

export function UsageStep({ buildData, updateBuildData }: UsageStepProps) {
  const { games, loading, error, retry } = useGames()
  const { cpus, gpus } = useAllCpusAndGpus()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games
    return games.filter((game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [games, searchQuery])

  // Helper to get system demand - prefer stored weights (manually curated),
  // fall back to derived weights only if stored weights are default (1.0, 1.0)
  const getGameDemand = useMemo(() => {
    return (game: Game) => {
      // Use stored weights if they appear to be manually curated
      const isDefaultWeight = game.cpu_weight === 1.0 && game.gpu_weight === 1.0
      if (!isDefaultWeight) {
        return getSystemDemand(game.cpu_weight, game.gpu_weight)
      }

      // Try to derive weights from recommended specs as fallback
      if (game.recommended_specs && cpus.length > 0 && gpus.length > 0) {
        const derived = deriveWeightsFromSpecs(game.recommended_specs, cpus, gpus)
        if (derived.confidence !== "fallback") {
          return getSystemDemand(derived.cpuWeight, derived.gpuWeight)
        }
      }

      // Fall back to stored weights
      return getSystemDemand(game.cpu_weight, game.gpu_weight)
    }
  }, [cpus, gpus])

  const toggleGame = (gameId: string) => {
    const newGames = buildData.games.includes(gameId)
      ? buildData.games.filter((g) => g !== gameId)
      : [...buildData.games, gameId]
    updateBuildData({ games: newGames })
  }

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-card-foreground">What do you play?</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Select the games you play most often</p>
        </div>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-2 border-border p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-card-foreground">What do you play?</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Select the games you play most often</p>
        </div>
        <ErrorAlert message="Failed to load games" onRetry={retry} />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-card-foreground">What do you play?</h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Select the games you play most often</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredGames.length === 0 && searchQuery ? (
        <p className="text-center text-muted-foreground py-8">
          No games found matching &quot;{searchQuery}&quot;
        </p>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {filteredGames.map((game) => {
          const isSelected = buildData.games.includes(game.id)
          const demand = getGameDemand(game)
          return (
            <Card
              key={game.id}
              className={cn(
                "relative cursor-pointer border-2 p-3 sm:p-4 transition-colors hover:border-primary/50",
                isSelected ? "border-primary bg-primary/5" : "border-border",
              )}
              onClick={() => toggleGame(game.id)}
            >
              {/* RAM Badge - show for demanding games (16GB+) */}
              {game.ram_requirement >= 16 && (
                <span className="absolute top-2 right-2 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
                  {game.ram_requirement}GB
                </span>
              )}

              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-card-foreground truncate">{game.name}</h3>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">System demand: {demand}</p>

                  {/* CPU/GPU Demand Indicators */}
                  <div className="flex gap-4 mt-1.5">
                    <DemandDots label="CPU" weight={game.cpu_weight} />
                    <DemandDots label="GPU" weight={game.gpu_weight} />
                  </div>
                </div>
                {isSelected && (
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                )}
              </div>
            </Card>
          )
        })}
        </div>
      )}
    </div>
  )
}
