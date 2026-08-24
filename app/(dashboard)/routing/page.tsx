'use client'

import { Route, MapPin, Clock, CheckCircle, AlertTriangle, Navigation } from 'lucide-react'
import { Panel } from '@/components/panel'
import { riskZones, roadBlocks, hospitals } from '@/lib/data'

const ROUTES = [
  {
    id: 'r1',
    name: 'Primary Evacuation — East Sikkim',
    from: 'Gangtok Urban Core',
    to: 'Siliguri Safe Zone',
    via: 'SH-2 (Hazard-Free Corridor)',
    distance: '98 km',
    time: '2h 14m',
    addedTime: '+18 min vs NH-10',
    status: 'SAFE',
    risk: 12,
    zones: 0,
    color: 'var(--risk-low)',
  },
  {
    id: 'r2',
    name: 'Hospital Access Route',
    from: 'Ranipool Emergency Zone',
    to: 'Gangtok District Hospital',
    via: 'MG Road Bypass',
    distance: '14 km',
    time: '22 min',
    addedTime: '+7 min vs direct route',
    status: 'SAFE',
    risk: 18,
    zones: 0,
    color: 'var(--risk-low)',
  },
  {
    id: 'r3',
    name: 'Supply Chain — Haflong Sector',
    from: 'Lumding Junction',
    to: 'Haflong Civil Hospital',
    via: 'SH-5 Alternate',
    distance: '62 km',
    time: '1h 38m',
    addedTime: '+24 min vs NH-54',
    status: 'CAUTION',
    risk: 44,
    zones: 1,
    color: 'var(--risk-moderate)',
  },
  {
    id: 'r4',
    name: 'Response Team Deployment',
    from: 'Shillong SDRF Base',
    to: 'Nongpoh, Ri-Bhoi',
    via: 'NH-6 (Monitored)',
    distance: '56 km',
    time: '1h 12m',
    addedTime: 'Recommended route',
    status: 'CAUTION',
    risk: 38,
    zones: 1,
    color: 'var(--risk-moderate)',
  },
]

const STATUS_COLORS: Record<string, string> = {
  SAFE: 'var(--risk-low)',
  CAUTION: 'var(--risk-moderate)',
  BLOCKED: 'var(--risk-critical)',
}

export default function SafeRoutingPage() {
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
        <span className="rounded-sm border border-border bg-panel/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Synthetic prototype
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {/* Status summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Safe Routes Active', value: '2', color: 'var(--risk-low)', icon: CheckCircle },
            { label: 'Caution Routes', value: '2', color: 'var(--risk-moderate)', icon: AlertTriangle },
            { label: 'Blocked Corridors', value: String(roadBlocks.length), color: 'var(--risk-critical)', icon: Route },
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
            {ROUTES.map((route) => {
              const sc = STATUS_COLORS[route.status]
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
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {route.from}
                        </span>
                        <span>→</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {route.to}
                        </span>
                      </div>
                      <div className="mt-1 text-[12px] text-muted-foreground">
                        Via: <span className="text-foreground">{route.via}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-4 text-right sm:flex-col sm:gap-2">
                      <div>
                        <div className="font-mono text-base font-bold text-foreground">{route.distance}</div>
                        <div className="text-[10px] text-muted-foreground">distance</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 font-mono text-base font-bold text-foreground">
                          <Clock className="h-3.5 w-3.5" />{route.time}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{route.addedTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* Risk bar */}
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Route Risk Index</span>
                      <span className="font-mono font-semibold" style={{ color: sc }}>{route.risk}/100</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${route.risk}%`, backgroundColor: sc }} />
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
          Prototype routing using synthetic data. Do not use for live operational routing.
        </p>
      </div>
    </div>
  )
}
