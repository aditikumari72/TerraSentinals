'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, RefreshCcw, TriangleAlert, CloudRain, Droplets, Mountain } from 'lucide-react'
import { Panel } from '@/components/panel'
import { SimpleLineChart } from '@/components/charts'
import { RiskBadge } from '@/components/primitives'
import { riskColor, riskLevel } from '@/lib/risk'

// --- Risk model (synthetic) ---
function computeRisk(rainfall: number, soilMoisture: number, slope: number): number {
  const r = (rainfall / 150) * 35
  const s = (soilMoisture / 100) * 30
  const sl = (slope / 60) * 25
  const interaction = rainfall > 80 && soilMoisture > 70 ? 10 : 0
  return Math.min(100, Math.round(r + s + sl + interaction))
}

const DEFAULTS = { rainfall: 30, soilMoisture: 50, slope: 35 }

interface SliderProps {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  value: number
  min: number
  max: number
  unit: string
  onChange: (v: number) => void
  color?: string
}

function FactorSlider({ id, label, icon: Icon, value, min, max, unit, onChange, color }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="rounded-md border border-border bg-background/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </label>
        <span className="font-mono text-sm font-bold text-foreground">
          {value}
          <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: color ?? 'var(--primary)' }}
      />
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, backgroundColor: color ?? 'var(--primary)' }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

export default function SimulatorPage() {
  const [rainfall, setRainfall] = useState(DEFAULTS.rainfall)
  const [soilMoisture, setSoilMoisture] = useState(DEFAULTS.soilMoisture)
  const [slope, setSlope] = useState(DEFAULTS.slope)

  const risk = useMemo(() => computeRisk(rainfall, soilMoisture, slope), [rainfall, soilMoisture, slope])
  const level = riskLevel(risk)
  const color = riskColor(level)

  // Build a mini sensitivity curve — vary rainfall from current-40 to current+40
  const sensitivityCurve = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const r = Math.max(0, Math.min(150, rainfall - 40 + i * 10))
      return { rain: `${r}mm`, risk: computeRisk(r, soilMoisture, slope) }
    })
  }, [rainfall, soilMoisture, slope])

  const factors = [
    { label: 'Rainfall Contribution', pct: Math.round((rainfall / 150) * 35) },
    { label: 'Soil Moisture Contribution', pct: Math.round((soilMoisture / 100) * 30) },
    { label: 'Slope Contribution', pct: Math.round((slope / 60) * 25) },
    { label: 'Compounding Effect', pct: rainfall > 80 && soilMoisture > 70 ? 10 : 0 },
  ]

  const handleReset = () => {
    setRainfall(DEFAULTS.rainfall)
    setSoilMoisture(DEFAULTS.soilMoisture)
    setSlope(DEFAULTS.slope)
  }

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            What-If Simulator
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Landslide Risk Simulator</h1>
          <p className="mt-0.5 max-w-xl text-[13px] text-muted-foreground">
            Adjust environmental parameters and observe how they compound into landslide risk. Useful for pre-event scenario planning.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="simulator-reset-btn"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-secondary/70"
          >
            <RefreshCcw className="h-3 w-3" /> Reset
          </button>
          <span className="rounded-sm border border-border bg-panel/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Synthetic prototype
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Controls */}
          <div className="space-y-4 lg:col-span-1">
            <Panel icon={SlidersHorizontal} eyebrow="Parameters" title="Environmental Inputs">
              <div className="space-y-4">
                <FactorSlider
                  id="sim-rainfall"
                  label="Rainfall Intensity"
                  icon={CloudRain}
                  value={rainfall}
                  min={0}
                  max={150}
                  unit=" mm/hr"
                  onChange={setRainfall}
                  color="var(--primary)"
                />
                <FactorSlider
                  id="sim-soil"
                  label="Soil Moisture"
                  icon={Droplets}
                  value={soilMoisture}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={setSoilMoisture}
                  color="var(--risk-high)"
                />
                <FactorSlider
                  id="sim-slope"
                  label="Slope Angle"
                  icon={Mountain}
                  value={slope}
                  min={0}
                  max={60}
                  unit="°"
                  onChange={setSlope}
                  color="var(--risk-moderate)"
                />
              </div>
            </Panel>
          </div>

          {/* Risk Gauge + Breakdown */}
          <div className="space-y-4 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Radial gauge */}
              <Panel icon={TriangleAlert} eyebrow="Output" title="Computed Risk Score">
                <div className="flex flex-col items-center py-4">
                  <div
                    id="sim-risk-gauge"
                    className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 transition-all duration-500"
                    style={{
                      borderColor: color,
                      boxShadow: `0 0 32px color-mix(in oklch, ${color} 35%, transparent), 0 0 8px color-mix(in oklch, ${color} 20%, transparent)`,
                      background: `radial-gradient(circle, color-mix(in oklch, ${color} 14%, transparent), transparent 70%)`,
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="font-mono text-5xl font-bold leading-none transition-all duration-300"
                        style={{ color }}
                      >
                        {risk}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <RiskBadge level={level as any} />
                  </div>
                  <p className="mt-3 max-w-[18ch] text-center text-[12px] text-muted-foreground">
                    {risk >= 81
                      ? 'Immediate evacuation advisory recommended.'
                      : risk >= 61
                        ? 'Active monitoring and pre-positioning required.'
                        : risk >= 31
                          ? 'Elevated risk — increase sensor polling frequency.'
                          : 'Conditions within acceptable operational envelope.'}
                  </p>
                </div>
              </Panel>

              {/* Factor breakdown */}
              <Panel icon={TriangleAlert} eyebrow="Breakdown" title="Risk Factor Weights">
                <div className="space-y-3 py-1">
                  {factors.map((f) => (
                    <div key={f.label}>
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{f.label}</span>
                        <span className="font-mono font-semibold text-foreground">+{f.pct}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (f.pct / 35) * 100)}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Risk Index</span>
                    <span className="font-mono text-lg font-bold" style={{ color }}>{risk}/100</span>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Sensitivity chart */}
            <Panel icon={CloudRain} eyebrow="Sensitivity" title="Risk vs Rainfall Intensity (at current soil & slope)">
              <div className="h-[180px]">
                <SimpleLineChart data={sensitivityCurve} dataKey="risk" height={180} color={color} domain={[0, 100]} />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                How risk changes as rainfall varies ±40 mm/hr around your current input, holding other parameters fixed.
              </p>
            </Panel>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Prototype simulator using a synthetic risk model. Not for operational emergency decision-making.
        </p>
      </div>
    </div>
  )
}
