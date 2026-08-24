'use client'

import { useState } from 'react'
import { BellRing, Send, Radio, Smartphone, Siren, CheckCircle2, Clock } from 'lucide-react'
import { Panel } from '@/components/panel'
import { RiskBadge, StatusDot } from '@/components/primitives'
import { riskColor } from '@/lib/risk'
import { riskZones } from '@/lib/data'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  zone: string
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE'
  channel: string[]
  reach: number
  status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'PENDING'
  time: string
}

const initialAlerts: Alert[] = [
  { id: 'ALT-501', zone: 'East Sikkim Demo Zone', severity: 'CRITICAL', channel: ['SMS', 'Siren', 'App'], reach: 12400, status: 'ACKNOWLEDGED', time: '3 min ago' },
  { id: 'ALT-500', zone: 'Dima Hasao Corridor', severity: 'HIGH', channel: ['SMS', 'App'], reach: 21800, status: 'DISPATCHED', time: '18 min ago' },
  { id: 'ALT-499', zone: 'West Kameng Ridge', severity: 'HIGH', channel: ['SMS'], reach: 8600, status: 'DISPATCHED', time: '42 min ago' },
  { id: 'ALT-498', zone: 'Ri-Bhoi Slopes', severity: 'MODERATE', channel: ['App'], reach: 15200, status: 'PENDING', time: '1 hr ago' },
]

const channels = [
  { id: 'SMS', label: 'SMS Broadcast', icon: Smartphone },
  { id: 'Siren', label: 'Community Sirens', icon: Siren },
  { id: 'App', label: 'Mobile App Push', icon: Radio },
]

const statusStyle: Record<Alert['status'], string> = {
  ACKNOWLEDGED: 'text-risk-low border-risk-low/40 bg-[color-mix(in_oklch,var(--risk-low)_12%,transparent)]',
  DISPATCHED: 'text-primary border-primary/40 bg-primary/10',
  PENDING: 'text-risk-moderate border-risk-moderate/40 bg-[color-mix(in_oklch,var(--risk-moderate)_12%,transparent)]',
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [zone, setZone] = useState(riskZones[0].name)
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['SMS', 'App'])
  const [message, setMessage] = useState(
    'Landslide risk CRITICAL in your area. Move to higher stable ground immediately and avoid slopes and roads near hillsides.',
  )
  const [justSent, setJustSent] = useState(false)

  const toggleChannel = (id: string) =>
    setSelectedChannels((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const dispatch = () => {
    const z = riskZones.find((r) => r.name === zone)
    const newAlert: Alert = {
      id: `ALT-${502 + alerts.length}`,
      zone,
      severity: 'CRITICAL',
      channel: selectedChannels,
      reach: z?.population ?? 0,
      status: 'DISPATCHED',
      time: 'just now',
    }
    setAlerts((a) => [newAlert, ...a])
    setJustSent(true)
    setTimeout(() => setJustSent(false), 2500)
  }

  const totalReach = alerts.reduce((a, x) => a + x.reach, 0)

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <BellRing className="h-3.5 w-3.5 text-primary" /> Alerts
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Emergency Alert Dispatch</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Compose and broadcast multi-channel warnings to at-risk communities. Track acknowledgement and reach in real time.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-border bg-panel/60 p-4">
          <div className="font-mono text-2xl font-bold text-risk-critical">{alerts.length}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Alerts Sent</div>
        </div>
        <div className="rounded-md border border-border bg-panel/60 p-4">
          <div className="font-mono text-2xl font-bold text-foreground">{(totalReach / 1000).toFixed(1)}K</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">People Reached</div>
        </div>
        <div className="rounded-md border border-border bg-panel/60 p-4">
          <div className="font-mono text-2xl font-bold text-risk-low">
            {alerts.filter((a) => a.status === 'ACKNOWLEDGED').length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Acknowledged</div>
        </div>
        <div className="rounded-md border border-border bg-panel/60 p-4">
          <div className="font-mono text-2xl font-bold text-risk-moderate">
            {alerts.filter((a) => a.status === 'PENDING').length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Pending</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Composer */}
        <Panel className="lg:col-span-2" icon={Send} eyebrow="Composer" title="New Alert">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Target Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                {riskZones.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name} — {z.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Channels
              </label>
              <div className="grid grid-cols-3 gap-2">
                {channels.map((c) => {
                  const active = selectedChannels.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleChannel(c.id)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-md border p-3 text-[10px] font-semibold uppercase tracking-wider transition-colors',
                        active
                          ? 'border-primary/50 bg-primary/15 text-primary'
                          : 'border-border bg-background/40 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <c.icon className="h-4 w-4" />
                      {c.id}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-md border border-border bg-background/40 px-3 py-2 text-sm leading-relaxed text-foreground focus:border-primary/50 focus:outline-none"
              />
              <div className="mt-1 text-right font-mono text-[10px] text-muted-foreground">{message.length} chars</div>
            </div>

            <button
              onClick={dispatch}
              disabled={selectedChannels.length === 0}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-semibold uppercase tracking-wider transition-all',
                justSent
                  ? 'bg-risk-low text-background'
                  : 'bg-risk-critical text-background hover:opacity-90 disabled:opacity-40',
              )}
              style={!justSent ? { boxShadow: '0 0 20px color-mix(in oklch, var(--risk-critical) 40%, transparent)' } : undefined}
            >
              {justSent ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Alert Dispatched
                </>
              ) : (
                <>
                  <Siren className="h-4 w-4" /> Broadcast Emergency Alert
                </>
              )}
            </button>
            <p className="text-[10px] leading-relaxed text-muted-foreground/80">
              Prototype dispatch console. No real messages are sent. Operational use requires integration with official alerting
              infrastructure.
            </p>
          </div>
        </Panel>

        {/* Log */}
        <Panel className="lg:col-span-3" icon={BellRing} eyebrow="Dispatch Log" title="Alert History">
          <ul className="space-y-2">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="rounded-md border border-border bg-background/40 p-3"
                style={{ borderLeftColor: riskColor(a.severity), borderLeftWidth: 3 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground">{a.zone}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{a.id}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {a.channel.map((ch) => (
                        <span
                          key={ch}
                          className="rounded-sm border border-border bg-secondary px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <RiskBadge level={a.severity} />
                    <span
                      className={cn(
                        'flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
                        statusStyle[a.status],
                      )}
                    >
                      {a.status === 'ACKNOWLEDGED' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                      {a.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <StatusDot color={riskColor(a.severity)} pulse={a.status !== 'ACKNOWLEDGED'} className="h-1.5 w-1.5" />
                    Reach: <span className="font-mono text-foreground">{a.reach.toLocaleString()}</span>
                  </span>
                  <span>{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
