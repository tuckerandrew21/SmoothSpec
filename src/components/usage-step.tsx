"use client"

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BuildData } from "@/types/build"

interface UsageStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

const games = [
  { id: "tarkov", name: "Escape from Tarkov", demand: "High" },
  { id: "warzone", name: "Call of Duty: Warzone", demand: "High" },
  { id: "cyberpunk", name: "Cyberpunk 2077", demand: "Very High" },
  { id: "cs2", name: "Counter-Strike 2", demand: "Medium" },
  { id: "fortnite", name: "Fortnite", demand: "Medium" },
  { id: "valorant", name: "Valorant", demand: "Low" },
  { id: "apex", name: "Apex Legends", demand: "Medium" },
  { id: "baldurs-gate", name: "Baldur's Gate 3", demand: "High" },
  { id: "starfield", name: "Starfield", demand: "Very High" },
  { id: "rdr2", name: "Red Dead Redemption 2", demand: "Very High" },
  { id: "minecraft", name: "Minecraft", demand: "Low" },
  { id: "gta5", name: "GTA V", demand: "Medium" },
]

export function UsageStep({ buildData, updateBuildData }: UsageStepProps) {
  const toggleGame = (gameId: string) => {
    const newGames = buildData.games.includes(gameId)
      ? buildData.games.filter((g) => g !== gameId)
      : [...buildData.games, gameId]
    updateBuildData({ games: newGames })
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
                  <p className="mt-1 text-sm text-muted-foreground">System demand: {game.demand}</p>
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
