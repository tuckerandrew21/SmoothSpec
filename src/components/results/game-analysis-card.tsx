"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottleneckMeter } from "./bottleneck-meter"
import { CheckCircle, XCircle, Gamepad2 } from "lucide-react"
import type { GameAnalysis } from "@/types/analysis"
import { getSystemDemand } from "@/lib/hooks/use-components"

interface GameAnalysisCardProps {
  analysis: GameAnalysis
}

export function GameAnalysisCard({ analysis }: GameAnalysisCardProps) {
  const { game, bottleneck, ramSufficient, ramDeficit, recommendation } = analysis
  const systemDemand = getSystemDemand(game.cpu_weight, game.gpu_weight)

  const getDemandColor = () => {
    switch (systemDemand) {
      case "Very High":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "High":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-green-500/10 text-green-500 border-green-500/20"
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base sm:text-lg">{game.name}</CardTitle>
              <Badge variant="outline" className={getDemandColor()}>
                {systemDemand} Demand
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            {ramSufficient ? (
              <div className="flex items-center gap-1 text-xs text-green-500 sm:text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>{game.ram_requirement}GB RAM OK</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                <XCircle className="h-4 w-4" />
                <span>Needs +{ramDeficit}GB RAM</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <BottleneckMeter
          component={bottleneck.component}
          percentage={bottleneck.percentage}
        />
        <p className="text-sm text-muted-foreground">{recommendation}</p>
      </CardContent>
    </Card>
  )
}
