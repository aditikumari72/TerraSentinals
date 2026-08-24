import {
  LayoutDashboard,
  Map,
  Layers,
  AlertOctagon,
  Users,
  BellRing,
  Activity,
  Route,
  SlidersHorizontal,
  Box,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Command Center', href: '/command', icon: LayoutDashboard },
  { label: 'Risk Map', href: '/map', icon: Map },
  { label: 'Zones', href: '/zones', icon: Layers },
  { label: 'Incidents', href: '/incidents', icon: AlertOctagon },
  { label: 'Citizen Reports', href: '/reports', icon: Users },
  { label: 'Alerts', href: '/alerts', icon: BellRing },
  { label: 'Impact Analysis', href: '/impact', icon: Activity },
  { label: 'Safe Routing', href: '/routing', icon: Route },
  { label: 'What-If Simulator', href: '/simulator', icon: SlidersHorizontal },
  { label: 'Digital Twin', href: '/twin', icon: Box },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
]

// Priority items for mobile bottom nav
export const mobileNavItems: NavItem[] = [
  navItems[0],
  navItems[1],
  navItems[5],
  navItems[7],
  navItems[8],
]
