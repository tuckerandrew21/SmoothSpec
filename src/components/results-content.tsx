"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, ArrowLeft, AlertTriangle, HardDrive, Zap, GitCompare, Save, Copy, Check, Monitor, PiggyBank, ExternalLink, TrendingUp } from "lucide-react"
import type { BuildData } from "@/types/build"
import type { Resolution } from "@/lib/resolution-modifier"
import { useBuildAnalysis } from "@/lib/hooks/use-build-analysis"
import { PerGameBreakdown, UpgradeRecommendationCard, ResultsSkeleton } from "@/components/results"
import { saveBuildForComparison, hasSavedBuild } from "@/lib/comparison-storage"
import { GOOD_BUILD_THRESHOLD } from "@/lib/constants"

function ComponentAgeBadge({
  label,
  name,
  releaseYear,
}: {
  label: string
  name: string
  releaseYear?: number
}) {
  const currentYear = new Date().getFullYear()
  const age = releaseYear ? currentYear - releaseYear : null

  // Color coding: green (<3 years), yellow (3-5 years), orange (>5 years)
  const getAgeColor = (years: number) => {
    if (years < 3) return "text-green-500"
    if (years <= 5) return "text-yellow-500"
    return "text-orange-500"
  }

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1">
      <span className="font-medium text-muted-foreground">{label}:</span>
      <span className="text-foreground">{name}</span>
      {releaseYear && age !== null && (
        <span className={`${getAgeColor(age)}`}>
          ({releaseYear}, {age}y old)
        </span>
      )}
    </div>
  )
}

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

  const { analyses, loading, error, components } = useBuildAnalysis(buildData)

  // Track selected resolution for toggle (defaults to buildData's resolution)
  const [selectedResolution, setSelectedResolution] = useState<Resolution>(
    buildData?.resolution || "1440p"
  )

  // Get analysis for selected resolution
  const analysis = analyses?.[selectedResolution] ?? null

  // Track which comparison slots have builds saved
  const [savedSlots, setSavedSlots] = useState({ a: false, b: false })

  // Track copy feedback
  const [copied, setCopied] = useState(false)

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

  const formatBuildSummary = (): string => {
    if (!buildData || !analysis) return ""

    const cpuName = components.cpu ? `${components.cpu.brand} ${components.cpu.model}` : "Unknown CPU"
    const gpuName = components.gpu ? `${components.gpu.brand} ${components.gpu.model}` : "Unknown GPU"
    const gameNames = analysis.perGameAnalysis.map((g) => g.game.name).join(", ")

    const bottleneckInfo = analysis.aggregateBottleneck.component === "balanced"
      ? "Balanced (no significant bottleneck)"
      : `${analysis.aggregateBottleneck.component.toUpperCase()} bottleneck (${analysis.aggregateBottleneck.averagePercentage}%)`

    const topRec = analysis.recommendations[0]
    const topRecLine = topRec
      ? `Top Upgrade: ${topRec.recommendedComponent.brand} ${topRec.recommendedComponent.model}`
      : "No upgrades needed within budget"

    return `My Build: ${cpuName} + ${gpuName} + ${buildData.ram}
Games: ${gameNames || "None selected"}
Resolution: ${selectedResolution}

Build Score: ${analysis.buildScore}/100
${bottleneckInfo}

${topRecLine}

Analyzed with SmoothSpec`
  }

  const handleCopyBuild = async () => {
    const summary = formatBuildSummary()
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
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
              {/* Copy and Save buttons */}
              <div className="hidden sm:flex items-center gap-1">
                <Button
                  variant={copied ? "secondary" : "outline"}
                  size="sm"
                  onClick={handleCopyBuild}
                  className="gap-1.5 bg-transparent text-xs"
                  disabled={!analysis}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
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
              {/* Resolution Toggle */}
              <div className="mt-3 sm:mt-4 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <div className="flex rounded-md border border-border overflow-hidden">
                  {(["1080p", "1440p", "4k"] as Resolution[]).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setSelectedResolution(res)}
                      className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                        selectedResolution === res
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
                {selectedResolution !== buildData.resolution && (
                  <span className="text-xs text-muted-foreground">
                    (originally {buildData.resolution})
                  </span>
                )}
              </div>
              {/* Component Age Display */}
              {(components.cpu || components.gpu) && (
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs">
                  {components.cpu && (
                    <ComponentAgeBadge
                      label="CPU"
                      name={`${components.cpu.brand} ${components.cpu.model}`}
                      releaseYear={components.cpu.release_year}
                    />
                  )}
                  {components.gpu && (
                    <ComponentAgeBadge
                      label="GPU"
                      name={`${components.gpu.brand} ${components.gpu.model}`}
                      releaseYear={components.gpu.release_year}
                    />
                  )}
                </div>
              )}
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
                  budget={buildData.budget}
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
              {/* Truly good build - "Save Your Money" */}
              {buildScore >= GOOD_BUILD_THRESHOLD && analysis.aggregateBottleneck.component === "balanced" ? (
                <Card className="border-green-500/50 bg-green-500/5 p-4 sm:p-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <PiggyBank className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-bold text-green-500">
                      Save Your Money
                    </h2>
                    <p className="mt-2 text-sm sm:text-lg text-foreground font-medium">
                      Your build is already excellent for your games.
                    </p>
                    <p className="mt-2 text-xs sm:text-base text-muted-foreground">
                      With a score of {buildScore}/100 and no bottlenecks, you&apos;re getting
                      great performance.
                    </p>
                  </div>
                  {/* Upsell: Level up your setup */}
                  <div className="mt-6 pt-6 border-t border-green-500/20">
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      Want to level up your setup? Consider these upgrades:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {selectedResolution === "1080p" && (
                        <a
                          href="https://www.bestbuy.com/site/searchpage.jsp?st=1440p+gaming+monitor+144hz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <TrendingUp className="h-3.5 w-3.5" />
                          Upgrade to 1440p Monitor
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {selectedResolution === "1440p" && (
                        <a
                          href="https://www.bestbuy.com/site/searchpage.jsp?st=4k+gaming+monitor+144hz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <TrendingUp className="h-3.5 w-3.5" />
                          Upgrade to 4K Monitor
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <a
                        href="https://www.bestbuy.com/site/searchpage.jsp?st=gaming+mechanical+keyboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        Gaming Keyboards
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href="https://www.bestbuy.com/site/searchpage.jsp?st=gaming+mouse"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        Gaming Mice
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href="https://www.bestbuy.com/site/searchpage.jsp?st=gaming+headset"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        Gaming Headsets
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </Card>
              ) : (
                /* Budget-limited - acknowledge bottlenecks exist */
                <Card className="border-yellow-500/50 bg-yellow-500/5 p-4 sm:p-8">
                  <div className="text-center">
                    <h2 className="text-lg sm:text-2xl font-bold text-yellow-600">
                      No Upgrades in Budget
                    </h2>
                    <p className="mt-2 text-xs sm:text-base text-muted-foreground">
                      {analysis.aggregateBottleneck.component !== "balanced"
                        ? `Your ${analysis.aggregateBottleneck.component.toUpperCase()} is limiting performance, but meaningful upgrades exceed your $${buildData.budget.toLocaleString()} budget.`
                        : `No upgrades recommended within your $${buildData.budget.toLocaleString()} budget.`
                      }
                    </p>
                  </div>
                  {/* Alternatives when budget-limited */}
                  <div className="mt-6 pt-6 border-t border-yellow-500/20">
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      {analysis.aggregateBottleneck.component !== "balanced"
                        ? `Browse ${analysis.aggregateBottleneck.component.toUpperCase()} upgrades to find the right price:`
                        : "Browse upgrade options:"
                      }
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {analysis.aggregateBottleneck.component === "gpu" && (
                        <a
                          href="https://www.bestbuy.com/site/searchpage.jsp?st=graphics+card"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Browse Graphics Cards
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {analysis.aggregateBottleneck.component === "cpu" && (
                        <a
                          href="https://www.bestbuy.com/site/searchpage.jsp?st=desktop+processor"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Browse Processors
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <a
                        href="https://www.bestbuy.com/site/searchpage.jsp?st=ddr5+ram+32gb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        RAM Upgrades
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href="https://www.bestbuy.com/site/searchpage.jsp?st=nvme+ssd+1tb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        NVMe Storage
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

        {/* Mobile Actions Card */}
        <Card className="mt-8 p-4 sm:hidden">
          <h3 className="text-sm font-semibold mb-3">Share & Compare</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Copy your build summary or save for comparison
          </p>
          <Button
            variant={copied ? "secondary" : "outline"}
            size="sm"
            onClick={handleCopyBuild}
            className="w-full gap-1.5 text-xs mb-3"
            disabled={!analysis}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied to Clipboard!" : "Copy Build Summary"}
          </Button>
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
