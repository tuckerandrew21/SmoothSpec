import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cpu, Zap, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Smoothspec</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Stop guessing what to upgrade
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Get game-specific upgrade recommendations for your budget. Know exactly what to upgrade for maximum
            performance gains.
          </p>
          <div className="mt-10">
            <Link href="/analyzer">
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                Check My Build
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Three simple steps to optimize your gaming PC</p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-card-foreground">Enter your build</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Tell us about your current hardware components and when you purchased them.
              </p>
            </Card>

            <Card className="border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-card-foreground">Select games</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Choose the games you play most to get tailored recommendations.
              </p>
            </Card>

            <Card className="border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-card-foreground">Get recommendations</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Receive prioritized upgrade suggestions optimized for your budget and games.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
