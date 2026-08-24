'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { riskColorFromScore } from '@/lib/risk'

const axisStyle = { fontSize: 11, fill: 'var(--muted-foreground)' }
const gridStroke = 'oklch(1 0 0 / 6%)'

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border bg-popover/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur">
      {label != null && <div className="mb-1 font-semibold text-foreground">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color || p.stroke || p.fill }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-mono font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function RiskTrendChart({ data, height = 200 }: { data: { time: string; risk: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--risk-critical)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--risk-critical)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey="time" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={axisStyle} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox />} />
        <Area type="monotone" dataKey="risk" stroke="var(--risk-critical)" strokeWidth={2} fill="url(#riskFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function RainfallRiskChart({
  data,
  height = 200,
}: {
  data: { time: string; rainfall: number; risk: number }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey="time" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox />} />
        <Line type="monotone" dataKey="rainfall" name="rainfall (mm)" stroke="var(--primary)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="risk" name="risk" stroke="var(--risk-critical)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function RiskByStateChart({
  data,
  height = 260,
}: {
  data: { state: string; risk: number }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey="state" tick={axisStyle} tickLine={false} axisLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
        <YAxis domain={[0, 100]} tick={axisStyle} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox />} cursor={{ fill: 'oklch(1 0 0 / 4%)' }} />
        <Bar dataKey="risk" radius={[3, 3, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.state} fill={riskColorFromScore(d.risk)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function IncidentTrendChart({
  data,
  height = 260,
}: {
  data: { day: string; incidents: number; resolved: number }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--risk-high)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--risk-high)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="resFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--risk-low)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--risk-low)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox />} />
        <Area type="monotone" dataKey="incidents" stroke="var(--risk-high)" strokeWidth={2} fill="url(#incFill)" />
        <Area type="monotone" dataKey="resolved" stroke="var(--risk-low)" strokeWidth={2} fill="url(#resFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function SimpleBarChart({
  data,
  dataKey,
  height = 240,
  color = 'var(--primary)',
  format,
}: {
  data: any[]
  dataKey: string
  height?: number
  color?: string
  format?: (v: number) => string
}) {
  const xKey = Object.keys(data[0]).find((k) => k !== dataKey) ?? 'name'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={44} tickFormatter={format} />
        <Tooltip content={<TooltipBox />} cursor={{ fill: 'oklch(1 0 0 / 4%)' }} />
        <Bar dataKey={dataKey} radius={[3, 3, 0, 0]} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function SimpleLineChart({
  data,
  dataKey,
  height = 240,
  color = 'var(--primary)',
  domain,
}: {
  data: any[]
  dataKey: string
  height?: number
  color?: string
  domain?: [number, number]
}) {
  const xKey = Object.keys(data[0]).find((k) => k !== dataKey) ?? 'name'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis domain={domain ?? ['auto', 'auto']} tick={axisStyle} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox />} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 2, fill: color }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
