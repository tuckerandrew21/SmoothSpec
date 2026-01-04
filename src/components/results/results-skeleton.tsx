"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ResultsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Build Health Score Skeleton */}
      <Card className="border-border bg-card p-4 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
            <Skeleton className="h-4 w-40 sm:w-56" />
          </div>
          <div className="flex items-center gap-4 sm:block sm:text-center">
            <Skeleton className="h-10 sm:h-14 w-16 sm:w-20" />
            <div className="flex flex-col gap-2 sm:block">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 sm:mt-2" />
              <Skeleton className="h-2 w-24 sm:w-32 mt-2" />
            </div>
          </div>
        </div>
      </Card>

      {/* Per-Game Analysis Skeleton */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 sm:h-8 w-40 sm:w-48" />
          <Skeleton className="h-4 w-56 sm:w-72" />
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <GameAnalysisSkeleton />
          <GameAnalysisSkeleton />
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 sm:h-8 w-52 sm:w-64" />
          <Skeleton className="h-4 w-64 sm:w-80" />
        </div>
        <RecommendationSkeleton />
        <RecommendationSkeleton />
      </div>
    </div>
  )
}

function GameAnalysisSkeleton() {
  return (
    <Card className="border-border bg-card p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </Card>
  )
}

function RecommendationSkeleton() {
  return (
    <Card className="border-border bg-card p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" />
              <Skeleton className="h-5 sm:h-6 w-28 sm:w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <Skeleton className="h-8 sm:h-10 w-24 sm:w-28" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-4 w-40" />
      </div>
    </Card>
  )
}
