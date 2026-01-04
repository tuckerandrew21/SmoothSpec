"use client"

import { cn } from "@/lib/utils"

interface BottleneckMeterProps {
  component: "cpu" | "gpu" | "balanced"
  percentage: number
  className?: string
}

export function BottleneckMeter({ component, percentage, className }: BottleneckMeterProps) {
  // Calculate position on the meter (0-100, where 50 is balanced)
  // Negative = CPU bottleneck, Positive = GPU bottleneck
  const position =
    component === "balanced"
      ? 50
      : component === "cpu"
      ? Math.max(0, 50 - percentage / 2)
      : Math.min(100, 50 + percentage / 2)

  const getLabel = () => {
    if (component === "balanced") return "Balanced"
    if (component === "cpu") return `CPU limited (${percentage}%)`
    return `GPU limited (${percentage}%)`
  }

  const getColor = () => {
    if (component === "balanced") return "bg-green-500"
    if (percentage > 25) return "bg-red-500"
    return "bg-yellow-500"
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>CPU bound</span>
        <span>Balanced</span>
        <span>GPU bound</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted">
        {/* Center marker */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border" />
        {/* Position indicator */}
        <div
          className={cn("absolute top-0 h-full w-3 rounded-full transition-all", getColor())}
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>
      <div className="text-center text-sm font-medium">{getLabel()}</div>
    </div>
  )
}
