'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Play, Pause, RotateCcw, Gauge, Radio, TriangleAlert } from 'lucide-react'
import { Panel } from '@/components/panel'
import { SlopeTwin } from '@/components/twin/slope-twin'
import { RiskBadge, StatusDot } from '@/components/primitives'
import { SimpleLineChart } from '@/components/charts'
import { riskColor } from '@/lib/risk'
import { sensors } from '@/lib/data'

// Factor of Safety: high saturation -> lower stability. Below 1.0 = failure.
function factorOfSafety(saturation: number) {
  return +(1.85 - saturation * 1.15).toFixed(2)
}

function fosLevel(fos: number) {
  if (fos < 1.0) return 'CRITICAL'
  if (fos < 1.2) return 'HIGH'
  if (fos < 1.4) return 'MODERATE'
  return 'LOW'
}

const twinSensors = [
  { id: 'S1', label: 'Rain Gauge', unit: 'mm/hr', base: 8, mult: 42 },
  { id: 'S2', label: 'Piezometer', unit: 'kPa', base: 12, mult: 68 },
  { id: 'S3', label: 'Inclinometer', unit: 'mm', base: 2, mult: 34 },
  { id: 'S4', label: 'Soil Probe', unit: '% VWC', base: 28, mult: 55 },
]

export default function DigitalTwinPage() {
  const [saturation, setSaturation] = useState(0.7)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setSaturation((s) => {
        const next = s + dt * 0.12
        if (next >= 1) {
          setPlaying(false)
          return 1
        }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing])

  const fos = factorOfSafety(saturation)
  const level = fosLevel(fos)
  const color = riskColor(level)

  // projected FoS decline over next 12 hours from current saturation trajectory
  const projection = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const hour = i * 2
      const projSat = Math.min(1, saturation + i * 0.04)
      return { time: `+${hour}h`, fos: factorOfSafety(projSat) }
    })
  }, [saturation])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <Box className="h-3.5 w-3.5 text-primary" /> Digital Twin
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">East Sikkim Slope Model</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Physics-informed slope stability simulation. Adjust rainfall saturation to watch the water table rise and the
            factor of safety degrade toward failure.
          </p>
        </div>
        <span className="rounded-sm border border-border bg-panel/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Synthetic prototype data
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Twin visualization */}
        <Panel
          className="lg:col-span-2"
          icon={Box}
          eyebrow="Cross-Section"
          title="Slope Stability Model"
          noPadding
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-secondary/70"
              >
                {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {playing ? 'Pause' : 'Simulate'}
              </button>
              <button
                onClick={() => {
                  setPlaying(false)
                  setSaturation(0.7)
                }}
                className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-secondary/70"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>
          }
        >
          <div className="p-4">
            <div className="h-[340px]">
              <SlopeTwin saturation={saturation} />
            </div>

            {/* Saturation control */}
            <div className="mt-4 rounded-md border border-border bg-background/40 p-4">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="sat" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Soil Saturation
                </label>
                <span className="font-mono text-sm font-semibold text-foreground">{Math.round(saturation * 100)}%</span>
              </div>
              <input
                id="sat"
                type="range"
                min={0}
                max={100}
                value={Math.round(saturation * 100)}
                onChange={(e) => {
                  setPlaying(false)
                  setSaturation(Number(e.target.value) / 100)
                }}
                className="w-full accent-[var(--primary)]"
                style={{ accentColor: color }}
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Dry</span>
                <span>Saturated</span>
                <span>Failure</span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Stability readout */}
        <div className="space-y-4">
          <Panel icon={Gauge} eyebrow="Stability" title="Factor of Safety">
            <div className="flex flex-col items-center py-2">
              <div
                className="flex h-32 w-32 items-center justify-center rounded-full border-4"
                style={{
                  borderColor: color,
                  boxShadow: `0 0 24px color-mix(in oklch, ${color} 40%, transparent)`,
                  background: `radial-gradient(circle, color-mix(in oklch, ${color} 12%, transparent), transparent 70%)`,
                }}
              >
                <div className="text-center">
                  <div className="font-mono text-3xl font-bold" style={{ color }}>
                    {fos.toFixed(2)}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">FoS</div>
                </div>
              </div>
              <div className="mt-4">
                <RiskBadge level={level as any} />
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {fos < 1.0
                  ? 'Slope failure threshold breached. Evacuation protocol advised.'
                  : fos < 1.2
                    ? 'Marginal stability. Continuous monitoring active.'
                    : 'Slope within stable operating envelope.'}
              </p>
            </div>
          </Panel>

          <Panel icon={TriangleAlert} eyebrow="Projection" title="12H FoS Forecast" noPadding>
            <div className="p-2">
              <SimpleLineChart data={projection} dataKey="fos" height={150} color={color} domain={[0.6, 1.9]} />
            </div>
          </Panel>
        </div>
      </div>

      {/* Sensor telemetry */}
      <Panel icon={Radio} eyebrow="Live Feed" title="Sensor Telemetry">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {twinSensors.map((s) => {
            const reading = (s.base + s.mult * saturation).toFixed(1)
            const online = sensors.find((x) => x.type === s.label)?.status ?? 'online'
            const dotColor =
              online === 'online' ? 'var(--risk-low)' : online === 'degraded' ? 'var(--risk-high)' : 'var(--muted-foreground)'
            return (
              <div key={s.id} className="rounded-md border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">{s.id}</span>
                  <StatusDot color={dotColor} pulse={online === 'online'} />
                </div>
                <div className="mt-2 font-mono text-xl font-semibold text-foreground">
                  {reading}
                  <span className="ml-1 text-[11px] font-normal text-muted-foreground">{s.unit}</span>
                </div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
