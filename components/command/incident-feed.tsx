import { useEffect, useState } from 'react'
import { RiskBadge } from '@/components/primitives'
import { incidents as defaultIncidents, type Incident } from '@/lib/data'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const statusStyle: Record<string, string> = {
  NEW: 'text-primary border-primary/40 bg-primary/10',
  VERIFYING: 'text-risk-moderate border-risk-moderate/40 bg-[color-mix(in_oklch,var(--risk-moderate)_12%,transparent)]',
  VERIFIED: 'text-risk-high border-risk-high/40 bg-[color-mix(in_oklch,var(--risk-high)_12%,transparent)]',
  RESOLVED: 'text-risk-low border-risk-low/40 bg-[color-mix(in_oklch,var(--risk-low)_12%,transparent)]',
  reported: 'text-primary border-primary/40 bg-primary/10',
  verified: 'text-risk-high border-risk-high/40 bg-[color-mix(in_oklch,var(--risk-high)_12%,transparent)]',
  resolved: 'text-risk-low border-risk-low/40 bg-[color-mix(in_oklch,var(--risk-low)_12%,transparent)]',
}

interface IncidentData {
  id: string
  name: string
  type: string
  severity: string
  status: string
  timestamp: string
  location?: string
  time?: string
}

export function IncidentFeed({ items, limit }: { items?: Incident[]; limit?: number }) {
  const [incidents, setIncidents] = useState<IncidentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await apiClient.getIncidents()
        if (response.success && response.data) {
          const mapped = (response.data as any[]).map((inc) => ({
            id: inc.id,
            name: inc.name,
            type: inc.type,
            severity: inc.severity,
            status: inc.status,
            timestamp: inc.timestamp,
            location: `${inc.latitude.toFixed(2)}°, ${inc.longitude.toFixed(2)}°`,
            time: new Date(inc.timestamp).toLocaleTimeString(),
          }))
          setIncidents(limit ? mapped.slice(0, limit) : mapped)
        } else {
          setIncidents([])
        }
      } catch (error) {
        console.error('Failed to fetch incidents:', error)
        setIncidents([])
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [limit])

  const data = items ? (limit ? items.slice(0, limit) : items) : incidents

  if (loading && !data.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading incidents...
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No incidents reported.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {data.map((inc: any) => (
        <li key={inc.id} className="flex items-center gap-3 px-1 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-foreground">{inc.type || inc.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{inc.id}</span>
            </div>
            <div className="truncate text-[12px] text-muted-foreground">{inc.location || ''}</div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <RiskBadge level={inc.severity} />
            <div className="flex items-center gap-1.5">
              <span className={cn('rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider', statusStyle[inc.status] || statusStyle.reported)}>
                {inc.status}
              </span>
              <span className="text-[10px] text-muted-foreground">{inc.time || ''}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
