"use client"

import { Suspense } from "react"
import { ComparisonContent } from "@/components/comparison-content"

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ComparisonContent />
    </Suspense>
  )
}
