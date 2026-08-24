'use client'

import { BarChart3 } from 'lucide-react'
import { Panel } from '@/components/panel'
import {
  RiskByStateChart,
  IncidentTrendChart,
  SimpleBarChart,
  SimpleLineChart,
} from '@/components/charts'
import {
  riskByState,
  incidentTrend,
  populationExposure,
  roadBlockageTrend,
  sensorHealthTrend,
  alertFrequency,
} from '@/lib/data'

export default function AnalyticsPage() {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            Analytics
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">NER Landslide Analytics</h1>
          <p className="mt-0.5 max-w-xl text-[13px] text-muted-foreground">
            Aggregated risk trends, incident statistics, population exposure, and operational metrics across the North Eastern Region.
          </p>
        </div>
        <span className="rounded-sm border border-border bg-panel/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Synthetic prototype
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {/* Row 1 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel icon={BarChart3} eyebrow="Risk Score" title="Risk Index by State">
            <RiskByStateChart data={riskByState} height={260} />
          </Panel>

          <Panel icon={BarChart3} eyebrow="7-Day Trend" title="Incidents vs Resolved">
            <IncidentTrendChart data={incidentTrend} height={260} />
          </Panel>
        </div>

        {/* Row 2 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel icon={BarChart3} eyebrow="Exposure" title="Population at Risk by State">
            <SimpleBarChart
              data={populationExposure}
              dataKey="people"
              height={240}
              color="var(--risk-high)"
              format={(v) => `${(v / 1000).toFixed(0)}K`}
            />
          </Panel>

          <Panel icon={BarChart3} eyebrow="Infrastructure" title="Road Blockages — 7 Day">
            <SimpleBarChart
              data={roadBlockageTrend}
              dataKey="blocked"
              height={240}
              color="var(--risk-critical)"
            />
          </Panel>
        </div>

        {/* Row 3 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel icon={BarChart3} eyebrow="Operations" title="Sensor Network Health (%)">
            <SimpleLineChart
              data={sensorHealthTrend}
              dataKey="health"
              height={200}
              color="var(--risk-low)"
              domain={[88, 100]}
            />
          </Panel>

          <Panel icon={BarChart3} eyebrow="Alerts" title="Alert Frequency — 7 Day">
            <SimpleBarChart
              data={alertFrequency}
              dataKey="alerts"
              height={200}
              color="var(--primary)"
            />
          </Panel>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Prototype analytics using synthetic data. Not for operational use.
        </p>
      </div>
    </div>
  )
}
