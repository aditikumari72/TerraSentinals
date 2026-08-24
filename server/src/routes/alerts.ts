import { Router, Request, Response } from 'express'
import { mockDataService } from '../services/mockDataService.js'

const router = Router()

/**
 * GET /api/alerts
 * Get all active alerts
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const alerts = mockDataService.getAlerts()
    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts',
    })
  }
})

/**
 * POST /api/alerts
 * Create a new alert
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { zoneId, level, message } = req.body

    if (!zoneId || !level || !message) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: zoneId, level, message',
      })
      return
    }

    const alert = mockDataService.createAlert({
      zoneId,
      level,
      message,
    })

    res.status(201).json({
      success: true,
      data: alert,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create alert',
    })
  }
})

export default router
