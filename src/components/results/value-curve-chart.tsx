"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceDot, ResponsiveContainer } from 'recharts'
import type { UpgradeCandidate } from '@/types/analysis'

interface ValueCurveChartProps {
  candidates: UpgradeCandidate[]
  sweetSpotIndex: number
}

export function ValueCurveChart({ candidates, sweetSpotIndex }: ValueCurveChartProps) {
  // Prepare chart data
  const data = candidates.map((c, i) => ({
    name: c.component.model.slice(0, 20), // Truncate for readability
    price: c.seedPrice,
    gain: c.estimatedPerformanceGain,
    valueScore: c.valueScore || 0,
    isSweetSpot: i === sweetSpotIndex,
    isDiminishing: i > sweetSpotIndex && (c.valueScore || 0) < (candidates[sweetSpotIndex].valueScore || 0) * 0.8,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <XAxis
          dataKey="price"
          label={{ value: 'Price ($)', position: 'insideBottom', offset: -10 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          label={{ value: 'Performance Gain (%)', angle: -90, position: 'insideLeft' }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="gain"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        {/* Sweet spot indicator */}
        <ReferenceDot
          x={data[sweetSpotIndex].price}
          y={data[sweetSpotIndex].gain}
          r={10}
          fill="green"
          stroke="white"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Custom tooltip showing value score
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border p-3 rounded-lg shadow-lg">
        <p className="font-medium text-sm">{data.name}</p>
        <p className="text-xs mt-1">Price: ${data.price}</p>
        <p className="text-xs">Gain: {data.gain}%</p>
        <p className="text-xs font-semibold text-primary">
          Value: {data.valueScore.toFixed(1)} pts/$100
        </p>
        {data.isSweetSpot && (
          <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
            <span>★</span> Sweet Spot
          </p>
        )}
        {data.isDiminishing && (
          <p className="text-orange-600 text-xs mt-1">Diminishing returns</p>
        )}
      </div>
    )
  }
  return null
}
