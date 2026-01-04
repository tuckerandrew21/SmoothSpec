"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, ArrowLeft, AlertTriangle, HardDrive, Zap, GitCompare, Save } from "lucide-react"
import type { BuildData } from "@/types/build"
import { useBuildAnalysis } from "@/lib/hooks/use-build-analysis"
import { PerGameBreakdown, UpgradeRecommendationCard, ResultsSkeleton } from "@/components/results"
import { saveBuildForComparison, hasSavedBuild } from "@/lib/comparison-storage"

export function ResultsContent() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data")

  let buildData: BuildData | null = null

  try {
    if (dataParam) {
      buildData = JSON.parse(decodeURIComponent(dataParam))
    }
  } catch (e) {
    console.error("Failed to parse build data from URL:", e)
  }

  const { analysis, loading, error } = useBuildAnalysis(buildData)

  // Track which comparison slots have builds saved
  const [savedSlots, setSavedSlots] = useState({ a: false, b: false })

  useEffect(() => {
    setSavedSlots({
      a: hasSavedBuild("a"),
      b: hasSavedBuild("b"),
    })
  }, [])

  const handleSaveForComparison = (slot: "a" | "b") => {
    if (!buildData) return
    saveBuildForComparison(buildData, slot)
    setSavedSlots((prev) => ({ ...prev, [slot]: true }))
  }

  if (!buildData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No build data found</p>
          <Link href="/analyzer" className="mt-4 inline-block">
            <Button>Start Analysis</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 sm:h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="text-lg sm:text-xl font-bold text-foreground">Smoothspec</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
          <ResultsSkeleton />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-4 text-muted-foreground">Error: {error}</p>
          <Link href="/analyzer" className="mt-4 inline-block">
            <Button>Try Again</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const buildScore = analysis?.buildScore ?? 50

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Smoothspec</span>
            </Link>
            <div className="flex items-center gap-2">
              {/* Save for comparison buttons */}
              <div className="hidden sm:flex items-center gap-1">
                <Button
                  variant={savedSlots.a ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleSaveForComparison("a")}
                  className="gap-1.5 bg-transparent text-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  {savedSlots.a ? "Saved A" : "Save A"}
                </Button>
                <Button
                  variant={savedSlots.b ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleSaveForComparison("b")}
                  className="gap-1.5 bg-transparent text-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  {savedSlots.b ? "Saved B" : "Save B"}
                </Button>
              </div>
              {/* Compare button - show when at least one build saved */}
              {(savedSlots.a || savedSlots.b) && (
                <Link href="/compare">
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5 text-xs sm:text-sm"
                  >
                    <GitCompare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Compare</span>
                  </Button>
                </Link>
              )}
              <Link href="/analyzer">
                <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 bg-transparent text-xs sm:text-sm">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Start Over</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
        {/* Build Health Score */}
        <Card className="border-border bg-card p-4 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div className="flex-1">
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-card-foreground">
                Your Build Analysis
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-base text-muted-foreground">
                Based on {buildData.games.length} selected game
                {buildData.games.length !== 1 ? "s" : ""} and $
                {buildData.budget.toLocaleString()} budget
              </p>
            </div>
            <div className="flex items-center gap-4 sm:block sm:text-center">
              <div
                className={`text-3xl sm:text-5xl font-bold ${
                  buildScore >= 80
                    ? "text-green-500"
                    : buildScore >= 60
                    ? "text-primary"
                    : buildScore >= 40
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {buildScore}
              </div>
              <div className="flex flex-col sm:block">
                <div className="text-xs sm:text-sm text-muted-foreground sm:mt-1">Build Score</div>
                <Progress value={buildScore} className="mt-1 sm:mt-3 w-24 sm:w-32" />
              </div>
            </div>
          </div>
        </Card>

        {/* Data Quality Warning */}
        {analysis?.dataQuality && analysis.dataQuality !== "complete" && (
          <Card className="mt-4 sm:mt-6 border-yellow-500/50 bg-yellow-500/5 p-3 sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-yellow-500" />
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">
                  Analysis completed with some limitations
                </h3>
                {analysis.partialFailures && analysis.partialFailures.length > 0 && (
                  <ul className="mt-1 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
                    {analysis.partialFailures.map((f, i) => (
                      <li key={i}>{f.error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* System Warnings */}
        {analysis?.warnings && analysis.warnings.length > 0 && (
          <div className="mt-4 sm:mt-8 space-y-3 sm:space-y-4">
            {analysis.warnings.map((warning, idx) => (
              <Card
                key={idx}
                className={`p-3 sm:p-6 ${
                  warning.includes("well-balanced")
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-destructive/50 bg-destructive/5"
                }`}
              >
                <div className="flex gap-2 sm:gap-3">
                  <AlertTriangle
                    className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${
                      warning.includes("well-balanced")
                        ? "text-green-500"
                        : "text-destructive"
                    }`}
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">{warning}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Component Age Warnings */}
        {analysis?.componentAges &&
          analysis.componentAges.filter((a) => a.warning).length > 0 && (
            <div className="mt-4 sm:mt-8 space-y-3 sm:space-y-4">
              {analysis.componentAges
                .filter((a) => a.warning)
                .map((age, idx) => (
                  <Card key={idx} className="border-destructive/50 bg-destructive/5 p-3 sm:p-6">
                    <div className="flex gap-2 sm:gap-3">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-destructive" />
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-card-foreground">
                          {age.type.toUpperCase()} Age Warning
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                          {age.componentName}: {age.warning}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}

        {/* Storage & PSU Analysis */}
        {(analysis?.storageAnalysis || analysis?.psuAnalysis) && (
          <div className="mt-6 sm:mt-8 grid gap-4 sm:grid-cols-2">
            {/* Storage Analysis */}
            {analysis.storageAnalysis && (
              <Card className={`p-4 sm:p-6 ${
                analysis.storageAnalysis.needsUpgrade
                  ? "border-yellow-500/50 bg-yellow-500/5"
                  : "border-green-500/50 bg-green-500/5"
              }`}>
                <div className="flex gap-3">
                  <HardDrive className={`h-5 w-5 shrink-0 ${
                    analysis.storageAnalysis.needsUpgrade ? "text-yellow-500" : "text-green-500"
                  }`} />
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">
                      Storage: {analysis.storageAnalysis.storageType}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      {analysis.storageAnalysis.recommendation}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={analysis.storageAnalysis.performanceScore} className="h-2 w-20" />
                      <span className="text-xs text-muted-foreground">
                        {analysis.storageAnalysis.performanceScore}% speed
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* PSU Analysis */}
            {analysis.psuAnalysis && (
              <Card className={`p-4 sm:p-6 ${
                !analysis.psuAnalysis.sufficient
                  ? "border-destructive/50 bg-destructive/5"
                  : analysis.psuAnalysis.headroomPercent < 10
                  ? "border-yellow-500/50 bg-yellow-500/5"
                  : "border-green-500/50 bg-green-500/5"
              }`}>
                <div className="flex gap-3">
                  <Zap className={`h-5 w-5 shrink-0 ${
                    !analysis.psuAnalysis.sufficient
                      ? "text-destructive"
                      : analysis.psuAnalysis.headroomPercent < 10
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`} />
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">
                      Power: {analysis.psuAnalysis.currentWattage}W PSU
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      {analysis.psuAnalysis.recommendation}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Est. draw: {analysis.psuAnalysis.estimatedDraw}W
                      {analysis.psuAnalysis.sufficient && (
                        <span className="ml-2">
                          ({analysis.psuAnalysis.headroomPercent}% headroom)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Per-Game Breakdown */}
        {analysis && analysis.perGameAnalysis.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                Per-Game Analysis
              </h2>
              <p className="mt-1 text-xs sm:text-base text-muted-foreground">
                How your build performs for each selected game
              </p>
            </div>
            <PerGameBreakdown
              analyses={analysis.perGameAnalysis}
              aggregateBottleneck={analysis.aggregateBottleneck}
            />
          </div>
        )}

        {/* Upgrade Recommendations */}
        {analysis && analysis.recommendations.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                Prioritized Recommendations
              </h2>
              <p className="mt-1 text-xs sm:text-base text-muted-foreground">
                Upgrade suggestions optimized for your games and budget
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {analysis.recommendations.map((rec, index) => (
                <UpgradeRecommendationCard
                  key={`${rec.componentType}-${index}`}
                  recommendation={rec}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Recommendations Message */}
        {analysis &&
          analysis.recommendations.length === 0 &&
          analysis.perGameAnalysis.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <Card className="border-green-500/50 bg-green-500/5 p-4 sm:p-8 text-center">
                <h2 className="text-lg sm:text-2xl font-bold text-green-500">
                  Your Build is Optimized!
                </h2>
                <p className="mt-2 text-xs sm:text-base text-muted-foreground">
                  No upgrades recommended within your ${buildData.budget.toLocaleString()}{" "}
                  budget. Your current setup handles your selected games well.
                </p>
              </Card>
            </div>
          )}

        {/* Mobile Comparison Card */}
        <Card className="mt-8 p-4 sm:hidden">
          <h3 className="text-sm font-semibold mb-3">Compare Builds</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Save this build and compare it with another configuration
          </p>
          <div className="flex gap-2">
            <Button
              variant={savedSlots.a ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleSaveForComparison("a")}
              className="flex-1 gap-1.5 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              {savedSlots.a ? "Saved A" : "Save as A"}
            </Button>
            <Button
              variant={savedSlots.b ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleSaveForComparison("b")}
              className="flex-1 gap-1.5 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              {savedSlots.b ? "Saved B" : "Save as B"}
            </Button>
          </div>
          {(savedSlots.a || savedSlots.b) && (
            <Link href="/compare" className="block mt-3">
              <Button variant="default" size="sm" className="w-full gap-1.5 text-xs">
                <GitCompare className="h-3.5 w-3.5" />
                Go to Comparison
              </Button>
            </Link>
          )}
        </Card>
      </main>
    </div>
  )
}
