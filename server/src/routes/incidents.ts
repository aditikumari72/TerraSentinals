import { Router, Request, Response } from 'express'
import { mockDataService } from '../services/mockDataService.js'

const router = Router()

/**
 * GET /api/incidents
 * Get all incidents
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const incidents = mockDataService.getIncidents()
    res.json({
      success: true,
      data: incidents,
      count: incidents.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch incidents',
    })
  }
})

/**
 * POST /api/incidents
 * Create a new incident report
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { name, latitude, longitude, type, severity, casualties } = req.body

    if (!name || latitude === undefined || longitude === undefined) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, latitude, longitude',
      })
      return
    }

    const incident = mockDataService.createIncident({
      name,
      latitude,
      longitude,
      type: type || 'landslide',
      severity: severity || 'moderate',
      casualties,
    })

    res.status(201).json({
      success: true,
      data: incident,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create incident',
    })
  }
})

export default router
