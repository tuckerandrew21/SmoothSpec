"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import type { BuildData } from "@/types/build"

interface BudgetStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

export function BudgetStep({ buildData, updateBuildData }: BudgetStepProps) {
  const handleSliderChange = (value: number[]) => {
    updateBuildData({ budget: value[0] })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    updateBuildData({ budget: Math.min(Math.max(value, 100), 2000) })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">Set your budget</h2>
        <p className="mt-2 text-muted-foreground">How much are you willing to spend on upgrades?</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="budget" className="text-card-foreground">
            Upgrade Budget
          </Label>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">${buildData.budget.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Slider
            id="budget"
            min={100}
            max={2000}
            step={50}
            value={[buildData.budget]}
            onValueChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>$100</span>
            <span>$2,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget-input" className="text-sm text-muted-foreground">
            Or enter exact amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="budget-input"
              type="number"
              min={100}
              max={2000}
              value={buildData.budget}
              onChange={handleInputChange}
              className="pl-7"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
