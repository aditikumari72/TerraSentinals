'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, AlertCircle, Radio, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GeoLocation } from '@/lib/terrain-utils'

export interface StatisticsPanelProps {
  selectedLocation?: GeoLocation | null
  collapsible?: boolean
}

export function StatisticsPanel({ selectedLocation, collapsible = true }: StatisticsPanelProps) {
  const elevationData = [
    { name: 'Sea Level', value: 0 },
    { name: 'Selected', value: selectedLocation?.altitude || 2100 },
    { name: 'Peak', value: 3500 },
  ]

  const riskDistribution = [
    { name: 'Critical', value: 15 },
    { name: 'High', value: 28 },
    { name: 'Moderate', value: 35 },
    { name: 'Low', value: 22 },
  ]

  const colors = ['#ff4444', '#ff8800', '#ffdd00', '#44ff44']

  const statsData = [
    { label: 'Settlements', value: '12', icon: Building2, color: 'text-orange-400' },
    { label: 'Total Risk', value: '78%', icon: TrendingUp, color: 'text-red-400' },
    { label: 'Active Routes', value: '8 / 10', icon: Radio, color: 'text-green-400' },
    { label: 'Alerts', value: '3', icon: AlertCircle, color: 'text-yellow-400' },
  ]

  return (
    <div className="absolute right-4 top-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg border border-border/50 bg-background/90 p-4 backdrop-blur scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent/30">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-accent mb-1">Real-time Statistics</h2>
        <div className="h-0.5 w-12 bg-gradient-to-r from-accent to-transparent"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {statsData.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="rounded-sm border border-border/30 bg-accent/5 p-2.5 hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase">{stat.label}</span>
                <Icon className={cn('h-4 w-4', stat.color)} />
              </div>
              <div className={cn('text-xl font-bold', stat.color)}>{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="mb-4 rounded-sm border border-accent/30 bg-accent/5 p-3">
          <h3 className="font-semibold text-sm mb-2 text-accent">{selectedLocation.name}</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{selectedLocation.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latitude:</span>
              <span className="font-medium">{selectedLocation.lat.toFixed(4)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Longitude:</span>
              <span className="font-medium">{selectedLocation.lon.toFixed(4)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Altitude:</span>
              <span className="font-medium">{Math.round(selectedLocation.altitude)}m</span>
            </div>
          </div>
        </div>
      )}

      {/* Elevation Chart */}
      <div className="mb-4 rounded-sm border border-border/30 bg-card/50 p-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Elevation Profile</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={elevationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 10%)" />
            <XAxis dataKey="name" stroke="oklch(1 0 0 / 50%)" style={{ fontSize: '11px' }} />
            <YAxis stroke="oklch(1 0 0 / 50%)" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.18 0.03 250)',
                border: '1px solid oklch(1 0 0 / 20%)',
              }}
            />
            <Bar dataKey="value" fill="#00d4ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Distribution */}
      <div className="mb-4 rounded-sm border border-border/30 bg-card/50 p-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
              {riskDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.18 0.03 250)',
                border: '1px solid oklch(1 0 0 / 20%)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1">
          {riskDistribution.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors[i] }}
                ></div>
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Alert Feed */}
      <div className="rounded-sm border border-border/30 bg-card/50 p-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Alert Feed</h3>
        <div className="space-y-1.5">
          {[
            { time: '14:32', level: 'HIGH', msg: 'Heavy rainfall detected in Zone-3' },
            { time: '14:28', level: 'MODERATE', msg: 'Soil moisture increasing - East Sikkim' },
            { time: '14:15', level: 'HIGH', msg: 'Seismic activity recorded - Magnitude 3.2' },
          ].map((alert, i) => (
            <div
              key={i}
              className="rounded-sm border border-border/20 bg-background/50 p-2 text-xs hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-0.5">
                <span className="text-muted-foreground">{alert.time}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded-sm text-[10px] font-bold',
                    alert.level === 'HIGH'
                      ? 'bg-red-500/20 text-red-300'
                      : alert.level === 'MODERATE'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                  )}
                >
                  {alert.level}
                </span>
              </div>
              <p className="text-muted-foreground">{alert.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
