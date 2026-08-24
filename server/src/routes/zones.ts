import { Router, Request, Response } from 'express'
import { mockDataService } from '../services/mockDataService.js'
import { riskEngine } from '../services/riskEngine.js'

const router = Router()

/**
 * GET /api/zones
 * Get all risk zones
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const zones = mockDataService.getRiskZones()
    res.json({
      success: true,
      data: zones,
      count: zones.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zones',
    })
  }
})

/**
 * GET /api/zones/:id
 * Get a specific risk zone
 */
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const zone = mockDataService.getRiskZone(req.params.id)
    if (!zone) {
      res.status(404).json({
        success: false,
        error: 'Zone not found',
      })
      return
    }
    res.json({
      success: true,
      data: zone,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zone',
    })
  }
})

/**
 * POST /api/zones/:id/recalculate
 * Recalculate risk for a specific zone
 */
router.post('/:id/recalculate', (req: Request, res: Response): void => {
  try {
    const zone = mockDataService.getRiskZone(req.params.id)
    if (!zone) {
      res.status(404).json({
        success: false,
        error: 'Zone not found',
      })
      return
    }

    // Extract rainfall and other parameters from zone data
    const rainfall = zone.factors.find((f) => f.label === 'Heavy Rainfall')?.value || 0
    const soilMoisture = zone.factors.find((f) => f.label === 'Soil Moisture')?.value || 0
    const slope = zone.factors.find((f) => f.label === 'Steep Slope')?.value || 30
    const historicalRisk = zone.factors.find((f) => f.label === 'Historical Risk')?.value || 0
    const satelliteAnomaly = zone.factors.find((f) => f.label === 'Satellite Anomaly')?.value || 0

    const riskOutput = riskEngine.calculateRisk({
      rainfall,
      soilMoisture,
      slope,
      elevation: 1500,
      historicalRisk,
      satelliteAnomaly,
    })

    res.json({
      success: true,
      data: {
        zoneId: zone.id,
        zoneName: zone.name,
        ...riskOutput,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to recalculate risk',
    })
  }
})

export default router
