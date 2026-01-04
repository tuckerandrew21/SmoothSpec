"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cpu, ArrowLeft, TrendingUp, AlertTriangle, ExternalLink } from "lucide-react"
import type { BuildData } from "@/types/build"

export function ResultsContent() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data")

  let buildData: BuildData | null = null

  try {
    if (dataParam) {
      buildData = JSON.parse(decodeURIComponent(dataParam))
    }
  } catch (e) {
    console.error("[v0] Failed to parse build data:", e)
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

  // Calculate build score (mock calculation)
  const buildScore = 75

  const recommendations = [
    {
      component: "GPU Upgrade",
      current: buildData.gpu,
      recommended: "NVIDIA RTX 4080",
      price: 1199,
      priority: "High",
      reason:
        "Your GPU is the primary bottleneck for gaming performance. Upgrading will provide the biggest FPS improvement.",
      stores: [
        { name: "Amazon", price: 1199, url: "#" },
        { name: "Newegg", price: 1249, url: "#" },
        { name: "Best Buy", price: 1229, url: "#" },
      ],
    },
    {
      component: "RAM Upgrade",
      current: buildData.ram,
      recommended: "32GB DDR5",
      price: 149,
      priority: "Medium",
      reason: "More RAM will help with multitasking and demanding games like Tarkov and Cyberpunk 2077.",
      stores: [
        { name: "Amazon", price: 149, url: "#" },
        { name: "Newegg", price: 159, url: "#" },
        { name: "Best Buy", price: 169, url: "#" },
      ],
    },
    {
      component: "CPU Upgrade",
      current: buildData.cpu,
      recommended: "AMD Ryzen 7 7800X3D",
      price: 449,
      priority: "Low",
      reason:
        "Your CPU is still capable for most games, but upgrading would provide better 1% lows and frame stability.",
      stores: [
        { name: "Amazon", price: 449, url: "#" },
        { name: "Newegg", price: 469, url: "#" },
        { name: "Best Buy", price: 459, url: "#" },
      ],
    },
  ]

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Smoothspec</span>
            </Link>
            <Link href="/analyzer">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Start Over
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Build Health Score */}
        <Card className="border-border bg-card p-8">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-card-foreground">Your Build Analysis</h1>
              <p className="mt-2 text-muted-foreground">
                Based on {buildData.games.length} selected games and ${buildData.budget.toLocaleString()} budget
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{buildScore}</div>
              <div className="mt-1 text-sm text-muted-foreground">Build Score</div>
              <Progress value={buildScore} className="mt-3 w-32" />
            </div>
          </div>
        </Card>

        {/* System Warnings */}
        <Card className="mt-8 border-destructive/50 bg-destructive/5 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <div>
              <h3 className="font-semibold text-card-foreground">Component Age Warning</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your PSU ({buildData.psu}) should be inspected or replaced if it's over 5 years old for safety and
                efficiency.
              </p>
            </div>
          </div>
        </Card>

        {/* Upgrade Recommendations */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Prioritized Recommendations</h2>
            <p className="mt-1 text-muted-foreground">Upgrade suggestions optimized for your games and budget</p>
          </div>

          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="border-border bg-card p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-card-foreground">{rec.component}</h3>
                        <Badge className={getPriorityColor(rec.priority)}>{rec.priority} Priority</Badge>
                      </div>
                      <div className="mt-3 space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium">Current:</span> {rec.current || "Not specified"}
                        </p>
                        <p className="text-card-foreground">
                          <span className="font-medium">Recommended:</span> {rec.recommended}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${rec.price.toLocaleString()}</div>
                      <div className="mt-1 text-sm text-muted-foreground">Starting at</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-4">
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{rec.reason}</p>
                  </div>

                  {/* Price Comparison */}
                  <div className="border-t border-border pt-4">
                    <h4 className="mb-3 text-sm font-medium text-card-foreground">Price Comparison</h4>
                    <div className="flex flex-wrap gap-3">
                      {rec.stores.map((store) => (
                        <Button key={store.name} variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                          <a href={store.url} target="_blank" rel="noopener noreferrer">
                            {store.name} - ${store.price.toLocaleString()}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
