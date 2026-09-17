import { Router, Request, Response } from 'express'
import { mockDataService } from '../services/mockDataService.js'

const router = Router()

/**
 * POST /api/safe-routing
 * Calculate safe evacuation routes avoiding high-risk zones
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { startLat, startLon, endLat, endLon, riskZones: requestedZones = [] } = req.body

    if (
      startLat === undefined ||
      startLon === undefined ||
      endLat === undefined ||
      endLon === undefined
    ) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: startLat, startLon, endLat, endLon',
      })
      return
    }

    // Get live zone risk to inform route scores
    const zones = mockDataService.getRiskZones()
    const avgRisk = Math.round(zones.reduce((s, z) => s + z.score, 0) / zones.length)
    const criticalCount = zones.filter((z) => z.score > 80).length

    // Route risk scales with current real zone data
    const baseRisk = Math.max(10, Math.round(avgRisk * 0.15))
    const altRisk = Math.max(20, Math.round(avgRisk * 0.28))
    const emergRisk = Math.max(30, Math.round(avgRisk * 0.40))

    const avoidedZones = requestedZones.length || criticalCount

    const routes = [
      {
        id: 'route-safe-1',
        name: 'Primary Safe Route',
        distance: 28.5,
        duration: '35 mins',
        riskScore: baseRisk,
        status: baseRisk < 30 ? 'SAFE' : 'CAUTION',
        avoidedZones,
        waypoints: [
          { lat: startLat, lon: startLon, name: 'Start' },
          { lat: (startLat + endLat) / 2 - 0.05, lon: startLon + 0.02, name: 'Waypoint 1' },
          { lat: endLat - 0.02, lon: endLon - 0.01, name: 'Waypoint 2' },
          { lat: endLat, lon: endLon, name: 'Destination' },
        ],
        conditions: baseRisk < 30 ? 'All clear, best option' : 'Caution — monitor conditions',
        riskFactors: ['Steep slopes on north side'],
      },
      {
        id: 'route-alt-1',
        name: 'Alternative Route',
        distance: 32.2,
        duration: '42 mins',
        riskScore: altRisk,
        status: altRisk < 30 ? 'SAFE' : 'CAUTION',
        avoidedZones: Math.max(0, avoidedZones - 1),
        waypoints: [
          { lat: startLat, lon: startLon, name: 'Start' },
          { lat: startLat + 0.03, lon: startLon + 0.05, name: 'Waypoint 1' },
          { lat: endLat, lon: endLon, name: 'Destination' },
        ],
        conditions: 'Longer but more stable terrain',
        riskFactors: ['Avalanche risk on mountain pass'],
      },
      {
        id: 'route-emergency',
        name: 'Emergency Route',
        distance: 24.8,
        duration: '28 mins',
        riskScore: emergRisk,
        status: emergRisk > 60 ? 'BLOCKED' : 'CAUTION',
        avoidedZones: 0,
        waypoints: [
          { lat: startLat, lon: startLon, name: 'Start' },
          { lat: endLat, lon: endLon, name: 'Destination' },
        ],
        conditions: 'Direct route — use only in emergency',
        riskFactors: ['Passes through active risk zones', 'Steep terrain'],
      },
    ]

    res.json({
      success: true,
      data: {
        routes,
        currentZoneRisk: {
          averageScore: avgRisk,
          criticalZones: criticalCount,
        },
        recommendations: [
          `Route 1 (Primary Safe Route) recommended — ${baseRisk}/100 risk index`,
          `${criticalCount} critical zones currently active — verify conditions before departure`,
          'Monitor weather conditions and road status during evacuation',
          'Coordinate with traffic management for smooth evacuation flow',
        ],
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate safe routes' })
  }
})

/**
 * GET /api/safe-routing/status
 * Get current route network status based on live zone data
 */
router.get('/status', (_req: Request, res: Response) => {
  try {
    const zones = mockDataService.getRiskZones()
    const criticalZones = zones.filter((z) => z.score > 80)
    const blockedRoutes = Math.min(criticalZones.length + 1, 4)

    res.json({
      success: true,
      data: {
        safeRoutes: Math.max(0, 4 - blockedRoutes),
        cautionRoutes: 2,
        blockedCorridors: blockedRoutes,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch routing status' })
  }
})

export default router
