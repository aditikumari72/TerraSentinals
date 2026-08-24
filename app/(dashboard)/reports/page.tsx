'use client'

import { useMemo, useState } from 'react'
import { Users, ShieldCheck, Layers3, MapPin, Search } from 'lucide-react'
import { Panel } from '@/components/panel'
import { RiskBadge } from '@/components/primitives'
import { citizenReports, type CitizenReport } from '@/lib/data'
import { cn } from '@/lib/utils'

const statusStyle: Record<string, string> = {
  'AI VERIFIED': 'text-risk-low border-risk-low/40 bg-[color-mix(in_oklch,var(--risk-low)_12%,transparent)]',
  'FIELD VERIFICATION REQUIRED':
    'text-risk-high border-risk-high/40 bg-[color-mix(in_oklch,var(--risk-high)_12%,transparent)]',
  CLUSTERING: 'text-primary border-primary/40 bg-primary/10',
}

function confidenceColor(c: number) {
  if (c >= 90) return 'var(--risk-low)'
  if (c >= 80) return 'var(--risk-moderate)'
  return 'var(--risk-high)'
}

export default function ReportsPage() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(citizenReports[0].id)

  const filtered = useMemo(
    () =>
      citizenReports.filter(
        (r) =>
          r.hazard.toLowerCase().includes(query.toLowerCase()) ||
          r.location.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  const selected = citizenReports.find((r) => r.id === selectedId) ?? citizenReports[0]

  // reports at the same location are clustered
  const cluster = citizenReports.filter((r) => r.location === selected.location)

  const stats = [
    { label: 'Reports Today', value: citizenReports.length, icon: Users, tone: 'var(--primary)' },
    { label: 'AI Verified', value: citizenReports.filter((r) => r.status === 'AI VERIFIED').length, icon: ShieldCheck, tone: 'var(--risk-low)' },
    { label: 'Needs Field Check', value: citizenReports.filter((r) => r.status === 'FIELD VERIFICATION REQUIRED').length, icon: MapPin, tone: 'var(--risk-high)' },
    { label: 'Active Clusters', value: 3, icon: Layers3, tone: 'var(--risk-moderate)' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <Users className="h-3.5 w-3.5 text-primary" /> Citizen Reports
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Crowdsourced Verification Queue</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          AI-triaged citizen and field hazard reports. Duplicate sightings are clustered and scored for verification priority.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-md border border-border bg-panel/60 p-4">
            <s.icon className="h-5 w-5" style={{ color: s.tone }} />
            <div>
              <div className="font-mono text-2xl font-bold tabular-nums text-foreground">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3" icon={Users} eyebrow="Incoming" title="Report Queue">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full rounded-md border border-border bg-background/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
          <ul className="space-y-2">
            {filtered.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setSelectedId(r.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors',
                    selectedId === r.id ? 'border-primary/50 bg-secondary/60' : 'border-border bg-background/40 hover:bg-secondary/40',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground">{r.hazard}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{r.id}</span>
                    </div>
                    <div className="truncate text-[12px] text-muted-foreground">
                      {r.location} · {r.reporter} · {r.time}
                    </div>
                    <span
                      className={cn(
                        'mt-1.5 inline-block rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
                        statusStyle[r.status] ?? 'text-muted-foreground border-border',
                      )}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <RiskBadge level={r.severity} />
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold leading-none tabular-nums" style={{ color: confidenceColor(r.confidence) }}>
                        {r.confidence}%
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">AI conf.</div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Detail / cluster */}
        <div className="space-y-4 lg:col-span-2">
          <Panel icon={Layers3} eyebrow="Cluster Analysis" title={selected.location}>
            <div className="space-y-3">
              <div className="rounded-md border border-primary/25 bg-primary/5 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Deduplication</div>
                <p className="mt-1 text-[12px] leading-relaxed text-foreground/90">
                  {cluster.length} report{cluster.length > 1 ? 's' : ''} from this location clustered into a single event. Multiple
                  independent sightings raise the verification confidence.
                </p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span>Aggregate Confidence</span>
                  <span className="font-mono font-semibold text-foreground">
                    {Math.round(cluster.reduce((a, r) => a + r.confidence, 0) / cluster.length)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-background/60">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.round(cluster.reduce((a, r) => a + r.confidence, 0) / cluster.length)}%`,
                      boxShadow: '0 0 8px var(--primary)',
                    }}
                  />
                </div>
              </div>
              <ul className="space-y-1.5">
                {cluster.map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-sm border border-border bg-background/40 px-2.5 py-1.5 text-[11px]">
                    <span className="font-mono text-muted-foreground">{r.id}</span>
                    <span className="text-foreground">{r.hazard}</span>
                    <span className="text-muted-foreground">{r.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <div className="flex gap-2">
            <button className="flex-1 rounded-md border border-risk-low/40 bg-[color-mix(in_oklch,var(--risk-low)_12%,transparent)] py-2 text-[12px] font-semibold uppercase tracking-wider text-risk-low transition-opacity hover:opacity-80">
              Confirm & Escalate
            </button>
            <button className="flex-1 rounded-md border border-border bg-secondary py-2 text-[12px] font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary/70">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
