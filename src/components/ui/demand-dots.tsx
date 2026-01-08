import { cn } from "@/lib/utils"

interface DemandDotsProps {
  label: string
  weight: number
  className?: string
}

/**
 * Convert weight (0.5-1.5) to number of filled dots (1-5)
 */
function weightToDots(weight: number): number {
  if (weight <= 0.7) return 1
  if (weight <= 0.9) return 2
  if (weight <= 1.1) return 3
  if (weight <= 1.3) return 4
  return 5
}

/**
 * Visual indicator showing CPU or GPU demand as filled dots
 */
export function DemandDots({ label, weight, className }: DemandDotsProps) {
  const filled = weightToDots(weight)

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      <span className="text-muted-foreground w-7">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={cn(
              "text-[10px]",
              i <= filled ? "text-primary" : "text-muted-foreground/30"
            )}
          >
            ●
          </span>
        ))}
      </div>
    </div>
  )
}
