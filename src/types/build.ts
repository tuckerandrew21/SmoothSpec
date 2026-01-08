import type { Resolution } from "@/lib/resolution-modifier"

export interface BuildData {
  cpu: string
  gpu: string
  ram: string
  storage: string
  psu: string
  games: string[]
  budget: number
  resolution: Resolution
}
