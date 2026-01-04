import type { Metadata } from "next"
import { Suspense } from "react"
import { ResultsContent } from "@/components/results-content"
import { ResultsSkeleton } from "@/components/results"

export const metadata: Metadata = {
  title: "Build Analysis Results",
  description:
    "View your PC build analysis results with personalized upgrade recommendations based on your games and budget.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
            <ResultsSkeleton />
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
