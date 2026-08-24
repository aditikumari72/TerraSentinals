'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CloudRain, Bell, Menu, Mountain, Clock } from 'lucide-react'
import { StatusDot } from '@/components/primitives'

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const [time, setTime] = useState<string>('')
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' IST',
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="glass sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
      <button
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/command" className="flex items-center gap-2 lg:hidden">
        <Mountain className="h-5 w-5 text-primary" />
      </Link>

      <div className="hidden items-center gap-3 sm:flex">
        <h1 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-foreground">NER Landslide Intelligence</h1>
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-risk-low/40 bg-[color-mix(in_oklch,var(--risk-low)_12%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-risk-low">
          <StatusDot color="var(--risk-low)" /> System Live
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-1.5 rounded-md border border-border bg-panel/50 px-2.5 py-1.5 text-[11px] font-mono text-muted-foreground md:flex">
          <Clock className="h-3.5 w-3.5" />
          <span className="tabular-nums text-foreground">{time || '—'}</span>
        </div>

        <div className="hidden items-center gap-2 rounded-md border border-border bg-panel/50 px-2.5 py-1.5 sm:flex">
          <CloudRain className="h-4 w-4 text-primary" />
          <div className="leading-none">
            <div className="text-[12px] font-semibold text-foreground">19°C · Heavy Rain</div>
            <div className="text-[10px] text-muted-foreground">Gangtok · 96% RH</div>
          </div>
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground" aria-label="Notifications">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">8</span>
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary ring-1 ring-primary/30">
          RD
        </div>
      </div>
    </header>
  )
}
