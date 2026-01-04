"use client"

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorAlert } from "@/components/ui/error-alert"
import { useGames, getSystemDemand } from "@/lib/hooks/use-components"
import type { BuildData } from "@/types/build"

interface UsageStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

export function UsageStep({ buildData, updateBuildData }: UsageStepProps) {
  const { games, loading, error, retry } = useGames()

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

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {games.map((game) => {
          const isSelected = buildData.games.includes(game.id)
          const demand = getSystemDemand(game.cpu_weight, game.gpu_weight)
          return (
            <Card
              key={game.id}
              className={cn(
                "relative cursor-pointer border-2 p-3 sm:p-4 transition-colors hover:border-primary/50",
                isSelected ? "border-primary bg-primary/5" : "border-border",
              )}
              onClick={() => toggleGame(game.id)}
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-card-foreground truncate">{game.name}</h3>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">System demand: {demand}</p>
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
    </div>
  )
}
