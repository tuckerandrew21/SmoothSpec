"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, ArrowLeft } from "lucide-react"
import { ComponentsStep } from "@/components/components-step"
import { UsageStep } from "@/components/usage-step"
import { BudgetStep } from "@/components/budget-step"
import { trackBuildStarted, trackStepCompleted, trackBuildCompleted } from "@/lib/analytics"
import type { BuildData } from "@/types/build"

const stepNames = ["Components", "Games", "Budget"]

export function BuildAnalyzer() {
  const [currentStep, setCurrentStep] = useState(1)
  const hasTrackedStart = useRef(false)

  // Track build started on first load
  useEffect(() => {
    if (!hasTrackedStart.current) {
      trackBuildStarted()
      hasTrackedStart.current = true
    }
  }, [])
  const [buildData, setBuildData] = useState<BuildData>({
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    psu: "",
    games: [],
    budget: 500,
    resolution: "1440p",
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      trackStepCompleted(currentStep, stepNames[currentStep - 1])
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateBuildData = (data: Partial<BuildData>) => {
    setBuildData({ ...buildData, ...data })
  }

  const handleAnalyze = () => {
    trackStepCompleted(currentStep, stepNames[currentStep - 1])
    trackBuildCompleted(buildData.games.length, buildData.budget)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Smoothspec</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium text-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
        <Card className="border-border bg-card p-4 sm:p-8 md:p-12">
          {currentStep === 1 && <ComponentsStep buildData={buildData} updateBuildData={updateBuildData} />}
          {currentStep === 2 && <UsageStep buildData={buildData} updateBuildData={updateBuildData} />}
          {currentStep === 3 && <BudgetStep buildData={buildData} updateBuildData={updateBuildData} />}

          {/* Navigation Buttons */}
          <div className="mt-8 sm:mt-12 flex items-center justify-between gap-3 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-1.5 sm:gap-2 bg-transparent text-xs sm:text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button size="sm" onClick={handleNext} className="text-xs sm:text-sm">Continue</Button>
            ) : (
              <Link href={`/results?data=${encodeURIComponent(JSON.stringify(buildData))}`} onClick={handleAnalyze}>
                <Button size="sm" className="gap-2 text-xs sm:text-sm">Analyze My Build</Button>
              </Link>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
