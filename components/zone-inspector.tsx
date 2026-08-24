'use client'

import { Brain, ShieldAlert, X, Sparkles } from 'lucide-react'
import { riskColorFromScore, riskLevel } from '@/lib/risk'
import { RiskBadge } from '@/components/primitives'
import type { RiskZone } from '@/lib/data'

export function ZoneInspector({ zone, onClose }: { zone: RiskZone; onClose?: () => void }) {
  const color = riskColorFromScore(zone.score)
  const level = riskLevel(zone.score)
  const maxFactor = Math.max(...zone.factors.map((f) => f.value))

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Zone Inspector</div>
          <h3 className="text-sm font-semibold text-foreground">{zone.name}</h3>
          <p className="text-[11px] text-muted-foreground">
            {zone.district}, {zone.state}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close inspector">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="scroll-thin flex-1 space-y-4 overflow-y-auto p-4">
        {/* Risk score dial */}
        <div className="flex items-center gap-4 rounded-md border border-border bg-background/40 p-4">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(zone.score / 100) * 97.4} 97.4`}
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
              />
            </svg>
            <div className="absolute text-center leading-none">
              <div className="text-xl font-bold tabular-nums" style={{ color }}>
                {zone.score}
              </div>
              <div className="text-[9px] text-muted-foreground">/ 100</div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <RiskBadge level={level} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Probability</div>
                <div className="text-base font-semibold tabular-nums text-foreground">{zone.probability}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</div>
                <div className="text-base font-semibold tabular-nums text-foreground">{zone.confidence}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk factors */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" /> Risk Factors
          </div>
          <div className="space-y-2.5">
            {zone.factors.map((f) => (
              <div key={f.label}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="text-foreground">{f.label}</span>
                  <span className="font-mono font-semibold" style={{ color }}>
                    +{f.value}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(f.value / maxFactor) * 100}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI explanation */}
        <div className="rounded-md border border-primary/25 bg-primary/5 p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Brain className="h-3.5 w-3.5" /> Why is the risk increasing?
          </div>
          <p className="text-[12px] leading-relaxed text-foreground/90">
            Extreme rainfall accumulation combined with elevated soil moisture and steep terrain is causing rapidly increasing slope
            instability across {zone.name}.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Recommendation
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-foreground/90">
            Inspect vulnerable slopes, prepare alternative road access and issue precautionary warnings to nearby communities.
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-primary/15 pt-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Model Confidence</span>
            <span className="text-sm font-bold text-primary">{zone.confidence}%</span>
          </div>
        </div>

        <p className="text-[10px] leading-relaxed text-muted-foreground/80">
          Prototype AI risk estimation using synthetic data. Operational deployment requires validation using official datasets.
        </p>
      </div>
    </div>
  )
}
