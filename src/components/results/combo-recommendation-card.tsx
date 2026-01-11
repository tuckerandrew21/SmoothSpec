"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, ExternalLink, Loader2, AlertTriangle, ChevronDown, ArrowRight } from "lucide-react"
import type { ComboRecommendation } from "@/types/analysis"
import { fetchComponentPrices, getRetailerLinksForComponent, type RetailerLinksResult } from "@/app/actions/prices"
import { trackAffiliateClicked } from "@/lib/analytics"

// Cap displayed performance gain to avoid misleading users
const MAX_DISPLAYED_GAIN = 150

interface ComponentPriceData {
  realPrice: number | null
  priceRetailer: string | null
  priceData: RetailerLinksResult | null
}

interface ComboRecommendationCardProps {
  combo: ComboRecommendation
  budget?: number
}

export function ComboRecommendationCard({
  combo,
  budget,
}: ComboRecommendationCardProps) {
  const [cpuPriceData, setCpuPriceData] = useState<ComponentPriceData | null>(null)
  const [gpuPriceData, setGpuPriceData] = useState<ComponentPriceData | null>(null)
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [showGameBreakdown, setShowGameBreakdown] = useState(false)

  // Fetch prices for both components
  useEffect(() => {
    async function fetchPrices() {
      setLoadingPrices(true)

      // Fetch CPU prices
      const cpuComponentName = `${combo.components.cpu.brand} ${combo.components.cpu.model}`
      const cpuDbPrices = await fetchComponentPrices(cpuComponentName, 'cpu')
      const cpuBestPrice = cpuDbPrices.find(p => p.inStock)
      const cpuLinks = await getRetailerLinksForComponent(cpuComponentName, 'cpu')

      setCpuPriceData({
        realPrice: cpuBestPrice?.price || cpuLinks.estimatedPrice || null,
        priceRetailer: cpuBestPrice?.retailer || null,
        priceData: {
          ...cpuLinks,
          estimatedPrice: cpuBestPrice?.price || cpuLinks.estimatedPrice,
        },
      })

      // Fetch GPU prices
      const gpuComponentName = `${combo.components.gpu.brand} ${combo.components.gpu.model}`
      const gpuDbPrices = await fetchComponentPrices(gpuComponentName, 'gpu')
      const gpuBestPrice = gpuDbPrices.find(p => p.inStock)
      const gpuLinks = await getRetailerLinksForComponent(gpuComponentName, 'gpu')

      setGpuPriceData({
        realPrice: gpuBestPrice?.price || gpuLinks.estimatedPrice || null,
        priceRetailer: gpuBestPrice?.retailer || null,
        priceData: {
          ...gpuLinks,
          estimatedPrice: gpuBestPrice?.price || gpuLinks.estimatedPrice,
        },
      })

      setLoadingPrices(false)
    }

    fetchPrices()
  }, [combo.components.cpu.brand, combo.components.cpu.model, combo.components.gpu.brand, combo.components.gpu.model])

  // Calculate total real price
  const totalRealPrice = useMemo(() => {
    if (!cpuPriceData?.realPrice || !gpuPriceData?.realPrice) return null
    return cpuPriceData.realPrice + gpuPriceData.realPrice
  }, [cpuPriceData, gpuPriceData])

  // Budget status
  const budgetStatus = useMemo(() => {
    if (!budget || !totalRealPrice) {
      return { status: 'unknown' as const }
    }

    const overAmount = totalRealPrice - budget
    if (overAmount <= 0) return { status: 'within' as const }

    const tolerance = Math.max(budget * 0.1, 50)
    if (overAmount <= tolerance) {
      return { status: 'saveable' as const, overBy: overAmount }
    }

    return { status: 'over' as const, overBy: overAmount }
  }, [budget, totalRealPrice])

  const handleAffiliateLinkClick = (componentType: 'cpu' | 'gpu', retailer: string) => {
    trackAffiliateClicked(componentType, retailer)
  }

  const getImpactColor = (improvement: number) => {
    if (improvement >= 15) return 'text-green-500'
    if (improvement >= 8) return 'text-yellow-500'
    return 'text-muted-foreground'
  }

  return (
    <Card className="border-blue-500/30 bg-card p-4 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="text-base sm:text-xl font-semibold text-card-foreground">
                Smart Budget Split
              </h3>
              <Badge className="bg-blue-500 text-white text-xs">
                Combo Upgrade
              </Badge>
              {combo.warnsAboutNewBottleneck && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  Warning
                </Badge>
              )}
            </div>
            <div className="mt-3 space-y-2 text-xs sm:text-sm">
              <p className="text-muted-foreground">{combo.reasonForCombo}</p>
              {combo.totalPerformanceGain > 0 && (
                <p className="text-green-500 font-medium">
                  Combined Performance gain:{" "}
                  {combo.totalPerformanceGain > MAX_DISPLAYED_GAIN
                    ? `${MAX_DISPLAYED_GAIN}%+ (substantial upgrade)`
                    : `~${combo.totalPerformanceGain}%`
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
            ) : totalRealPrice ? (
              <>
                <div className={`text-xl sm:text-2xl font-bold ${
                  budgetStatus.status === 'over' ? 'text-destructive' :
                  budgetStatus.status === 'saveable' ? 'text-blue-500' :
                  'text-primary'
                }`}>
                  ${totalRealPrice.toFixed(2)}
                </div>
                {budgetStatus.status === 'saveable' && (
                  <p className="text-xs text-blue-500 mt-1">
                    ${budgetStatus.overBy?.toFixed(2)} over (worth saving)
                  </p>
                )}
                {budgetStatus.status === 'over' && (
                  <p className="text-xs text-destructive mt-1">
                    ${budgetStatus.overBy?.toFixed(2)} over budget
                  </p>
                )}
              </>
            ) : (
              <div className="text-muted-foreground">
                <p className="text-sm">Price unavailable</p>
              </div>
            )}
          </div>
        </div>

        {/* Component Details - Side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 pt-4 border-t">
          {/* CPU */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <span className="text-blue-500">CPU</span>
            </h4>
            <p className="text-xs sm:text-sm text-card-foreground break-words">
              {combo.components.cpu.brand} {combo.components.cpu.model}
            </p>
            {cpuPriceData?.realPrice && (
              <p className="text-sm font-medium text-primary">
                ${cpuPriceData.realPrice.toFixed(2)}
              </p>
            )}
            {cpuPriceData?.priceData && cpuPriceData.priceData.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cpuPriceData.priceData.links.map((link) => (
                  <Button
                    key={link.retailer}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    asChild
                    onClick={() => handleAffiliateLinkClick('cpu', link.retailer)}
                  >
                    <a
                      href={link.productUrl || link.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      {link.retailer}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Plus sign */}
          <div className="flex items-center justify-center">
            <div className="text-2xl font-bold text-muted-foreground">+</div>
          </div>

          {/* GPU */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <span className="text-green-500">GPU</span>
            </h4>
            <p className="text-xs sm:text-sm text-card-foreground break-words">
              {combo.components.gpu.brand} {combo.components.gpu.model}
            </p>
            {gpuPriceData?.realPrice && (
              <p className="text-sm font-medium text-primary">
                ${gpuPriceData.realPrice.toFixed(2)}
              </p>
            )}
            {gpuPriceData?.priceData && gpuPriceData.priceData.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {gpuPriceData.priceData.links.map((link) => (
                  <Button
                    key={link.retailer}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    asChild
                    onClick={() => handleAffiliateLinkClick('gpu', link.retailer)}
                  >
                    <a
                      href={link.productUrl || link.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      {link.retailer}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison to single upgrade */}
        {combo.comparedToSingleUpgrade && combo.comparedToSingleUpgrade.differenceGain > 0 && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-blue-600">
                  +{combo.comparedToSingleUpgrade.differenceGain}% better than {combo.comparedToSingleUpgrade.component.toUpperCase()}-only upgrade
                </p>
                <p className="text-muted-foreground mt-1">
                  Upgrading both gives {combo.comparedToSingleUpgrade.differenceGain}% more performance than spending ${combo.comparedToSingleUpgrade.cost} on just the {combo.comparedToSingleUpgrade.component.toUpperCase()}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning about new bottleneck */}
        {combo.warnsAboutNewBottleneck && combo.newBottleneckComponent && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-yellow-600">
                  May create {combo.newBottleneckComponent.toUpperCase()} bottleneck
                </p>
                <p className="text-muted-foreground mt-1">
                  This combo may leave your {combo.newBottleneckComponent.toUpperCase()} as the limiting factor in some games. Consider a more balanced upgrade.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Per-game breakdown */}
        {combo.perGameImpact && combo.perGameImpact.length > 0 && (
          <div className="border-t pt-4">
            <button
              onClick={() => setShowGameBreakdown(!showGameBreakdown)}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showGameBreakdown ? 'rotate-180' : ''}`}
              />
              Per-Game Impact
            </button>
            {showGameBreakdown && (
              <div className="mt-4 space-y-3">
                {combo.perGameImpact
                  .filter(impact => impact.totalImprovement > 0)
                  .sort((a, b) => b.totalImprovement - a.totalImprovement)
                  .slice(0, 5)
                  .map((impact) => (
                    <div key={impact.gameName} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium">{impact.gameName}</span>
                        <span className={`text-xs sm:text-sm font-semibold ${getImpactColor(impact.totalImprovement)}`}>
                          +{impact.totalImprovement}%
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>CPU: +{Math.round(impact.cpuContribution)}%</span>
                        <span>GPU: +{Math.round(impact.gpuContribution)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
