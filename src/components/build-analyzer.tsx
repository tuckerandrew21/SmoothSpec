"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, ArrowLeft } from "lucide-react"
import { ComponentsStep } from "@/components/components-step"
import { UsageStep } from "@/components/usage-step"
import { BudgetStep } from "@/components/budget-step"
import type { BuildData } from "@/types/build"

export function BuildAnalyzer() {
  const [currentStep, setCurrentStep] = useState(1)
  const [buildData, setBuildData] = useState<BuildData>({
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    psu: "",
    games: [],
    budget: 500,
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Smoothspec</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="border-border bg-card p-8 sm:p-12">
          {currentStep === 1 && <ComponentsStep buildData={buildData} updateBuildData={updateBuildData} />}
          {currentStep === 2 && <UsageStep buildData={buildData} updateBuildData={updateBuildData} />}
          {currentStep === 3 && <BudgetStep buildData={buildData} updateBuildData={updateBuildData} />}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>Continue</Button>
            ) : (
              <Link href={`/results?data=${encodeURIComponent(JSON.stringify(buildData))}`}>
                <Button className="gap-2">Analyze My Build</Button>
              </Link>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
