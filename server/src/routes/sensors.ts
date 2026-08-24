import { Router, Request, Response } from 'express'
import { mockDataService } from '../services/mockDataService.js'

const router = Router()

/**
 * GET /api/sensors
 * Get all active sensors
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const sensors = mockDataService.getSensors()
    res.json({
      success: true,
      data: sensors,
      count: sensors.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sensors',
    })
  }
})

/**
 * GET /api/sensors/:id
 * Get specific sensor details
 */
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const sensor = mockDataService.getSensor(req.params.id)
    if (!sensor) {
      res.status(404).json({
        success: false,
        error: 'Sensor not found',
      })
      return
    }
    res.json({
      success: true,
      data: sensor,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sensor',
    })
  }
})

export default router
