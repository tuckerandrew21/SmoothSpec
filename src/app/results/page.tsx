import { Suspense } from "react"
import { ResultsContent } from "@/components/results-content"

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  )
}
