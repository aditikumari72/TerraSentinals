'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { navItems, mobileNavItems } from './nav'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-sidebar-border bg-sidebar p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[13px] font-semibold uppercase tracking-wider">Navigation</span>
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium',
                        active ? 'bg-sidebar-accent text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      <Icon className={cn('h-4 w-4', active && 'text-primary')} /> {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="scroll-thin flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="glass fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-border lg:hidden">
          {mobileNavItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 text-[10px] font-medium',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate px-1">{item.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h1 className="text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
