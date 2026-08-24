import Link from 'next/link'
import {
  Mountain,
  ArrowRight,
  PlayCircle,
  AlertTriangle,
  Brain,
  Map as MapIcon,
  Users,
  SlidersHorizontal,
  Activity,
  Route,
  BellRing,
  ShieldCheck,
} from 'lucide-react'
import { RiskMap, MapLegend } from '@/components/map/risk-map'
import { Pipeline } from '@/components/landing/pipeline'
import { StatusDot } from '@/components/primitives'

const capabilities = [
  { icon: Brain, title: 'AI Risk Engine', body: 'An ensemble model fuses rainfall, soil moisture, slope and historical signals into a single 0–100 landslide risk score with confidence bands.' },
  { icon: MapIcon, title: 'GIS Intelligence', body: 'Live geospatial layers for risk zones, sensors, roads, hospitals, villages and satellite anomalies across all eight NER states.' },
  { icon: Users, title: 'Citizen Intelligence', body: 'Field reports and photos are AI-triaged, scored for confidence and clustered to detect emerging hazards before they escalate.' },
  { icon: SlidersHorizontal, title: 'What-If Simulation', body: 'Model how rainfall, soil saturation and slope changes shift risk in real time — and preview the downstream human impact.' },
  { icon: Activity, title: 'Impact Analysis', body: 'Trace disaster propagation from slope failure to road blockage, village isolation and delayed hospital access.' },
  { icon: Route, title: 'Safe Routing', body: 'Compute emergency routes that avoid active landslide zones and blocked roads for ambulances, rescue and relief convoys.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="glass sticky top-0 z-40 border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
              <Mountain className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold tracking-wide">NER LANDSLIDE INTELLIGENCE</div>
              <div className="hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:block">Early Warning &amp; Risk Monitoring</div>
            </div>
          </div>
          <Link
            href="/command"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground shadow-[0_0_20px_-4px_var(--primary)] transition hover:opacity-90"
          >
            Open Command Center <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/60 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <StatusDot color="var(--risk-critical)" /> AI Early Warning · North Eastern Region of India
            </div>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Predict disasters
              <br />
              <span className="text-primary">before</span> they become
              <br />
              emergencies.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
              AI-powered landslide prediction, GIS intelligence and emergency decision support for India&apos;s North Eastern
              Region — built for district authorities and disaster operations centers.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/command"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-4px_var(--primary)] transition hover:opacity-90"
              >
                Open Command Center <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/command?demo=1"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-panel/60 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                <PlayCircle className="h-4.5 w-4.5 text-primary" /> Run Live Demo
              </Link>
            </div>
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-4">
              {[
                { k: '8', v: 'NER States' },
                { k: '42,680', v: 'People Monitored' },
                { k: '<60s', v: 'Warning Lead' },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl font-bold tabular-nums text-foreground">{s.k}</dt>
                  <dd className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Live map visual */}
          <div className="relative">
            <div className="rounded-lg border border-border bg-panel/60 p-3 shadow-2xl">
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="relative flex items-center"><StatusDot color="var(--risk-critical)" /></span> Live Landslide Risk Map
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">DEMO · SYNTHETIC</span>
              </div>
              <div className="h-[340px] sm:h-[400px]">
                <RiskMap compact />
              </div>
              <div className="mt-3 px-1">
                <MapLegend />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-risk-critical/25 bg-[color-mix(in_oklch,var(--risk-critical)_6%,transparent)] p-6">
            <div className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-risk-critical">
              <AlertTriangle className="h-4 w-4" /> The Problem
            </div>
            <p className="text-pretty text-[15px] leading-relaxed text-foreground/90">
              The North Eastern Region faces some of the highest landslide density in India. Monsoon rainfall, fragile slopes and
              remote terrain mean warnings arrive too late, roads vanish without notice, and villages lose hospital access during the
              exact hours help is needed most.
            </p>
          </div>
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-6">
            <div className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" /> The Solution
            </div>
            <p className="text-pretty text-[15px] leading-relaxed text-foreground/90">
              A unified command center that continuously scores landslide risk, explains why it is rising, simulates worsening
              scenarios, measures human impact, finds safe evacuation routes and dispatches early warnings — all from one operational
              picture.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-panel/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">How It Works</div>
            <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">From raw signals to safe decisions</h2>
          </div>
          <Pipeline />
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">Capabilities</div>
          <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">An intelligence stack for disaster operations</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className="rounded-lg border border-border bg-panel/60 p-5 transition hover:border-primary/40">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-center gap-5 rounded-lg border border-primary/25 bg-primary/5 px-6 py-12 text-center">
            <BellRing className="h-8 w-8 text-primary" />
            <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Predict → Explain → Simulate → Assess → Route → Warn
            </h2>
            <p className="max-w-xl text-[14px] text-muted-foreground">
              Step into the operations center and run a full 2-minute disaster scenario from first rainfall spike to dispatched
              critical alert.
            </p>
            <Link
              href="/command?demo=1"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-4px_var(--primary)] transition hover:opacity-90"
            >
              <PlayCircle className="h-4.5 w-4.5" /> Run Disaster Scenario
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-[11px] text-muted-foreground sm:flex-row sm:px-6">
          <span>NER Landslide Intelligence — AI-Based Early Warning &amp; Risk Monitoring System</span>
          <span className="font-mono">PROTOTYPE · SYNTHETIC DATA · NOT FOR OPERATIONAL USE</span>
        </div>
      </footer>
    </div>
  )
}
