import { Router, Request, Response } from 'express'
import { mockDataService } from '../services/mockDataService.js'

const router = Router()

/**
 * GET /api/incidents
 * Get all incidents (optionally filter ?status=reported|verified|resolved)
 */
router.get('/', (req: Request, res: Response) => {
  try {
    let incidents = mockDataService.getIncidents()

    const { status, type } = req.query
    if (status) incidents = incidents.filter((i) => i.status === status)
    if (type) incidents = incidents.filter((i) => i.type === type)

    // Sort by timestamp descending (newest first)
    incidents = [...incidents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    res.json({ success: true, data: incidents, count: incidents.length })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch incidents' })
  }
})

/**
 * GET /api/incidents/:id
 * Get a specific incident
 */
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const incidents = mockDataService.getIncidents()
    const incident = incidents.find((i) => i.id === req.params.id)
    if (!incident) {
      res.status(404).json({ success: false, error: 'Incident not found' })
      return
    }
    res.json({ success: true, data: incident })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch incident' })
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

    res.status(201).json({ success: true, data: incident })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create incident' })
  }
})

/**
 * PATCH /api/incidents/:id/status
 * Update incident status (reported → verified → resolved)
 */
router.patch('/:id/status', (req: Request, res: Response): void => {
  try {
    const { status } = req.body
    const validStatuses = ['reported', 'verified', 'resolved']

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      })
      return
    }

    const incident = mockDataService.updateIncidentStatus(req.params.id, status)
    if (!incident) {
      res.status(404).json({ success: false, error: 'Incident not found' })
      return
    }

    res.json({ success: true, data: incident })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update incident status' })
  }
})

export default router
