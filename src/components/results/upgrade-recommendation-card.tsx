"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, ExternalLink, Loader2, AlertTriangle, PiggyBank } from "lucide-react"
import type { UpgradeRecommendation, UpgradeCandidate, Component } from "@/types/analysis"
import { fetchComponentPrices, getRetailerLinksForComponent, type RetailerLinksResult } from "@/app/actions/prices"
import { trackAffiliateClicked } from "@/lib/analytics"

/**
 * Format a timestamp as "X days ago", "X hours ago", etc.
 */
function formatTimeAgo(isoTimestamp: string): string {
  const date = new Date(isoTimestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 7) {
    return `${Math.floor(diffDays / 7)}w ago`
  } else if (diffDays > 0) {
    return `${diffDays}d ago`
  } else if (diffHours > 0) {
    return `${diffHours}h ago`
  } else if (diffMins > 0) {
    return `${diffMins}m ago`
  } else {
    return "just now"
  }
}

interface UpgradeRecommendationCardProps {
  recommendation: UpgradeRecommendation
  index: number
  budget?: number
}

// Budget tolerance - only show "slightly over" if within this margin
const BUDGET_TOLERANCE_PERCENT = 0.10 // 10% over budget is "close"
const BUDGET_TOLERANCE_ABSOLUTE = 50 // Or $50 over budget

// Cap displayed performance gain to avoid misleading users
// PassMark benchmarks can show 500%+ gains which don't reflect real gaming performance
const MAX_DISPLAYED_GAIN = 150

// Price data for a candidate
interface CandidatePriceData {
  component: Component
  estimatedPerformanceGain: number
  seedPrice: number
  realPrice: number | null
  priceRetailer: string | null // Which retailer has the best price
  priceData: RetailerLinksResult | null
}

