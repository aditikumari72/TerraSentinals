'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Radar, TrendingUp, BellRing, Activity, Route, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'

export interface ScenarioPhase {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  headline: string
  detail: string
  risk: number
  tone: 'moderate' | 'high' | 'critical'
}

// Default phases if API fails
export const defaultPhases: ScenarioPhase[] = [
  {
    key: 'detect',
    label: 'Detection',
    icon: Radar,
    headline: 'Rainfall spike detected — East Sikkim',
    detail: 'Sensors report 95mm/hr in Gangtok sector. Soil moisture climbing toward saturation.',
    risk: 61,
    tone: 'moderate',
  },
  {
    key: 'rising',
    label: 'Risk Rising',
    icon: TrendingUp,
    headline: 'AI risk index escalating rapidly',
    detail: 'Ensemble model raises East Sikkim to HIGH. Slope instability probability now 71%.',
    risk: 78,
    tone: 'high',
  },
  {
    key: 'alert',
    label: 'Critical Alert',
    icon: BellRing,
    headline: 'CRITICAL landslide risk — 12,400 people exposed',
    detail: 'Risk index hits 91/100. Automated early warning armed for district authorities.',
    risk: 91,
    tone: 'critical',
  },
  {
    key: 'impact',
    label: 'Impact Analysis',
    icon: Activity,
    headline: 'Cascading impact projected',
    detail: 'NH-10 blockage would isolate 3 villages and cut access to Gangtok District Hospital.',
    risk: 91,
    tone: 'critical',
  },
  {
    key: 'route',
    label: 'Safe Routing',
    icon: Route,
    headline: 'Safe evacuation route computed',
    detail: 'Alternative corridor via SH-2 avoids active zones — 18 min added, hazard-free.',
    risk: 88,
    tone: 'critical',
  },
  {
    key: 'warn',
    label: 'Warning Dispatched',
    icon: ShieldCheck,
    headline: 'Early warning dispatched to 12,400 residents',
    detail: 'Multi-channel alert sent. Response teams and hospitals notified. Lead time: 47 minutes.',
    risk: 91,
    tone: 'critical',
  },
]

const PHASE_MS = 4500

export function ScenarioDemo({
  autoStart = false,
  onPhaseChange,
}: {
  autoStart?: boolean
  onPhaseChange?: (phase: ScenarioPhase) => void
}) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(autoStart)
  const [progress, setProgress] = useState(0)
  const [phases, setPhases] = useState<ScenarioPhase[]>(defaultPhases)
  const [loading, setLoading] = useState(false)
  const raf = useRef<number | null>(null)
  const start = useRef<number>(0)

  const phase = phases[index]

  useEffect(() => {
    onPhaseChange?.(phase)
  }, [index, onPhaseChange, phase])

  // Fetch simulation data from backend
  const fetchSimulation = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiClient.simulateDisaster({
        rainfall: 30,
        soilMoisture: 50,
        slope: 35,
        rainfallIncrease: 15,
        steps: 5,
      })

      if (response.success && response.data?.progression) {
        // Convert risk progression to scenario phases
        const simPhases = response.data.progression.map((item: any, idx: number) => {
          const iconMap = [Radar, TrendingUp, BellRing, Activity, Route, ShieldCheck]
          const labels = ['Detection', 'Risk Rising', 'Critical Alert', 'Impact Analysis', 'Safe Routing', 'Warning Dispatched']
          
          const tone =
            item.riskScore <= 30 ? 'moderate' : item.riskScore <= 80 ? 'high' : 'critical'
          
          return {
            key: `step-${idx}`,
            label: labels[idx] || `Step ${idx + 1}`,
            icon: iconMap[idx] || Radar,
            headline: `${item.riskLevel} risk detected — Step ${idx + 1}`,
            detail: `Risk Score: ${item.riskScore.toFixed(1)} | Probability: ${item.probability.toFixed(1)}% | Confidence: ${item.confidence.toFixed(1)}%`,
            risk: Math.round(item.riskScore),
            tone: tone as 'moderate' | 'high' | 'critical',
          }
        })
        
        setPhases(simPhases)
        setIndex(0)
      }
    } catch (error) {
      console.error('Failed to fetch simulation:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load simulation on mount if autoStart
  useEffect(() => {
    if (autoStart && phases === defaultPhases) {
      fetchSimulation()
    }
  }, [autoStart, fetchSimulation, phases])

  const tick = useCallback(
    (now: number) => {
      if (!start.current) start.current = now
      const elapsed = now - start.current
      const p = Math.min(elapsed / PHASE_MS, 1)
      setProgress(p)
      if (p >= 1) {
        start.current = 0
        setProgress(0)
        setIndex((i) => {
          if (i >= phases.length - 1) {
            setPlaying(false)
            return i
          }
          return i + 1
        })
      }
      raf.current = requestAnimationFrame(tick)
    },
    [phases.length],
  )

  useEffect(() => {
    if (playing) {
      raf.current = requestAnimationFrame(tick)
    }
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      start.current = 0
    }
  }, [playing, tick])

  const toggle = async () => {
    if (!playing && index === 0) {
      // Starting the scenario for the first time
      await fetchSimulation()
    }
    if (index >= phases.length - 1 && !playing) {
      setIndex(0)
      setProgress(0)
    }
    setPlaying((p) => !p)
  }

  const reset = () => {
    setPlaying(false)
    setIndex(0)
    setProgress(0)
    start.current = 0
  }

  const toneColor =
    phase.tone === 'critical' ? 'var(--risk-critical)' : phase.tone === 'high' ? 'var(--risk-high)' : 'var(--risk-moderate)'
  const Icon = phase.icon

  return (
    <div
      className="relative overflow-hidden rounded-md border p-4"
      style={{
        borderColor: `color-mix(in oklch, ${toneColor} 45%, transparent)`,
        backgroundColor: `color-mix(in oklch, ${toneColor} 8%, var(--panel))`,
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-md', !loading && 'animate-pulse-ring')}
          style={{ color: toneColor, backgroundColor: `color-mix(in oklch, ${toneColor} 18%, transparent)` }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: toneColor }}>
              {loading ? 'Calculating...' : 'Live Scenario'} · {phase.label}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {String(index + 1).padStart(2, '0')}/{String(phases.length).padStart(2, '0')}
            </span>
          </div>
          <div className="text-balance text-[15px] font-semibold text-foreground">{phase.headline}</div>
          <div className="text-[12px] text-muted-foreground">{phase.detail}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk</div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: toneColor }}>
              {phase.risk}
            </div>
          </div>
          <button
            onClick={toggle}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            aria-label={playing ? 'Pause scenario' : 'Play scenario'}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={reset}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:text-foreground disabled:opacity-50"
            aria-label="Reset scenario"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Phase progress track */}
      <div className="mt-4 flex gap-1.5">
        {phases.map((p, i) => (
          <div key={p.key} className="h-1 flex-1 overflow-hidden rounded-full bg-background/50">
            <div
              className={cn('h-full rounded-full transition-[width] duration-100')}
              style={{
                width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%',
                backgroundColor: toneColor,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
