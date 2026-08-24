'use client'

import { Activity, Users, Building2, Truck, Route, TriangleAlert } from 'lucide-react'
import { Panel } from '@/components/panel'
import { RiskBadge } from '@/components/primitives'
import { riskZones, mapIncidents, hospitals, roadBlocks } from '@/lib/data'
import { riskColor, riskLevel } from '@/lib/risk'

export default function ImpactAnalysisPage() {
  const totalPop = riskZones.reduce((s, z) => s + z.population, 0)
  const criticalZones = riskZones.filter((z) => z.score >= 81)
  const highZones = riskZones.filter((z) => z.score >= 61 && z.score < 81)

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Impact Analysis
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Cascading Impact Assessment</h1>
          <p className="mt-0.5 max-w-xl text-[13px] text-muted-foreground">
            People exposed, infrastructure at risk, and projected cascading effects across the North Eastern Region.
          </p>
        </div>
        <span className="rounded-sm border border-border bg-panel/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Synthetic data
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {/* Summary KPIs */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total People Exposed', value: totalPop.toLocaleString(), icon: Users, color: 'var(--risk-critical)' },
            { label: 'Critical Zones', value: String(criticalZones.length), icon: TriangleAlert, color: 'var(--risk-critical)' },
            { label: 'High Risk Zones', value: String(highZones.length), icon: Activity, color: 'var(--risk-high)' },
            { label: 'Active Incidents', value: String(mapIncidents.length), icon: TriangleAlert, color: 'var(--risk-high)' },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-md border bg-panel/60 p-4"
              style={{ borderColor: `color-mix(in oklch, ${k.color} 30%, var(--border))` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</span>
                <k.icon className="h-4 w-4" style={{ color: k.color }} />
              </div>
              <div className="mt-2 font-mono text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Zones at risk */}
          <Panel icon={TriangleAlert} eyebrow="Population" title="Exposed Zones by Risk Score">
            <div className="space-y-2">
              {[...riskZones].sort((a, b) => b.score - a.score).map((z) => {
                const color = riskColor(riskLevel(z.score))
                return (
                  <div key={z.id} className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-foreground">{z.name}</div>
                      <div className="text-[11px] text-muted-foreground">{z.district}, {z.state}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[11px] text-muted-foreground">{z.population.toLocaleString()} people</div>
                      <RiskBadge score={z.score} />
                    </div>
                    <div
                      className="h-10 w-1.5 rounded-full"
                      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                    />
                  </div>
                )
              })}
            </div>
          </Panel>

          {/* Infrastructure */}
          <div className="space-y-4">
            <Panel icon={Building2} eyebrow="Healthcare" title="At-Risk Hospitals & Facilities">
              <div className="space-y-2">
                {hospitals.map((h) => (
                  <div key={h.id} className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5">
                    <Building2 className="h-4 w-4 shrink-0 text-risk-high" style={{ color: 'var(--risk-high)' }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-foreground">{h.name}</div>
                      <div className="text-[11px] text-muted-foreground">Risk of access disruption from active zones</div>
                    </div>
                    <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--risk-high)', borderColor: 'color-mix(in oklch, var(--risk-high) 40%, transparent)' }}>
                      At Risk
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel icon={Truck} eyebrow="Roads" title="Blocked & At-Risk Infrastructure">
              <div className="space-y-2">
                {roadBlocks.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5">
                    <Route className="h-4 w-4 shrink-0" style={{ color: 'var(--risk-critical)' }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-foreground">{r.name}</div>
                      <div className="text-[11px] text-muted-foreground">Emergency access corridor affected</div>
                    </div>
                    <span className="rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--risk-critical)', borderColor: 'color-mix(in oklch, var(--risk-critical) 40%, transparent)' }}>
                      Blocked
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5">
                  <Route className="h-4 w-4 shrink-0" style={{ color: 'var(--risk-high)' }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-foreground">NH-10 Alternate Detour</div>
                    <div className="text-[11px] text-muted-foreground">Monitoring for potential secondary blockage</div>
                  </div>
                  <span className="rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--risk-high)', borderColor: 'color-mix(in oklch, var(--risk-high) 40%, transparent)' }}>
                    Monitor
                  </span>
                </div>
              </div>
            </Panel>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Prototype impact analysis using synthetic data. Not for operational emergency decision-making.
        </p>
      </div>
    </div>
  )
}
