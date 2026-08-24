import { Database, Brain, Gauge, MessageSquareText, SlidersHorizontal, Activity, Route, BellRing, ArrowRight } from 'lucide-react'

const steps = [
  { icon: Database, label: 'Data Sources', sub: 'Rain · Soil · Slope · Satellite' },
  { icon: Brain, label: 'AI Risk Engine', sub: 'Ensemble model' },
  { icon: Gauge, label: 'Risk Score', sub: '0–100 index' },
  { icon: MessageSquareText, label: 'AI Explanation', sub: 'Human-readable' },
  { icon: SlidersHorizontal, label: 'What-If Simulation', sub: 'Scenario modeling' },
  { icon: Activity, label: 'Impact Analysis', sub: 'Population · Roads' },
  { icon: Route, label: 'Safe Route', sub: 'Avoid hazards' },
  { icon: BellRing, label: 'Early Warning', sub: 'Alert dispatch' },
]

export function Pipeline() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {steps.map((s, i) => {
        const Icon = s.icon
        return (
          <div key={s.label} className="relative">
            <div className="flex h-full flex-col gap-2 rounded-md border border-border bg-panel/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-foreground">{s.label}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-primary/50 md:block" style={{ display: (i + 1) % 4 === 0 ? 'none' : undefined }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
