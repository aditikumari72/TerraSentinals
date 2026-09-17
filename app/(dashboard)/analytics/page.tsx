'use client'

import { BarChart3, RefreshCcw, Wifi, WifiOff } from 'lucide-react'
import { Panel } from '@/components/panel'
import {
  RiskByStateChart,
  IncidentTrendChart,
  SimpleBarChart,
  SimpleLineChart,
} from '@/components/charts'
import {
  riskByState as fallbackRiskByState,
  incidentTrend as fallbackIncidentTrend,
  populationExposure as fallbackPopulationExposure,
  roadBlockageTrend,
  sensorHealthTrend,
  alertFrequency,
} from '@/lib/data'
import { useDashboardAnalytics, useHistoricalTrends } from '@/lib/hooks/useApi'

function LoadingSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-md bg-border/40"
      style={{ height }}
    />
  )
}

export default function AnalyticsPage() {
  const { data: analytics, loading: analyticsLoading, error: analyticsError, refetch } = useDashboardAnalytics()
  const { data: historical, loading: historicalLoading } = useHistoricalTrends()

  // Use live API data when available, fall back to static data
  const riskByState = analytics?.charts?.riskByState ?? fallbackRiskByState
  const incidentTrend = analytics?.charts?.incidentTrend ?? fallbackIncidentTrend
  const populationExposure = analytics?.charts?.populationExposure ?? fallbackPopulationExposure

  const isLive = !!analytics && !analyticsError
  const isLoading = analyticsLoading || historicalLoading

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
        <div className="flex items-center gap-2">
          {/* Live/offline badge */}
          <span className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${isLive ? 'border-[color-mix(in_oklch,var(--risk-low)_30%,transparent)] text-[var(--risk-low)]' : 'border-border text-muted-foreground'}`}>
            {isLive ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
            {isLive ? 'Live data' : 'Fallback data'}
          </span>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary/70 disabled:opacity-50"
          >
            <RefreshCcw className={`h-2.5 w-2.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary KPIs if we have live data */}
      {analytics?.summary && (
        <div className="grid grid-cols-2 gap-3 border-b border-border px-4 py-4 sm:grid-cols-4 sm:px-6">
          {[
            { label: 'Critical Zones', value: analytics.summary.criticalZones, color: 'var(--risk-critical)' },
            { label: 'High Risk Zones', value: analytics.summary.highRiskZones, color: 'var(--risk-high)' },
            { label: 'Avg Risk Score', value: analytics.summary.averageRiskScore, color: 'var(--primary)' },
            { label: 'Active Alerts', value: analytics.summary.unresolvedAlerts, color: 'var(--risk-moderate)' },
          ].map((k) => (
            <div key={k.label} className="text-center">
              <div className="font-mono text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 p-4 sm:p-6">
        {/* Row 1 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel icon={BarChart3} eyebrow="Risk Score" title="Risk Index by State">
            {isLoading ? (
              <LoadingSkeleton height={260} />
            ) : (
              <RiskByStateChart data={riskByState} height={260} />
            )}
          </Panel>

          <Panel icon={BarChart3} eyebrow="7-Day Trend" title="Incidents vs Resolved">
            {isLoading ? (
              <LoadingSkeleton height={260} />
            ) : (
              <IncidentTrendChart data={incidentTrend} height={260} />
            )}
          </Panel>
        </div>

        {/* Row 2 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel icon={BarChart3} eyebrow="Exposure" title="Population at Risk by State">
            {isLoading ? (
              <LoadingSkeleton height={240} />
            ) : (
              <SimpleBarChart
                data={populationExposure}
                dataKey="people"
                height={240}
                color="var(--risk-high)"
                format={(v) => `${(v / 1000).toFixed(0)}K`}
              />
            )}
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

        {/* Row 3 — Historical from API */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel icon={BarChart3} eyebrow="Historical" title="Risk Score Trend (9 Days)">
            {historicalLoading ? (
              <LoadingSkeleton height={200} />
            ) : (
              <SimpleLineChart
                data={historical?.riskTrends ?? sensorHealthTrend}
                dataKey={historical?.riskTrends ? 'score' : 'health'}
                height={200}
                color="var(--risk-critical)"
                domain={[0, 100]}
              />
            )}
          </Panel>

          <Panel icon={BarChart3} eyebrow="Historical" title="Rainfall Trend (9 Days)">
            {historicalLoading ? (
              <LoadingSkeleton height={200} />
            ) : (
              <SimpleLineChart
                data={historical?.rainfallTrends ?? alertFrequency}
                dataKey={historical?.rainfallTrends ? 'rainfall' : 'alerts'}
                height={200}
                color="var(--primary)"
                domain={[0, 100]}
              />
            )}
          </Panel>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          {isLive
            ? 'Live data from NER Landslide Intelligence API · Auto-refreshable'
            : 'Showing fallback synthetic data — API server may be offline'}
        </p>
      </div>
    </div>
  )
}
