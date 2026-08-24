'use client'

export function SlopeTwin({ saturation = 0.7 }: { saturation?: number }) {
  // water table rises with saturation (0..1)
  const waterY = 190 - saturation * 70

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border border-border bg-[oklch(0.19_0.03_250)]">
      <svg viewBox="0 0 400 260" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.24 0.03 250)" />
            <stop offset="100%" stopColor="oklch(0.2 0.025 250)" />
          </linearGradient>
          <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.42 0.05 80)" />
            <stop offset="100%" stopColor="oklch(0.34 0.045 70)" />
          </linearGradient>
          <linearGradient id="sat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.5 0.12 230 / 55%)" />
            <stop offset="100%" stopColor="oklch(0.42 0.12 235 / 70%)" />
          </linearGradient>
          <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.3 0.02 260)" />
            <stop offset="100%" stopColor="oklch(0.24 0.015 260)" />
          </linearGradient>
        </defs>

        {/* sky */}
        <rect width="400" height="260" fill="url(#sky)" />

        {/* rain streaks */}
        {Array.from({ length: 26 }).map((_, i) => {
          const x = (i * 16 + 8) % 400
          return (
            <line
              key={i}
              x1={x}
              y1={-10}
              x2={x - 8}
              y2={20}
              stroke="oklch(0.7 0.08 230 / 35%)"
              strokeWidth="1"
              style={{ animation: `rain 0.9s linear ${(i % 6) * 0.15}s infinite` }}
            />
          )
        })}

        {/* slope terrain surface path */}
        <path d="M0 90 L120 90 Q 200 92, 240 130 L 340 200 L 400 210 L400 260 L0 260 Z" fill="url(#soil)" />

        {/* saturated zone (rises with saturation) */}
        <path
          d={`M0 ${waterY} L120 ${waterY} Q 200 ${waterY + 2}, 240 ${waterY + 40} L 340 220 L 400 226 L400 260 L0 260 Z`}
          fill="url(#sat)"
        />
        {/* water table line */}
        <path
          d={`M0 ${waterY} L120 ${waterY} Q 200 ${waterY + 2}, 240 ${waterY + 40} L 340 220 L 400 226`}
          fill="none"
          stroke="oklch(0.7 0.14 230)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* bedrock */}
        <path d="M0 226 L 240 240 L 400 246 L400 260 L0 260 Z" fill="url(#rock)" />

        {/* failure / slip surface */}
        <path
          d="M120 92 Q 200 150, 300 195"
          fill="none"
          stroke="var(--risk-critical)"
          strokeWidth="2"
          strokeDasharray="6 4"
          style={{ filter: 'drop-shadow(0 0 4px var(--risk-critical))' }}
        />
        <text x="150" y="130" fill="var(--risk-critical)" fontSize="9" fontFamily="var(--font-mono)">
          POTENTIAL SLIP SURFACE
        </text>

        {/* sensors */}
        {[
          { x: 90, y: 84, id: 'S1', label: 'Rain Gauge' },
          { x: 200, y: 108, id: 'S2', label: 'Piezometer' },
          { x: 280, y: 168, id: 'S3', label: 'Inclinometer' },
          { x: 150, y: 150, id: 'S4', label: 'Soil Probe' },
        ].map((s) => (
          <g key={s.id}>
            <line x1={s.x} y1={s.y} x2={s.x} y2={s.y - 18} stroke="oklch(0.7 0.02 250)" strokeWidth="1" />
            <circle cx={s.x} cy={s.y} r="4" fill="var(--primary)" style={{ filter: 'drop-shadow(0 0 4px var(--primary))' }} />
            <circle cx={s.x} cy={s.y} r="7" fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.5" />
            <text x={s.x + 8} y={s.y - 10} fill="oklch(0.85 0.01 250)" fontSize="7.5" fontFamily="var(--font-mono)">
              {s.id} {s.label}
            </text>
          </g>
        ))}

        {/* slope angle marker */}
        <text x="300" y="150" fill="oklch(0.75 0.02 250)" fontSize="9" fontFamily="var(--font-mono)">
          38° slope
        </text>
      </svg>

      <style jsx>{`
        @keyframes rain {
          from {
            transform: translateY(0);
            opacity: 0.6;
          }
          to {
            transform: translateY(240px);
            opacity: 0;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute right-2 top-2 rounded-sm bg-background/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        Digital Twin · East Sikkim Slope
      </div>
    </div>
  )
}
