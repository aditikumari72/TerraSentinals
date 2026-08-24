'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mountain, Settings, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from './nav'

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
          <Mountain className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-wide text-sidebar-foreground">NER LANDSLIDE</div>
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Intelligence</div>
        </div>
      </div>

      <nav className="scroll-thin flex-1 overflow-y-auto px-2 py-3">
        <div className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Operations</div>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                  <span className="truncate">{item.label}</span>
                  {active && <span className="ml-auto h-4 w-1 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <ul className="flex flex-col gap-0.5">
          <li>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground">
              <Settings className="h-4 w-4" /> Settings
            </button>
          </li>
          <li>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground">
              <User className="h-4 w-4" /> Profile
            </button>
          </li>
          <li>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </li>
        </ul>
        <div className="mt-2 flex items-center gap-2.5 rounded-md bg-sidebar-accent/40 px-2.5 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary ring-1 ring-primary/30">
            RD
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[12px] font-medium text-sidebar-foreground">R. Dorjee</div>
            <div className="truncate text-[10px] text-muted-foreground">District Emergency Officer</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
