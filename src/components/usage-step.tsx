"use client"

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGames, getSystemDemand } from "@/lib/hooks/use-components"
import type { BuildData } from "@/types/build"

interface UsageStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

export function UsageStep({ buildData, updateBuildData }: UsageStepProps) {
  const { games, loading } = useGames()

  const toggleGame = (gameId: string) => {
    const newGames = buildData.games.includes(gameId)
      ? buildData.games.filter((g) => g !== gameId)
      : [...buildData.games, gameId]
    updateBuildData({ games: newGames })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">What do you play?</h2>
          <p className="mt-2 text-muted-foreground">Loading games...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">What do you play?</h2>
        <p className="mt-2 text-muted-foreground">Select the games you play most often</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => {
          const isSelected = buildData.games.includes(game.id)
          const demand = getSystemDemand(game.cpu_weight, game.gpu_weight)
          return (
            <Card
              key={game.id}
              className={cn(
                "relative cursor-pointer border-2 p-4 transition-colors hover:border-primary/50",
                isSelected ? "border-primary bg-primary/5" : "border-border",
              )}
              onClick={() => toggleGame(game.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{game.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">System demand: {demand}</p>
                </div>
                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
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
