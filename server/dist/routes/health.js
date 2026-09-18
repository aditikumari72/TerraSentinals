import { Router } from 'express';
import { mockDataService } from '../services/mockDataService.js';
const router = Router();
const startTime = Date.now();
/**
 * GET /api/health
 * Comprehensive health check with system summary
 */
router.get('/', (_req, res) => {
    const zones = mockDataService.getRiskZones();
    const sensors = mockDataService.getSensors();
    const alerts = mockDataService.getAlerts();
    const incidents = mockDataService.getIncidents();
    const criticalZones = zones.filter((z) => z.score > 80).length;
    const activeSensors = sensors.filter((s) => s.status === 'online').length;
    const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;
    res.json({
        status: 'ok',
        service: 'NER Landslide Intelligence API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: Math.round((Date.now() - startTime) / 1000),
        uptimeFormatted: formatUptime(Date.now() - startTime),
        summary: {
            totalZones: zones.length,
            criticalZones,
            activeSensors,
            totalSensors: sensors.length,
            unresolvedAlerts,
            activeIncidents: incidents.filter((i) => i.status !== 'resolved').length,
        },
    });
});
function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    if (s < 60)
        return `${s}s`;
    if (s < 3600)
        return `${Math.floor(s / 60)}m ${s % 60}s`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}
export default router;
//# sourceMappingURL=health.js.map