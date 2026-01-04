"use client"

import { GameAnalysisCard } from "./game-analysis-card"
import type { GameAnalysis } from "@/types/analysis"

interface PerGameBreakdownProps {
  analyses: GameAnalysis[]
  aggregateBottleneck: {
    component: "cpu" | "gpu" | "balanced"
    averagePercentage: number
  }
}

export function PerGameBreakdown({ analyses, aggregateBottleneck }: PerGameBreakdownProps) {
  if (analyses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-4 sm:p-8 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          No games selected. Go back and select games to see per-game analysis.
        </p>
      </div>
    )
  }

  const getAggregateMessage = () => {
    if (aggregateBottleneck.component === "balanced") {
      return "Your system is well-balanced across your selected games."
    }
    if (aggregateBottleneck.component === "gpu") {
      return `Overall, your GPU is the limiting factor across ${analyses.length} games (avg ${aggregateBottleneck.averagePercentage}% bottleneck).`
    }
    return `Overall, your CPU is the limiting factor across ${analyses.length} games (avg ${aggregateBottleneck.averagePercentage}% bottleneck).`
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Aggregate insight */}
      <div className="rounded-lg bg-muted/50 p-3 sm:p-4">
        <p className="text-xs sm:text-sm font-medium text-foreground">{getAggregateMessage()}</p>
      </div>

      {/* Per-game cards */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {analyses.map((analysis) => (
          <GameAnalysisCard key={analysis.game.id} analysis={analysis} />
        ))}
      </div>
    </div>
  )
}
