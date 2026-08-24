export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'

export function riskLevel(score: number): RiskLevel {
  if (score >= 81) return 'CRITICAL'
  if (score >= 61) return 'HIGH'
  if (score >= 31) return 'MODERATE'
  return 'LOW'
}

/** CSS variable color for a risk level. */
export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'var(--risk-low)'
    case 'MODERATE':
      return 'var(--risk-moderate)'
    case 'HIGH':
      return 'var(--risk-high)'
    case 'CRITICAL':
      return 'var(--risk-critical)'
  }
}

export function riskColorFromScore(score: number): string {
  return riskColor(riskLevel(score))
}

/** Tailwind text utility for a risk level. */
export function riskTextClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'text-risk-low'
    case 'MODERATE':
      return 'text-risk-moderate'
    case 'HIGH':
      return 'text-risk-high'
    case 'CRITICAL':
      return 'text-risk-critical'
  }
}
