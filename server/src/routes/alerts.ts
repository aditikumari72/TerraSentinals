import { Router, Request, Response } from 'express'
import { mockDataService } from '../services/mockDataService.js'

const router = Router()

/**
 * GET /api/alerts
 * Get all alerts (optionally filter ?resolved=true|false)
 */
router.get('/', (req: Request, res: Response) => {
  try {
    let alerts = mockDataService.getAlerts()

    if (req.query.resolved === 'true') {
      alerts = alerts.filter((a) => a.resolved)
    } else if (req.query.resolved === 'false') {
      alerts = alerts.filter((a) => !a.resolved)
    }

    res.json({ success: true, data: alerts, count: alerts.length })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch alerts' })
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

    const alert = mockDataService.createAlert({ zoneId, level, message })
    res.status(201).json({ success: true, data: alert })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create alert' })
  }
})

/**
 * PATCH /api/alerts/:id/resolve
 * Mark an alert as resolved
 */
router.patch('/:id/resolve', (req: Request, res: Response): void => {
  try {
    const alert = mockDataService.resolveAlert(req.params.id)
    if (!alert) {
      res.status(404).json({ success: false, error: 'Alert not found' })
      return
    }
    res.json({ success: true, data: alert })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to resolve alert' })
  }
})

export default router
