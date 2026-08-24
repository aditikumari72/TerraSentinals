'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { riskColorFromScore } from '@/lib/risk'
import { riskZones as defaultRiskZones, sensors, mapIncidents, hospitals, roadBlocks, type RiskZone } from '@/lib/data'
import { Radio, Hospital, TriangleAlert, Ban } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export interface MapLayers {
  zones: boolean
  sensors: boolean
  incidents: boolean
  hospitals: boolean
  roads: boolean
}

export const defaultLayers: MapLayers = {
  zones: true,
  sensors: true,
  incidents: true,
  hospitals: true,
  roads: true,
}

export function RiskMap({
  layers = defaultLayers,
  selectedId,
  onSelect,
  className,
  compact = false,
}: {
  layers?: MapLayers
  selectedId?: string | null
  onSelect?: (zone: RiskZone) => void
  className?: string
  compact?: boolean
}) {
  const [zones, setZones] = useState<RiskZone[]>(defaultRiskZones)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await apiClient.getZones()
        if (response.success && response.data) {
          const apiZones = (response.data as any[]).map((zone: any) => ({
            id: zone.id,
            name: zone.name,
            state: zone.state,
            district: zone.district,
            score: zone.score,
            probability: zone.probability,
            confidence: zone.confidence,
            population: zone.population,
            x: ((zone.longitude - 91) / 5) * 100,
            y: ((zone.latitude - 28) / 4) * 100,
            factors: zone.factors,
          }))
          setZones(apiZones)
        }
      } catch (error) {
        console.error('Failed to fetch zones:', error)
        setZones(defaultRiskZones)
      } finally {
        setLoading(false)
      }
    }

    fetchZones()
  }, [])

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-md border border-border bg-[oklch(0.19_0.03_250)]',
        className,
      )}
    >
      {/* Terrain / graticule base */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <radialGradient id="terrainGlow" cx="35%" cy="35%" r="75%">
            <stop offset="0%" stopColor="oklch(0.28 0.04 250)" />
            <stop offset="100%" stopColor="oklch(0.17 0.025 255)" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#terrainGlow)" />
        {/* graticule */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke="oklch(1 0 0 / 5%)" strokeWidth="0.15" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke="oklch(1 0 0 / 5%)" strokeWidth="0.15" />
        ))}
        {/* contour ridgelines */}
        {[18, 34, 50, 66, 82].map((y, i) => (
          <path
            key={`c${i}`}
            d={`M0 ${y} Q 20 ${y - 8}, 40 ${y - 2} T 80 ${y - 5} T 100 ${y + 2}`}
            fill="none"
            stroke="oklch(0.55 0.05 200 / 18%)"
            strokeWidth="0.2"
          />
        ))}
        {/* river */}
        <path
          d="M10 8 Q 30 30, 40 45 T 55 75 Q 60 88, 72 96"
          fill="none"
          stroke="oklch(0.6 0.1 230 / 40%)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </svg>

      {/* Risk zone glows */}
      {layers.zones &&
        zones.map((z) => {
          const color = riskColorFromScore(z.score)
          const selected = selectedId === z.id
          const size = compact ? 44 : 64
          return (
            <button
              key={z.id}
              onClick={() => onSelect?.(z)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
              aria-label={`${z.name}, risk ${z.score}`}
            >
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-md transition-opacity group-hover:opacity-70"
                style={{ width: size, height: size, backgroundColor: color }}
              />
              <span
                className={cn('relative flex items-center justify-center rounded-full border transition-transform group-hover:scale-110', selected && 'scale-110')}
                style={{
                  width: compact ? 16 : 20,
                  height: compact ? 16 : 20,
                  backgroundColor: `color-mix(in oklch, ${color} 30%, transparent)`,
                  borderColor: color,
                  boxShadow: selected ? `0 0 0 3px color-mix(in oklch, ${color} 30%, transparent), 0 0 14px ${color}` : `0 0 10px ${color}`,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
              </span>
              {!compact && (
                <span
                  className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-sm bg-background/85 px-1.5 py-0.5 text-[9px] font-medium text-foreground opacity-0 shadow transition-opacity group-hover:opacity-100"
                >
                  {z.name} · {z.score}
                </span>
              )}
            </button>
          )
        })}

      {/* Roads / blockages */}
      {layers.roads &&
        roadBlocks.map((r) => (
          <div key={r.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${r.x}%`, top: `${r.y}%` }} title={r.name}>
            <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-risk-high bg-background/80 text-risk-high">
              <Ban className="h-3 w-3" />
            </span>
          </div>
        ))}

      {/* Hospitals */}
      {layers.hospitals &&
        hospitals.map((h) => (
          <div key={h.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${h.x}%`, top: `${h.y}%` }} title={h.name}>
            <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-primary/60 bg-background/80 text-primary">
              <Hospital className="h-3 w-3" />
            </span>
          </div>
        ))}

      {/* Sensors */}
      {layers.sensors &&
        sensors.map((s) => {
          const color = s.status === 'online' ? 'var(--risk-low)' : s.status === 'degraded' ? 'var(--risk-moderate)' : 'var(--muted-foreground)'
          return (
            <div key={s.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }} title={`${s.id} · ${s.type} · ${s.status}`}>
              <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ color }}>
                <Radio className="h-3 w-3" style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
              </span>
            </div>
          )
        })}

      {/* Incidents */}
      {layers.incidents &&
        mapIncidents.map((m) => {
          const color = m.severity === 'CRITICAL' ? 'var(--risk-critical)' : m.severity === 'HIGH' ? 'var(--risk-high)' : 'var(--risk-moderate)'
          return (
            <div key={m.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.x}%`, top: `${m.y}%` }} title={`${m.type} · ${m.severity}`}>
              <span className="flex items-center justify-center animate-pulse-ring rounded-full" style={{ color }}>
                <TriangleAlert className="h-3.5 w-3.5" style={{ color, filter: `drop-shadow(0 0 4px ${color})` }} />
              </span>
            </div>
          )
        })}

      {/* Coordinate label */}
      <div className="pointer-events-none absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
        27.3°N · 88.6°E · North Eastern Region
      </div>
    </div>
  )
}

export function MapLegend({ className }: { className?: string }) {
  const items = [
    { label: '0–30 Low', color: 'var(--risk-low)' },
    { label: '31–60 Moderate', color: 'var(--risk-moderate)' },
    { label: '61–80 High', color: 'var(--risk-high)' },
    { label: '81–100 Critical', color: 'var(--risk-critical)' },
  ]
  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: it.color, boxShadow: `0 0 6px ${it.color}` }} />
          {it.label}
        </div>
      ))}
    </div>
  )
}
