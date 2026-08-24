'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CloudRain, Droplets, Thermometer, Wind, TrendingUp, Radio, AlertOctagon } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shell'
import { Panel } from '@/components/panel'
import { KpiCards } from '@/components/command/kpi-cards'
import { ScenarioDemo, type ScenarioPhase } from '@/components/command/scenario-demo'
import { IncidentFeed } from '@/components/command/incident-feed'
import { RiskMap, MapLegend } from '@/components/map/risk-map'
import { ZoneInspector } from '@/components/zone-inspector'
import { RiskTrendChart, RainfallRiskChart } from '@/components/charts'
import { kpis, riskTrend, rainfallVsRisk, riskZones, weatherCards, type RiskZone } from '@/lib/data'

const weatherIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  'Rain 1H': CloudRain,
  'Rain 6H': CloudRain,
  'Rain 24H': CloudRain,
  'Rain 72H': CloudRain,
  'Soil Moisture': Droplets,
  Temperature: Thermometer,
  Humidity: Droplets,
  Wind: Wind,
}
const toneColor: Record<string, string> = {
  ok: 'var(--risk-low)',
  high: 'var(--risk-high)',
  critical: 'var(--risk-critical)',
}

function CommandContent() {
  const params = useSearchParams()
  const demo = params.get('demo') === '1'
  const [selected, setSelected] = useState<RiskZone>(riskZones[0])
  const [scenarioRisk, setScenarioRisk] = useState<number | null>(null)

  const liveTrend = useMemo(() => {
    if (scenarioRisk == null) return riskTrend
    return [...riskTrend.slice(1), { time: 'NOW', risk: scenarioRisk }]
  }, [scenarioRisk])

  const onPhase = (p: ScenarioPhase) => setScenarioRisk(p.risk)

  return (
    <div>
      <PageHeader
        title="Command Center"
        subtitle="Real-time landslide risk operations — North Eastern Region"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel/60 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground">
            <Radio className="h-3.5 w-3.5 text-risk-low" /> 5 sensors online
          </span>
        }
      />

      <div className="space-y-4 p-4 sm:p-6">
        {/* Scenario */}
        <ScenarioDemo autoStart={demo} onPhaseChange={onPhase} />

        {/* KPIs */}
        <KpiCards items={kpis} />

        {/* Main grid */}
        <div className="grid gap-4 xl:grid-cols-3">
          {/* Map */}
          <Panel
            className="xl:col-span-2"
            title="Live Risk Map"
            eyebrow="GIS Intelligence"
            icon={AlertOctagon}
            noPadding
            action={<span className="font-mono text-[10px] text-muted-foreground">SYNTHETIC</span>}
          >
            <div className="p-3">
              <div className="h-[380px] sm:h-[440px]">
                <RiskMap selectedId={selected.id} onSelect={setSelected} />
              </div>
              <div className="mt-3">
                <MapLegend />
              </div>
            </div>
          </Panel>

          {/* Inspector */}
          <div className="rounded-md border border-border bg-panel/60">
            <ZoneInspector zone={selected} />
          </div>
        </div>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Risk Index Trend" eyebrow="Last 6 hours" icon={TrendingUp}>
            <RiskTrendChart data={liveTrend} />
          </Panel>
          <Panel title="Rainfall vs Risk" eyebrow="Correlation" icon={CloudRain}>
            <RainfallRiskChart data={rainfallVsRisk} />
          </Panel>
        </div>

        {/* Weather + incidents */}
        <div className="grid gap-4 xl:grid-cols-3">
          <Panel className="xl:col-span-2" title="Environmental Conditions" eyebrow="Gangtok Sector" icon={CloudRain}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {weatherCards.map((w) => {
                const Icon = weatherIcon[w.label] ?? CloudRain
                const color = toneColor[w.tone]
                return (
                  <div key={w.label} className="rounded-md border border-border bg-background/40 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{w.label}</span>
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                    <div className="mt-1.5 text-lg font-bold tabular-nums text-foreground">{w.value}</div>
                    <div className="text-[11px] font-medium" style={{ color }}>
                      {w.sub}
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title="Live Incident Feed" eyebrow="Field Reports" icon={AlertOctagon} noPadding>
            <div className="scroll-thin max-h-[320px] overflow-y-auto px-3 pb-2">
              <IncidentFeed limit={6} />
            </div>
          </Panel>
        </div>

        <p className="text-[10px] leading-relaxed text-muted-foreground/70">
          Prototype command center using synthetic data for demonstration. Not for operational emergency use.
        </p>
      </div>
    </div>
  )
}

export default function CommandPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading command center…</div>}>
      <CommandContent />
    </Suspense>
  )
}
