import { Router } from 'express';
import { mockDataService } from '../services/mockDataService.js';
const router = Router();
/**
 * GET /api/analytics/dashboard
 * Get dashboard analytics
 */
router.get('/dashboard', (_req, res) => {
    try {
        const zones = mockDataService.getRiskZones();
        const incidents = mockDataService.getIncidents();
        const sensors = mockDataService.getSensors();
        const criticalZones = zones.filter((z) => z.score > 80).length;
        const highRiskZones = zones.filter((z) => z.score > 60 && z.score <= 80).length;
        const moderateRiskZones = zones.filter((z) => z.score > 30 && z.score <= 60).length;
        const lowRiskZones = zones.filter((z) => z.score <= 30).length;
        const totalAffectedPopulation = zones.reduce((sum, z) => sum + z.population, 0);
        const totalIncidents = incidents.length;
        const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length;
        const activeSensors = sensors.filter((s) => s.status === 'active').length;
        const analytics = {
            summary: {
                totalZones: zones.length,
                criticalZones,
                highRiskZones,
                moderateRiskZones,
                lowRiskZones,
                totalAffectedPopulation,
                averageRiskScore: Math.round(zones.reduce((sum, z) => sum + z.score, 0) / zones.length),
            },
            incidents: {
                total: totalIncidents,
                resolved: resolvedIncidents,
                pending: totalIncidents - resolvedIncidents,
                types: {
                    landslide: incidents.filter((i) => i.type === 'landslide').length,
                    flood: incidents.filter((i) => i.type === 'flood').length,
                    erosion: incidents.filter((i) => i.type === 'erosion').length,
                },
            },
            sensors: {
                total: sensors.length,
                active: activeSensors,
                inactive: sensors.filter((s) => s.status === 'inactive').length,
                error: sensors.filter((s) => s.status === 'error').length,
            },
            trends: {
                riskTrend: 'increasing',
                rainfallTrend: 'heavy',
                soilMoistureTrend: 'rising',
            },
        };
        res.json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics',
        });
    }
});
/**
 * GET /api/analytics/risk-distribution
 * Get risk distribution across zones
 */
router.get('/risk-distribution', (_req, res) => {
    try {
        const zones = mockDataService.getRiskZones();
        const distribution = {
            critical: zones.filter((z) => z.score > 80),
            high: zones.filter((z) => z.score > 60 && z.score <= 80),
            moderate: zones.filter((z) => z.score > 30 && z.score <= 60),
            low: zones.filter((z) => z.score <= 30),
        };
        res.json({
            success: true,
            data: {
                distribution,
                percentages: {
                    critical: Math.round((distribution.critical.length / zones.length) * 100),
                    high: Math.round((distribution.high.length / zones.length) * 100),
                    moderate: Math.round((distribution.moderate.length / zones.length) * 100),
                    low: Math.round((distribution.low.length / zones.length) * 100),
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch risk distribution',
        });
    }
});
/**
 * GET /api/analytics/historical
 * Get historical trends
 */
router.get('/historical', (_req, res) => {
    res.json({
        success: true,
        data: {
            riskTrends: [
                { date: '2026-08-15', score: 65 },
                { date: '2026-08-16', score: 68 },
                { date: '2026-08-17', score: 72 },
                { date: '2026-08-18', score: 75 },
                { date: '2026-08-19', score: 78 },
                { date: '2026-08-20', score: 82 },
                { date: '2026-08-21', score: 85 },
                { date: '2026-08-22', score: 84 },
                { date: '2026-08-23', score: 81 },
            ],
            rainfallTrends: [
                { date: '2026-08-15', rainfall: 25 },
                { date: '2026-08-16', rainfall: 32 },
                { date: '2026-08-17', rainfall: 45 },
                { date: '2026-08-18', rainfall: 55 },
                { date: '2026-08-19', rainfall: 48 },
                { date: '2026-08-20', rainfall: 52 },
                { date: '2026-08-21', rainfall: 38 },
                { date: '2026-08-22', rainfall: 35 },
                { date: '2026-08-23', rainfall: 28 },
            ],
            soilMoistureTrends: [
                { date: '2026-08-15', moisture: 45 },
                { date: '2026-08-16', moisture: 52 },
                { date: '2026-08-17', moisture: 58 },
                { date: '2026-08-18', moisture: 65 },
                { date: '2026-08-19', moisture: 68 },
                { date: '2026-08-20', moisture: 72 },
                { date: '2026-08-21', moisture: 70 },
                { date: '2026-08-22', moisture: 68 },
                { date: '2026-08-23', rainfall: 65 },
            ],
        },
    });
});
export default router;
//# sourceMappingURL=analytics.js.map