export function UpgradeRecommendationCard({
  recommendation,
  index,
  budget,
}: UpgradeRecommendationCardProps) {
  const [candidatePrices, setCandidatePrices] = useState<CandidatePriceData[]>([])
  const [loadingPrices, setLoadingPrices] = useState(true)

  const componentType = recommendation.componentType as "cpu" | "gpu" | "ram" | "storage" | "psu"

  // Build list of all candidates (primary + alternatives)
  const allCandidates = useMemo(() => {
    const candidates: Array<{
      component: Component
      estimatedPerformanceGain: number
      seedPrice: number
    }> = []

    // Add primary candidate (seedPrice may not be on recommendedComponent, estimate from alternatives or use 0)
    const primarySeedPrice = recommendation.alternatives?.[0]?.seedPrice
      ? recommendation.alternatives[0].seedPrice * 1.2 // Estimate: primary is ~20% more expensive than next best
      : 0

    candidates.push({
      component: recommendation.recommendedComponent,
      estimatedPerformanceGain: recommendation.estimatedPerformanceGain,
      seedPrice: primarySeedPrice,
    })

    // Add alternatives
    if (recommendation.alternatives) {
      candidates.push(...recommendation.alternatives)
    }

    return candidates
  }, [recommendation])

  // Fetch prices for all candidates from database cache
  useEffect(() => {
    async function fetchAllPrices() {
      setLoadingPrices(true)

      const results: CandidatePriceData[] = await Promise.all(
        allCandidates.map(async (candidate) => {
          const componentName = candidate.component.brand
            ? `${candidate.component.brand} ${candidate.component.model}`
            : candidate.component.model

          try {
            // Try database cached prices first (from daily price refresh)
            const dbPrices = await fetchComponentPrices(
              componentName,
              componentType as "cpu" | "gpu" | "ram"
            )
            const bestDbPrice = dbPrices.find(p => p.inStock)

            // Always get retailer links for shopping buttons
            const retailerLinks = await getRetailerLinksForComponent(componentName, componentType)

            if (bestDbPrice) {
              // Use validated price from database (already sorted by price ascending)
              return {
                component: candidate.component,
                estimatedPerformanceGain: candidate.estimatedPerformanceGain,
                seedPrice: candidate.seedPrice,
                realPrice: bestDbPrice.price,
                priceRetailer: bestDbPrice.retailer,
                priceData: {
                  ...retailerLinks,
                  estimatedPrice: bestDbPrice.price,
                },
              }
            }

            // No DB price - use PCPartPicker estimate
            return {
              component: candidate.component,
              estimatedPerformanceGain: candidate.estimatedPerformanceGain,
              seedPrice: candidate.seedPrice,
              realPrice: retailerLinks.estimatedPrice ?? null,
              priceRetailer: null,
              priceData: retailerLinks,
            }
          } catch {
            return {
              component: candidate.component,
              estimatedPerformanceGain: candidate.estimatedPerformanceGain,
              seedPrice: candidate.seedPrice,
              realPrice: null,
              priceRetailer: null,
              priceData: null,
            }
          }
        })
      )

      setCandidatePrices(results)
      setLoadingPrices(false)
    }

    fetchAllPrices()
  }, [allCandidates, componentType])

  // Select the best candidate that's within budget
  // Priority: 1) Within budget, 2) Within tolerance ("saveable"), 3) Cheapest option
  const selectedCandidate = useMemo(() => {
    if (candidatePrices.length === 0) return null

    // If no budget specified, just use the primary (best performance)
    if (!budget) {
      return candidatePrices[0]
    }

    // 1. Find the best performer that's within budget
    // Candidates are ordered by performance (best first)
    for (const candidate of candidatePrices) {
      const price = candidate.realPrice
      if (price !== null && price <= budget) {
        return candidate
      }
    }

    // 2. Find the best performer within tolerance (worth saving up)
    const tolerance = Math.max(
      budget * BUDGET_TOLERANCE_PERCENT,
      BUDGET_TOLERANCE_ABSOLUTE
    )
    for (const candidate of candidatePrices) {
      const price = candidate.realPrice
      if (price !== null && price <= budget + tolerance) {
        return candidate
      }
    }

    // 3. If nothing is within tolerance, find the cheapest option
    // and show it with an "over budget" warning
    const withPrices = candidatePrices.filter((c) => c.realPrice !== null)
    if (withPrices.length > 0) {
      // Sort by price ascending, return cheapest
      const cheapest = withPrices.reduce((a, b) =>
        (a.realPrice ?? Infinity) < (b.realPrice ?? Infinity) ? a : b
      )
      return cheapest
    }

    // Fallback to primary if no prices available
    return candidatePrices[0]
  }, [candidatePrices, budget])

  // Determine budget status for the selected candidate
  const budgetStatus = useMemo(() => {
    if (!budget || !selectedCandidate?.realPrice) {
      return { status: 'unknown' as const }
    }

    const overAmount = selectedCandidate.realPrice - budget
    if (overAmount <= 0) return { status: 'within' as const }

    const toleranceAmount = Math.max(
      budget * BUDGET_TOLERANCE_PERCENT,
      BUDGET_TOLERANCE_ABSOLUTE
    )

    if (overAmount <= toleranceAmount) {
      // Within tolerance - worth saving up for
      return { status: 'saveable' as const, overBy: overAmount }
    }

    return { status: 'over' as const, overBy: overAmount }
  }, [budget, selectedCandidate])

  // Check if we fell back to an alternative
  const usedFallback = selectedCandidate &&
    selectedCandidate.component.id !== recommendation.recommendedComponent.id

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive text-destructive-foreground"
      case "Medium":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getComponentIcon = () => {
    switch (recommendation.componentType) {
      case "cpu":
        return "CPU"
      case "gpu":
        return "GPU"
      case "ram":
        return "RAM"
      default:
        return "Component"
    }
  }

  const handleAffiliateLinkClick = (retailer: string) => {
    trackAffiliateClicked(recommendation.componentType, retailer)
  }

  // Display values from selected candidate
  const displayComponent = selectedCandidate?.component ?? recommendation.recommendedComponent
  const displayPrice = selectedCandidate?.realPrice
  const displayRetailer = selectedCandidate?.priceRetailer
  const displayPerformanceGain = selectedCandidate?.estimatedPerformanceGain ?? recommendation.estimatedPerformanceGain
  const retailerLinks = selectedCandidate?.priceData?.links ?? []
  const priceUpdatedAt = selectedCandidate?.priceData?.priceUpdatedAt

  return (
    <Card className="border-border bg-card p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-muted text-xs sm:text-sm font-bold shrink-0">
                {index + 1}
              </span>
              <h3 className="text-base sm:text-xl font-semibold text-card-foreground">
                {getComponentIcon()} Upgrade
              </h3>
              <Badge className={`${getPriorityColor(recommendation.priorityLabel)} text-xs`}>
                {recommendation.priorityLabel} Priority
              </Badge>
            </div>
            <div className="mt-3 space-y-1 text-xs sm:text-sm">
              <p className="text-muted-foreground truncate">
                <span className="font-medium">Current:</span> {recommendation.currentComponent}
              </p>
              <p className="text-card-foreground">
                <span className="font-medium">Recommended:</span>{" "}
                <span className="break-words">
                  {displayComponent.brand} {displayComponent.model}
                </span>
              </p>
              {displayPerformanceGain > 0 && (
                <p className="text-green-500">
                  <span className="font-medium">Performance gain:</span>{" "}
                  {displayPerformanceGain > MAX_DISPLAYED_GAIN
                    ? `${MAX_DISPLAYED_GAIN}%+ (substantial upgrade)`
                    : `~${displayPerformanceGain}%`
                  }
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between sm:block sm:text-right sm:shrink-0">
            {loadingPrices ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs sm:text-sm">Loading prices...</span>
              </div>
            ) : displayPrice ? (
              <>
                <div className={`text-xl sm:text-2xl font-bold ${
                  budgetStatus.status === 'over' ? 'text-destructive' :
                  budgetStatus.status === 'saveable' ? 'text-blue-500' :
                  'text-primary'
                }`}>
                  ${displayPrice.toLocaleString()}
                  {displayRetailer && (
                    <span className="text-sm sm:text-base font-normal text-muted-foreground">
                      {" "}at {displayRetailer}
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground sm:mt-1">
                  {budgetStatus.status === 'over' && budgetStatus.overBy && (
                    <span className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      ${Math.round(budgetStatus.overBy)} over budget
                    </span>
                  )}
                  {budgetStatus.status === 'saveable' && budgetStatus.overBy && (
                    <span className="flex items-center gap-1 text-blue-500">
                      <PiggyBank className="h-3 w-3" />
                      Worth saving ${Math.round(budgetStatus.overBy)} more
                    </span>
                  )}
                  {(budgetStatus.status === 'within' || budgetStatus.status === 'unknown') && (
                    <span>estimated</span>
                  )}
                  {priceUpdatedAt && (
                    <span className="block text-[10px] opacity-70">
                      Updated {formatTimeAgo(priceUpdatedAt)}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-xs sm:text-sm text-muted-foreground">
                Compare prices below
              </div>
            )}
          </div>
        </div>

        {/* Fallback notice */}
        {usedFallback && !loadingPrices && (
          <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 p-3 text-xs sm:text-sm text-blue-600 dark:text-blue-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Best value option within your budget. The top performer ({recommendation.recommendedComponent.brand} {recommendation.recommendedComponent.model}) exceeds your ${budget} budget.
            </span>
          </div>
        )}

        {/* Reason */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 sm:p-4">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {usedFallback
              ? `Upgrading to ${displayComponent.brand} ${displayComponent.model} offers ${
                  displayPerformanceGain > MAX_DISPLAYED_GAIN
                    ? `${MAX_DISPLAYED_GAIN}%+`
                    : `~${displayPerformanceGain}%`
                } improvement over your current setup.`
              : recommendation.reason}
          </p>
        </div>

        {/* Affected Games */}
        {recommendation.affectedGames.length > 0 && (
          <div className="text-xs sm:text-sm">
            <span className="font-medium text-card-foreground">Helps with: </span>
            <span className="text-muted-foreground">
              {recommendation.affectedGames.join(", ")}
            </span>
          </div>
        )}

        {/* Retailer Links */}
        <div className="border-t border-border pt-4">
          <h4 className="text-xs sm:text-sm font-medium text-card-foreground mb-3">
            Shop This Component
          </h4>
          {loadingPrices ? (
            <div className="flex items-center gap-2 text-muted-foreground py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs sm:text-sm">Loading retailer links...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              {retailerLinks.map((link) => (
                <Button
                  key={link.retailer}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs sm:text-sm justify-start sm:justify-center w-full sm:w-auto bg-transparent"
                  asChild
                >
                  <a
                    href={link.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleAffiliateLinkClick(link.retailer)}
                  >
                    Compare at {link.retailer}
                    <ExternalLink className="h-3 w-3 ml-auto sm:ml-0" />
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
