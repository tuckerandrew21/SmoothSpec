import type { Metadata } from "next"
import { BuildAnalyzer } from "@/components/build-analyzer"

export const metadata: Metadata = {
  title: "Build Analyzer",
  description:
    "Enter your PC components and select your games to get personalized upgrade recommendations within your budget.",
  openGraph: {
    title: "Build Analyzer | Smoothspec",
    description:
      "Enter your PC components and select your games to get personalized upgrade recommendations.",
  },
}

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-background">
      <BuildAnalyzer />
    </div>
  )
}
