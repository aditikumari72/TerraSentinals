import { cn } from '@/lib/utils'

export function Panel({
  children,
  className,
  title,
  eyebrow,
  action,
  icon: Icon,
  noPadding = false,
}: {
  children: React.ReactNode
  className?: string
  title?: string
  eyebrow?: string
  action?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  noPadding?: boolean
}) {
  return (
    <section className={cn('flex flex-col rounded-md border border-border bg-panel/60 shadow-sm', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
            <div>
              {eyebrow && <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</div>}
              {title && <h3 className="text-[13px] font-semibold uppercase tracking-wider text-foreground">{title}</h3>}
            </div>
          </div>
          {action}
        </header>
      )}
      <div className={cn('flex-1', !noPadding && 'p-4')}>{children}</div>
    </section>
  )
}
