'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'
import { riskColor, riskLevel, type RiskLevel } from '@/lib/risk'

export function StatusDot({
  color = 'var(--risk-low)',
  pulse = true,
  className,
}: {
  color?: string
  pulse?: boolean
  className?: string
}) {
  return (
    <span className={cn('relative inline-flex h-2.5 w-2.5', className)} style={{ color }}>
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
    </span>
  )
}

export function RiskBadge({ score, level, className }: { score?: number; level?: RiskLevel; className?: string }) {
  const lvl = level ?? riskLevel(score ?? 0)
  const color = riskColor(lvl)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
        className,
      )}
      style={{
        color,
        borderColor: `color-mix(in oklch, ${color} 45%, transparent)`,
        backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
      {lvl}
    </span>
  )
}

export function Sparkline({
  data,
  color = 'var(--primary)',
  width = 96,
  height = 28,
  className,
}: {
  data: number[]
  color?: string
  width?: number
  height?: number
  className?: string
}) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const points = data.map((d, i) => {
    const x = i * step
    const y = height - ((d - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })
  const uid = useId()
  const areaId = `spark-${uid.replace(/:/g, '')}`
  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${height} ${points.join(' ')} ${width},${height}`} fill={`url(#${areaId})`} stroke="none" />
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</div>}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  )
}
