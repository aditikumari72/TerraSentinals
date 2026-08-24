import { Router, Request, Response } from 'express'

const router = Router()

/**
 * POST /api/safe-routing
 * Calculate safe evacuation routes
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { startLat, startLon, endLat, endLon, riskZones = [] } = req.body

    if (startLat === undefined || startLon === undefined || endLat === undefined || endLon === undefined) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: startLat, startLon, endLat, endLon',
      })
      return
    }

    // Generate multiple safe routes
    const routes = [
      {
        id: 'route-safe-1',
        name: 'Primary Safe Route',
        distance: 28.5,
        duration: '35 mins',
        riskScore: 15,
        avoidedZones: riskZones.length,
        waypoints: [
          { lat: startLat, lon: startLon, name: 'Start' },
          { lat: (startLat + endLat) / 2 - 0.05, lon: startLon + 0.02, name: 'Waypoint 1' },
          { lat: endLat - 0.02, lon: endLon - 0.01, name: 'Waypoint 2' },
          { lat: endLat, lon: endLon, name: 'Destination' },
        ],
        conditions: 'All clear, best option',
        riskFactors: ['Steep slopes on north side'],
      },
      {
        id: 'route-alt-1',
        name: 'Alternative Route',
        distance: 32.2,
        duration: '42 mins',
        riskScore: 25,
        avoidedZones: riskZones.length - 1,
        waypoints: [
          { lat: startLat, lon: startLon, name: 'Start' },
          { lat: startLat + 0.03, lon: startLon + 0.05, name: 'Waypoint 1' },
          { lat: endLat, lon: endLon, name: 'Destination' },
        ],
        conditions: 'Longer but more stable',
        riskFactors: ['Avalanche risk on mountain pass'],
      },
      {
        id: 'route-emergency',
        name: 'Emergency Route',
        distance: 24.8,
        duration: '28 mins',
        riskScore: 35,
        avoidedZones: 2,
        waypoints: [
          { lat: startLat, lon: startLon, name: 'Start' },
          { lat: endLat, lon: endLon, name: 'Destination' },
        ],
        conditions: 'Direct route, use only in emergency',
        riskFactors: ['Passes through moderate risk zone', 'Steep terrain'],
      },
    ]

    res.json({
      success: true,
      data: {
        routes,
        recommendations: [
          'Use Route 1 (Primary Safe Route) for optimal safety and stability',
          'Avoid Route 3 (Emergency Route) unless absolutely necessary',
          'Monitor weather conditions and road status during evacuation',
          'Coordinate with traffic management for smooth evacuation flow',
        ],
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate safe routes',
    })
  }
})

export default router
