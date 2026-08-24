import { Router } from 'express';
const router = Router();
/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'NER Landslide Intelligence API',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
    });
});
export default router;
//# sourceMappingURL=health.js.map