'use client'

import { useMemo, useState } from 'react'
import { Layers, Search, Users } from 'lucide-react'
import { Panel } from '@/components/panel'
import { ZoneInspector } from '@/components/zone-inspector'
import { RiskBadge } from '@/components/primitives'
import { riskColorFromScore, riskLevel, type RiskLevel } from '@/lib/risk'
import { riskZones } from '@/lib/data'
import { cn } from '@/lib/utils'

const FILTERS: (RiskLevel | 'ALL')[] = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW']

export default function ZonesPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<RiskLevel | 'ALL'>('ALL')
  const [selectedId, setSelectedId] = useState(riskZones[0].id)

  const filtered = useMemo(() => {
    return riskZones
      .filter((z) => (filter === 'ALL' ? true : riskLevel(z.score) === filter))
      .filter(
        (z) =>
          z.name.toLowerCase().includes(query.toLowerCase()) ||
          z.state.toLowerCase().includes(query.toLowerCase()) ||
          z.district.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => b.score - a.score)
  }, [query, filter])

  const selected = riskZones.find((z) => z.id === selectedId) ?? riskZones[0]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <Layers className="h-3.5 w-3.5 text-primary" /> Risk Zones
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Zone Risk Registry</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Ranked landslide risk zones across the North Eastern Region with AI-scored probability and population exposure.
          </p>
        </div>
        <div className="flex gap-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>
            <span className="text-risk-critical">{riskZones.filter((z) => z.score >= 81).length}</span> Critical
          </span>
          <span>
            <span className="text-risk-high">{riskZones.filter((z) => z.score >= 61 && z.score < 81).length}</span> High
          </span>
          <span>
            <span className="text-foreground">{riskZones.length}</span> Total
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* List */}
        <div className="space-y-3 lg:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search zone, district or state..."
                className="w-full rounded-md border border-border bg-panel/60 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-sm border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors',
                    filter === f
                      ? 'border-primary/50 bg-primary/15 text-primary'
                      : 'border-border bg-panel/60 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-panel/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Zone</th>
                  <th className="px-3 py-2 font-medium">Risk</th>
                  <th className="hidden px-3 py-2 font-medium sm:table-cell">Prob.</th>
                  <th className="px-3 py-2 text-right font-medium">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((z) => {
                  const color = riskColorFromScore(z.score)
                  return (
                    <tr
                      key={z.id}
                      onClick={() => setSelectedId(z.id)}
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-secondary/40',
                        selectedId === z.id && 'bg-secondary/60',
                      )}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="h-8 w-1 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                          <div>
                            <div className="text-[13px] font-medium text-foreground">{z.name}</div>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <span>{z.district}, {z.state}</span>
                              <span className="inline-flex items-center gap-0.5">
                                <Users className="h-3 w-3" /> {(z.population / 1000).toFixed(1)}K
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <RiskBadge level={riskLevel(z.score)} />
                      </td>
                      <td className="hidden px-3 py-2.5 font-mono text-[13px] text-foreground sm:table-cell">{z.probability}%</td>
                      <td className="px-3 py-2.5 text-right font-mono text-lg font-bold tabular-nums" style={{ color }}>
                        {z.score}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No zones match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspector */}
        <div className="lg:col-span-2">
          <Panel noPadding className="lg:sticky lg:top-4">
            <ZoneInspector zone={selected} />
          </Panel>
        </div>
      </div>
    </div>
  )
}
