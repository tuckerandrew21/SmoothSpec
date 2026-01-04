"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Cpu,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Minus,
  Trash2,
} from "lucide-react"
import { getComparisonBuilds, clearAllSavedBuilds, type StoredBuild } from "@/lib/comparison-storage"
import { useBuildAnalysis } from "@/lib/hooks/use-build-analysis"
import type { BuildAnalysisResult } from "@/types/analysis"

function ScoreComparison({
  label,
  scoreA,
  scoreB,
  higherIsBetter = true,
}: {
  label: string
  scoreA: number
  scoreB: number
  higherIsBetter?: boolean
}) {
  const diff = scoreB - scoreA
  const isEqual = diff === 0
  const isBetter = higherIsBetter ? diff > 0 : diff < 0

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-4">
        <span className="w-12 text-right font-mono text-sm">{scoreA}</span>
        <div className="w-8 flex justify-center">
          {isEqual ? (
            <Minus className="h-4 w-4 text-muted-foreground" />
          ) : isBetter ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
        </div>
        <span className="w-12 font-mono text-sm">{scoreB}</span>
        {!isEqual && (
          <span
            className={`w-16 text-right text-xs ${
              isBetter ? "text-green-500" : "text-red-500"
            }`}
          >
            {diff > 0 ? "+" : ""}
            {diff}
          </span>
        )}
      </div>
    </div>
  )
}

function BuildColumn({
  label,
  build,
  analysis,
  loading,
  error,
}: {
  label: string
  build: StoredBuild | null
  analysis: BuildAnalysisResult | null
  loading: boolean
  error: string | null
}) {
  if (!build) {
    return (
      <Card className="flex-1 p-6">
        <div className="text-center text-muted-foreground">
          <p>No build saved</p>
          <Link href="/analyzer" className="mt-2 inline-block">
            <Button variant="outline" size="sm">
              Create Build
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="flex-1 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="flex-1 p-6">
        <div className="text-center text-destructive">
          <AlertTriangle className="mx-auto h-8 w-8" />
          <p className="mt-2">{error}</p>
        </div>
      </Card>
    )
  }

  const buildScore = analysis?.buildScore ?? 50

  return (
    <Card className="flex-1 p-4 sm:p-6">
      <div className="mb-4 border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{label}</h3>
        {build.label && (
          <p className="text-sm text-muted-foreground">{build.label}</p>
        )}
      </div>

      {/* Build Score */}
      <div className="mb-6 text-center">
        <div
          className={`text-4xl font-bold ${
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
        <div className="text-xs text-muted-foreground mt-1">Build Score</div>
        <Progress value={buildScore} className="mt-2 w-24 mx-auto" />
      </div>

      {/* Build Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Games</span>
          <span>{build.data.games.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Budget</span>
          <span>${build.data.budget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">RAM</span>
          <span>{build.data.ram}</span>
        </div>
        {build.data.storage && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Storage</span>
            <span className="capitalize">{build.data.storage.replace("-", " ")}</span>
          </div>
        )}
        {build.data.psu && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">PSU</span>
            <span>{build.data.psu}W</span>
          </div>
        )}
      </div>

      {/* Bottleneck Summary */}
      {analysis?.aggregateBottleneck && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm">
            <span className="text-muted-foreground">Bottleneck: </span>
            <span
              className={`font-medium ${
                analysis.aggregateBottleneck.component === "balanced"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {analysis.aggregateBottleneck.component === "balanced"
                ? "Balanced"
                : `${analysis.aggregateBottleneck.component.toUpperCase()} (${analysis.aggregateBottleneck.averagePercentage}%)`}
            </span>
          </div>
        </div>
      )}

      {/* Recommendations Count */}
      {analysis?.recommendations && analysis.recommendations.length > 0 && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Upgrades suggested: </span>
          <span className="font-medium">{analysis.recommendations.length}</span>
        </div>
      )}

      {/* Warnings Count */}
      {analysis?.warnings && analysis.warnings.length > 0 && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Warnings: </span>
          <span className="font-medium text-yellow-500">
            {analysis.warnings.length}
          </span>
        </div>
      )}
    </Card>
  )
}

export function ComparisonContent() {
  const [builds, setBuilds] = useState<{
    buildA: StoredBuild | null
    buildB: StoredBuild | null
  }>({ buildA: null, buildB: null })

  useEffect(() => {
    setBuilds(getComparisonBuilds())
  }, [])

  const {
    analysis: analysisA,
    loading: loadingA,
    error: errorA,
  } = useBuildAnalysis(builds.buildA?.data ?? null)

  const {
    analysis: analysisB,
    loading: loadingB,
    error: errorB,
  } = useBuildAnalysis(builds.buildB?.data ?? null)

  const handleClearBuilds = () => {
    clearAllSavedBuilds()
    setBuilds({ buildA: null, buildB: null })
  }

  const hasBuilds = builds.buildA || builds.buildB
  const hasBothBuilds = builds.buildA && builds.buildB
  const bothAnalyzed = analysisA && analysisB && !loadingA && !loadingB

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">
                Smoothspec
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {hasBuilds && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearBuilds}
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Clear
                </Button>
              )}
              <Link href="/analyzer">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 sm:gap-2 bg-transparent text-xs sm:text-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Analyzer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground">
            Build Comparison
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-base text-muted-foreground">
            Compare two builds side-by-side to see which performs better
          </p>
        </div>

        {!hasBuilds ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No builds saved for comparison. Analyze a build first, then save
              it for comparison.
            </p>
            <Link href="/analyzer">
              <Button>Go to Analyzer</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Side by Side Comparison */}
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <BuildColumn
                label="Build A"
                build={builds.buildA}
                analysis={analysisA}
                loading={loadingA}
                error={errorA}
              />
              <BuildColumn
                label="Build B"
                build={builds.buildB}
                analysis={analysisB}
                loading={loadingB}
                error={errorB}
              />
            </div>

            {/* Score Comparison Table */}
            {bothAnalyzed && (
              <Card className="mt-6 sm:mt-8 p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Score Breakdown</h2>
                <div className="divide-y divide-border">
                  <ScoreComparison
                    label="Build Score"
                    scoreA={analysisA.buildScore}
                    scoreB={analysisB.buildScore}
                  />
                  <ScoreComparison
                    label="Games Analyzed"
                    scoreA={analysisA.perGameAnalysis.length}
                    scoreB={analysisB.perGameAnalysis.length}
                  />
                  <ScoreComparison
                    label="Upgrades Needed"
                    scoreA={analysisA.recommendations.length}
                    scoreB={analysisB.recommendations.length}
                    higherIsBetter={false}
                  />
                  <ScoreComparison
                    label="Warnings"
                    scoreA={analysisA.warnings.length}
                    scoreB={analysisB.warnings.length}
                    higherIsBetter={false}
                  />
                  {analysisA.storageAnalysis && analysisB.storageAnalysis && (
                    <ScoreComparison
                      label="Storage Performance"
                      scoreA={analysisA.storageAnalysis.performanceScore}
                      scoreB={analysisB.storageAnalysis.performanceScore}
                    />
                  )}
                  {analysisA.psuAnalysis && analysisB.psuAnalysis && (
                    <ScoreComparison
                      label="PSU Headroom %"
                      scoreA={analysisA.psuAnalysis.headroomPercent}
                      scoreB={analysisB.psuAnalysis.headroomPercent}
                    />
                  )}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            {!hasBothBuilds && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {builds.buildA
                    ? "Build A saved. Create another build to compare."
                    : "Build B saved. Create another build to compare."}
                </p>
                <Link href="/analyzer">
                  <Button>Create Another Build</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
