"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, ExternalLink, Loader2, RefreshCw, Award } from "lucide-react"
import type { UpgradeRecommendation, PriceInfo } from "@/types/analysis"
import { fetchMultiRetailerPricesForComponent, type ExtendedPriceInfo, type MultiRetailerPriceResult } from "@/app/actions/prices"
import { trackPriceChecked, trackAffiliateClicked } from "@/lib/analytics"

interface UpgradeRecommendationCardProps {
  recommendation: UpgradeRecommendation
  index: number
}

export function UpgradeRecommendationCard({
  recommendation,
  index,
}: UpgradeRecommendationCardProps) {
  const [priceResult, setPriceResult] = useState<MultiRetailerPriceResult | null>(null)
  const [loadingPrices, setLoadingPrices] = useState(false)

  // Get prices from result or fall back to recommendation.prices
  const prices: ExtendedPriceInfo[] = priceResult?.prices ?? recommendation.prices.map(p => ({ ...p, isBestPrice: false }))

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

  const handleFetchPrices = async () => {
    setLoadingPrices(true)
    trackPriceChecked(recommendation.componentType, "all")
    try {
      const result = await fetchMultiRetailerPricesForComponent(
        recommendation.recommendedComponent.id
      )
      setPriceResult(result)
    } catch (error) {
      console.error("Failed to fetch prices:", error)
    } finally {
      setLoadingPrices(false)
    }
  }

  const handleAffiliateLinkClick = (retailer: string) => {
    trackAffiliateClicked(recommendation.componentType, retailer)
  }

  const lowestPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null

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
                  {recommendation.recommendedComponent.brand}{" "}
                  {recommendation.recommendedComponent.model}
                </span>
              </p>
              {recommendation.estimatedPerformanceGain > 0 && (
                <p className="text-green-500">
                  <span className="font-medium">Performance gain:</span>{" "}
                  ~{recommendation.estimatedPerformanceGain}%
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between sm:block sm:text-right sm:shrink-0">
            {lowestPrice ? (
              <>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  ${lowestPrice.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground sm:mt-1">Starting at</div>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFetchPrices}
                disabled={loadingPrices}
                className="gap-2 text-xs sm:text-sm"
              >
                {loadingPrices ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                Check Prices
              </Button>
            )}
          </div>
        </div>

        {/* Reason */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 sm:p-4">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {recommendation.reason}
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

        {/* Price Comparison */}
        {prices.length > 0 && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs sm:text-sm font-medium text-card-foreground">
                Price Comparison
              </h4>
              {priceResult?.bestPrice && (
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <Award className="h-3 w-3" />
                  <span>Best: {priceResult.bestPrice.retailer}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              {prices.map((price, idx) => (
                <Button
                  key={idx}
                  variant={price.isBestPrice ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 text-xs sm:text-sm justify-start sm:justify-center w-full sm:w-auto ${
                    price.isBestPrice ? "" : "bg-transparent"
                  }`}
                  asChild
                >
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleAffiliateLinkClick(price.retailer)}
                  >
                    {price.isBestPrice && <Award className="h-3 w-3" />}
                    {price.retailer} - ${price.price.toLocaleString()}
                    {price.onSale && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        Sale
                      </Badge>
                    )}
                    <ExternalLink className="h-3 w-3 ml-auto sm:ml-0" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
