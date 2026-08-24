import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { config } from './config/environment.js'

// Import routes
import healthRoutes from './routes/health.js'
import zonesRoutes from './routes/zones.js'
import riskRoutes from './routes/risk.js'
import weatherRoutes from './routes/weather.js'
import sensorsRoutes from './routes/sensors.js'
import incidentsRoutes from './routes/incidents.js'
import alertsRoutes from './routes/alerts.js'
import reportsRoutes from './routes/reports.js'
import impactAnalysisRoutes from './routes/impact-analysis.js'
import safeRoutingRoutes from './routes/safe-routing.js'
import analyticsRoutes from './routes/analytics.js'

const app: Express = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS configuration
app.use(
  cors({
    origin: config.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
)

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Error handling middleware for JSON parsing
app.use((err: any, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON',
    })
    return
  }
  next()
})

// API Routes
app.use('/api/health', healthRoutes)
app.use('/api/zones', zonesRoutes)
app.use('/api/risk', riskRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api/sensors', sensorsRoutes)
app.use('/api/incidents', incidentsRoutes)
app.use('/api/alerts', alertsRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/impact-analysis', impactAnalysisRoutes)
app.use('/api/safe-routing', safeRoutingRoutes)
app.use('/api/analytics', analyticsRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.path}`,
  })
})

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
})

// Start server
const PORT = config.port
app.listen(PORT, () => {
  console.log(`✓ NER Landslide Intelligence API Server running on port ${PORT}`)
  console.log(`✓ Environment: ${config.nodeEnv}`)
  console.log(`✓ Frontend URL: ${config.frontendUrl}`)
  console.log(`✓ API Health: http://localhost:${PORT}/api/health`)
})

export default app
