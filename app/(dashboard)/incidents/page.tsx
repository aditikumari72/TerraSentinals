'use client'

import { useMemo, useState } from 'react'
import { AlertOctagon, Search } from 'lucide-react'
import { Panel } from '@/components/panel'
import { IncidentFeed } from '@/components/command/incident-feed'
import { IncidentTrendChart } from '@/components/charts'
import { incidents, incidentTrend, type Incident } from '@/lib/data'
import { cn } from '@/lib/utils'

const STATUS_FILTERS: (Incident['status'] | 'ALL')[] = ['ALL', 'NEW', 'VERIFYING', 'VERIFIED', 'RESOLVED']

export default function IncidentsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Incident['status'] | 'ALL'>('ALL')

  const filtered = useMemo(() => {
    return incidents
      .filter((i) => (status === 'ALL' ? true : i.status === status))
      .filter(
        (i) => i.type.toLowerCase().includes(query.toLowerCase()) || i.location.toLowerCase().includes(query.toLowerCase()),
      )
  }, [query, status])

  const counts = {
    active: incidents.filter((i) => i.status !== 'RESOLVED').length,
    critical: incidents.filter((i) => i.severity === 'CRITICAL').length,
    verifying: incidents.filter((i) => i.status === 'VERIFYING').length,
    resolved: incidents.filter((i) => i.status === 'RESOLVED').length,
  }

  const stats = [
    { label: 'Active Incidents', value: counts.active, tone: 'var(--risk-high)' },
    { label: 'Critical', value: counts.critical, tone: 'var(--risk-critical)' },
    { label: 'Verifying', value: counts.verifying, tone: 'var(--risk-moderate)' },
    { label: 'Resolved (24h)', value: counts.resolved, tone: 'var(--risk-low)' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <AlertOctagon className="h-3.5 w-3.5 text-primary" /> Incidents
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Incident Operations Log</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Real-time ground truth feed of verified and pending hazard events across the region.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-border bg-panel/60 p-4">
            <div className="font-mono text-3xl font-bold tabular-nums" style={{ color: s.tone }}>
              {s.value}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" icon={AlertOctagon} eyebrow="Ground Truth" title="Incident Feed">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search incidents..."
                className="w-full rounded-md border border-border bg-background/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatus(f)}
                  className={cn(
                    'rounded-sm border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors',
                    status === f
                      ? 'border-primary/50 bg-primary/15 text-primary'
                      : 'border-border bg-background/40 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {filtered.length > 0 ? (
            <IncidentFeed items={filtered} />
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No incidents match your filters.</div>
          )}
        </Panel>

        <Panel icon={AlertOctagon} eyebrow="7-Day" title="Reported vs Resolved" noPadding>
          <div className="p-4">
            <IncidentTrendChart data={incidentTrend} height={240} />
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-risk-high" /> Reported
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-risk-low" /> Resolved
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
