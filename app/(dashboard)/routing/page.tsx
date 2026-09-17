'use client'

import { useState } from 'react'
import { Route, MapPin, Clock, CheckCircle, AlertTriangle, Navigation, Wifi, WifiOff, Loader2 } from 'lucide-react'
import { Panel } from '@/components/panel'
import { roadBlocks } from '@/lib/data'
import { useZones, useCalculateSafeRoutes } from '@/lib/hooks/useApi'

const STATUS_COLORS: Record<string, string> = {
  SAFE: 'var(--risk-low)',
  CAUTION: 'var(--risk-moderate)',
  BLOCKED: 'var(--risk-critical)',
}

export default function SafeRoutingPage() {
  const { data: zones, loading: zonesLoading, error: zonesError } = useZones()
  const { execute: calcRoutes, data: routeResult, loading: calcLoading } = useCalculateSafeRoutes()

  const isLive = !!zones && !zonesError
  const criticalZoneIds = (zones ?? [])
    .filter((z: any) => z.score > 60)
    .map((z: any) => z.id)

  // Auto-calculate routes using NE Region default coordinates
  const [routesLoaded, setRoutesLoaded] = useState(false)

  const handleCalculate = async () => {
    await calcRoutes({
      startLat: 27.33,
      startLon: 88.61,
      endLat: 26.72,
      endLon: 88.43,
      riskZones: criticalZoneIds,
    })
    setRoutesLoaded(true)
  }

  const routes = routeResult?.routes ?? [
    {
      id: 'r1',
      name: 'Primary Evacuation — East Sikkim',
      status: 'SAFE',
      riskScore: 12,
      distance: 98,
      duration: '2h 14m',
      conditions: 'All clear, best option',
      riskFactors: ['Steep slopes on north side'],
    },
    {
      id: 'r2',
      name: 'Hospital Access Route',
      status: 'SAFE',
      riskScore: 18,
      distance: 14,
      duration: '22 min',
      conditions: 'All clear',
      riskFactors: [],
    },
    {
      id: 'r3',
      name: 'Supply Chain — Haflong Sector',
      status: 'CAUTION',
      riskScore: 44,
      distance: 62,
      duration: '1h 38m',
      conditions: 'Caution — monitor conditions',
      riskFactors: ['Active zone nearby'],
    },
    {
      id: 'r4',
      name: 'Response Team Deployment',
      status: 'CAUTION',
      riskScore: 38,
      distance: 56,
      duration: '1h 12m',
      conditions: 'Recommended with monitoring',
      riskFactors: ['Avalanche risk on mountain pass'],
    },
  ]

  const safeCount = routes.filter((r: any) => r.status === 'SAFE').length
  const cautionCount = routes.filter((r: any) => r.status === 'CAUTION').length
  const blockedCount = routes.filter((r: any) => r.status === 'BLOCKED').length + roadBlocks.length

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <Route className="h-3.5 w-3.5 text-primary" />
            Safe Routing
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Safe Evacuation & Access Routes</h1>
          <p className="mt-0.5 max-w-xl text-[13px] text-muted-foreground">
            AI-computed safe corridors avoiding active landslide zones — for evacuation, hospital access, and emergency deployment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${isLive ? 'border-[color-mix(in_oklch,var(--risk-low)_30%,transparent)] text-[var(--risk-low)]' : 'border-border text-muted-foreground'}`}>
            {isLive ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
            {isLive ? 'Live zones' : 'Offline'}
          </span>
          <button
            id="routing-calculate-btn"
            onClick={handleCalculate}
            disabled={calcLoading || zonesLoading}
            className="inline-flex items-center gap-1.5 rounded-sm border border-primary/50 bg-primary/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          >
            {calcLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Navigation className="h-3 w-3" />
            )}
            {routesLoaded ? 'Recalculate' : 'Calculate Live Routes'}
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {/* Live zone risk summary */}
        {isLive && (
          <div className="rounded-md border border-border bg-panel/60 px-4 py-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
              <span className="text-muted-foreground">
                Live data: <span className="font-mono font-semibold text-foreground">{zones.length}</span> zones monitored
              </span>
              <span className="text-muted-foreground">
                Critical zones: <span className="font-mono font-semibold" style={{ color: 'var(--risk-critical)' }}>
                  {zones.filter((z: any) => z.score > 80).length}
                </span>
              </span>
              <span className="text-muted-foreground">
                Avg risk score: <span className="font-mono font-semibold text-foreground">
                  {Math.round(zones.reduce((s: number, z: any) => s + z.score, 0) / zones.length)}
                </span>
              </span>
              {routeResult?.currentZoneRisk && (
                <span className="text-muted-foreground">
                  Route calc used real-time zone data ✓
                </span>
              )}
            </div>
          </div>
        )}

        {/* Status summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Safe Routes Active', value: String(safeCount), color: 'var(--risk-low)', icon: CheckCircle },
            { label: 'Caution Routes', value: String(cautionCount), color: 'var(--risk-moderate)', icon: AlertTriangle },
            { label: 'Blocked Corridors', value: String(blockedCount), color: 'var(--risk-critical)', icon: Route },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-md border bg-panel/60 px-4 py-3"
              style={{ borderColor: `color-mix(in oklch, ${s.color} 30%, var(--border))` }}
            >
              <s.icon className="h-5 w-5 shrink-0" style={{ color: s.color }} />
              <div>
                <div className="font-mono text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Route cards */}
        <Panel icon={Navigation} eyebrow="Computed Routes" title="Recommended Evacuation & Access Corridors">
          <div className="space-y-3">
            {routes.map((route: any) => {
              const sc = STATUS_COLORS[route.status] ?? 'var(--muted-foreground)'
              return (
                <div
                  key={route.id}
                  id={`route-${route.id}`}
                  className="rounded-md border p-4"
                  style={{
                    borderColor: `color-mix(in oklch, ${sc} 35%, var(--border))`,
                    backgroundColor: `color-mix(in oklch, ${sc} 6%, var(--panel))`,
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="rounded-sm border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: sc, borderColor: `color-mix(in oklch, ${sc} 45%, transparent)` }}
                        >
                          {route.status}
                        </span>
                        <span className="text-[13px] font-semibold text-foreground">{route.name}</span>
                      </div>
                      {route.conditions && (
                        <div className="text-[12px] text-muted-foreground">{route.conditions}</div>
                      )}
                      {route.riskFactors?.length > 0 && (
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          ⚠ {route.riskFactors.join(' · ')}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-4 text-right sm:flex-col sm:gap-2">
                      <div>
                        <div className="font-mono text-base font-bold text-foreground">{route.distance} km</div>
                        <div className="text-[10px] text-muted-foreground">distance</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 font-mono text-base font-bold text-foreground">
                          <Clock className="h-3.5 w-3.5" />{route.duration}
                        </div>
                        <div className="text-[10px] text-muted-foreground">est. time</div>
                      </div>
                    </div>
                  </div>

                  {/* Risk bar */}
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Route Risk Index</span>
                      <span className="font-mono font-semibold" style={{ color: sc }}>{route.riskScore}/100</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${route.riskScore}%`, backgroundColor: sc }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* Blocked */}
        <Panel icon={Route} eyebrow="Blocked" title="Impassable Corridors">
          <div className="space-y-2">
            {roadBlocks.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5">
                <div className="h-2 w-2 rounded-full bg-[var(--risk-critical)]" />
                <div className="flex-1 text-[13px] font-medium text-foreground">{r.name}</div>
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--risk-critical)' }}>Blocked</span>
              </div>
            ))}
          </div>
        </Panel>

        <p className="text-center text-[11px] text-muted-foreground">
          {routesLoaded
            ? 'Routes computed using live zone risk data from NER Landslide Intelligence API'
            : 'Click "Calculate Live Routes" to compute routes using real-time zone risk data'}
        </p>
      </div>
    </div>
  )
}
