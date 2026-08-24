'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface TimelineProps {
  data?: Array<{ timestamp: string; rainfall_mm: number; forecastRainfall_mm: number }>
}

export function Timeline({ data }: TimelineProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Mock data with realistic rainfall patterns
  const timelineData = data || [
    { timestamp: '2026-07-24', rainfall_mm: 12, forecastRainfall_mm: 0 },
    { timestamp: '2026-07-25', rainfall_mm: 28, forecastRainfall_mm: 0 },
    { timestamp: '2026-07-26', rainfall_mm: 45, forecastRainfall_mm: 0 },
    { timestamp: '2026-07-27', rainfall_mm: 68, forecastRainfall_mm: 0 },
    { timestamp: '2026-07-28', rainfall_mm: 52, forecastRainfall_mm: 0 },
    { timestamp: '2026-07-29', rainfall_mm: 38, forecastRainfall_mm: 0 },
    { timestamp: '2026-07-30', rainfall_mm: 42, forecastRainfall_mm: 0 },
    { timestamp: '2026-07-31', rainfall_mm: 65, forecastRainfall_mm: 0 },
    { timestamp: '2026-08-01', rainfall_mm: 58, forecastRainfall_mm: 0 },
    { timestamp: '2026-08-02', rainfall_mm: 72, forecastRainfall_mm: 0 },
    { timestamp: '2026-08-03', rainfall_mm: 35, forecastRainfall_mm: 0 },
    { timestamp: '2026-08-04', rainfall_mm: 48, forecastRainfall_mm: 0 },
    { timestamp: '2026-08-05', rainfall_mm: 0, forecastRainfall_mm: 45 },
    { timestamp: '2026-08-06', rainfall_mm: 0, forecastRainfall_mm: 38 },
    { timestamp: '2026-08-07', rainfall_mm: 0, forecastRainfall_mm: 52 },
  ]

  const filteredData = timelineData.slice(-15)

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-background/95 backdrop-blur">
      <div className="p-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Timeline - Rainfall Pattern</h3>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-sm border border-border/30 bg-background/50 p-1">
              {[
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: '90d', label: '90D' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as any)}
                  className={cn(
                    'px-2 py-1 rounded-sm text-xs font-medium transition-all',
                    timeRange === range.id
                      ? 'bg-accent/30 text-accent border border-accent/50'
                      : 'text-muted-foreground hover:bg-accent/10'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1">
              <button className="rounded-sm border border-border/30 bg-background/50 p-1.5 hover:bg-accent/10 transition-colors">
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="rounded-sm border border-border/30 bg-background/50 p-1.5 hover:bg-accent/10 transition-colors">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-32 rounded-sm border border-border/30 bg-card/30 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
              <XAxis
                dataKey="timestamp"
                stroke="oklch(1 0 0 / 40%)"
                style={{ fontSize: '10px' }}
                tick={{ angle: -45 }}
                height={60}
              />
              <YAxis stroke="oklch(1 0 0 / 40%)" style={{ fontSize: '10px' }} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.18 0.03 250)',
                  border: '1px solid oklch(1 0 0 / 20%)',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: 'oklch(1 0 0 / 70%)' }}
              />
              <Bar dataKey="rainfall_mm" name="Rainfall" fill="#4da6ff" opacity={0.8} />
              <Bar dataKey="forecastRainfall_mm" name="Forecast" fill="#ffaa00" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Stats */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-6 rounded-sm bg-cyan-400 opacity-80"></div>
              <span className="text-muted-foreground">Historical / Live</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-6 rounded-sm bg-orange-400 opacity-60"></div>
              <span className="text-muted-foreground">Forecast</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-xs font-medium">
            <div className="rounded-sm bg-accent/10 px-2 py-1 border border-accent/30">
              <span className="text-muted-foreground">Avg: </span>
              <span className="text-accent">42.3 mm</span>
            </div>
            <div className="rounded-sm bg-accent/10 px-2 py-1 border border-accent/30">
              <span className="text-muted-foreground">Peak: </span>
              <span className="text-accent">72.1 mm</span>
            </div>
            <div className="rounded-sm bg-accent/10 px-2 py-1 border border-accent/30">
              <span className="text-muted-foreground">Trend: </span>
              <span className="text-green-400">↑ Increasing</span>
            </div>
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="mt-3 flex items-center justify-center gap-8 text-xs font-medium">
          <div className="flex items-center gap-2 rounded-sm border border-border/30 bg-card/30 px-3 py-1.5">
            <span className="text-muted-foreground">Lat:</span>
            <span className="text-cyan-400">N 28.7041°</span>
          </div>
          <div className="flex items-center gap-2 rounded-sm border border-border/30 bg-card/30 px-3 py-1.5">
            <span className="text-muted-foreground">Lon:</span>
            <span className="text-cyan-400">E 93.7967°</span>
          </div>
          <div className="flex items-center gap-2 rounded-sm border border-border/30 bg-card/30 px-3 py-1.5">
            <span className="text-muted-foreground">Alt:</span>
            <span className="text-yellow-400">2,847.2 m</span>
          </div>
          <div className="flex items-center gap-2 rounded-sm border border-border/30 bg-card/30 px-3 py-1.5">
            <span className="text-muted-foreground">Zoom:</span>
            <span className="text-accent">2.4x</span>
          </div>
        </div>
      </div>
    </div>
  )
}
