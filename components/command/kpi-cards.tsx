import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Sparkline } from '@/components/primitives'
import { cn } from '@/lib/utils'
import type { Kpi } from '@/lib/data'

const toneColor: Record<Kpi['status'], string> = {
  critical: 'var(--risk-critical)',
  high: 'var(--risk-high)',
  ok: 'var(--risk-low)',
}

export function KpiCards({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {items.map((k) => {
        const color = toneColor[k.status]
        const TrendIcon = k.trendUp ? ArrowUpRight : ArrowDownRight
        return (
          <div key={k.label} className="relative overflow-hidden rounded-md border border-border bg-panel/60 p-3.5">
            <div
              className="absolute left-0 top-0 h-full w-0.5"
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            />
            <div className="flex items-start justify-between">
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{k.label}</div>
              <span
                className={cn('inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[10px] font-semibold')}
                style={{ color, backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)` }}
              >
                <TrendIcon className="h-3 w-3" />
                {k.trend}
              </span>
            </div>
            <div className="mt-1.5 flex items-end justify-between gap-2">
              <div className="text-2xl font-bold tabular-nums leading-none text-foreground">{k.value}</div>
              <Sparkline data={k.spark} color={color} width={64} height={24} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
