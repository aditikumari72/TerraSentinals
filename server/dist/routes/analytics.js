import { Router } from 'express';
import { mockDataService } from '../services/mockDataService.js';
const router = Router();
/**
 * GET /api/analytics/dashboard
 * Aggregated dashboard analytics
 */
router.get('/dashboard', (_req, res) => {
    try {
        const zones = mockDataService.getRiskZones();
        const incidents = mockDataService.getIncidents();
        const sensors = mockDataService.getSensors();
        const alerts = mockDataService.getAlerts();
        const criticalZones = zones.filter((z) => z.score > 80).length;
        const highRiskZones = zones.filter((z) => z.score > 60 && z.score <= 80).length;
        const moderateRiskZones = zones.filter((z) => z.score > 30 && z.score <= 60).length;
        const lowRiskZones = zones.filter((z) => z.score <= 30).length;
        const totalAffectedPopulation = zones
            .filter((z) => z.score > 30)
            .reduce((sum, z) => sum + z.population, 0);
        const totalIncidents = incidents.length;
        const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length;
        const activeSensors = sensors.filter((s) => s.status === 'online').length;
        const degradedSensors = sensors.filter((s) => s.status === 'degraded').length;
        const offlineSensors = sensors.filter((s) => s.status === 'offline').length;
        const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;
        // Risk by state
        const riskByState = zones.map((z) => ({
            state: z.state.length > 9 ? z.state.slice(0, 8) + '.' : z.state,
            fullState: z.state,
            risk: z.score,
        }));
        // Population exposure by state
        const populationExposure = zones.map((z) => ({
            state: z.state.length > 9 ? z.state.slice(0, 8) + '.' : z.state,
            fullState: z.state,
            people: z.population,
        }));
        // Incident trend (last 7 days)
        const incidentTrend = mockDataService.getIncidentTrend();
        const analytics = {
            summary: {
                totalZones: zones.length,
                criticalZones,
                highRiskZones,
                moderateRiskZones,
                lowRiskZones,
                totalAffectedPopulation,
                averageRiskScore: Math.round(zones.reduce((sum, z) => sum + z.score, 0) / zones.length),
                unresolvedAlerts,
            },
            incidents: {
                total: totalIncidents,
                resolved: resolvedIncidents,
                pending: totalIncidents - resolvedIncidents,
                types: {
                    landslide: incidents.filter((i) => i.type === 'landslide').length,
                    flood: incidents.filter((i) => i.type === 'flood').length,
                    erosion: incidents.filter((i) => i.type === 'erosion').length,
                    rockfall: incidents.filter((i) => i.type === 'rockfall').length,
                    road_blocked: incidents.filter((i) => i.type === 'road_blocked').length,
                },
            },
            sensors: {
                total: sensors.length,
                online: activeSensors,
                degraded: degradedSensors,
                offline: offlineSensors,
                healthPercent: Math.round((activeSensors / sensors.length) * 100),
            },
            trends: {
                riskTrend: criticalZones > 1 ? 'increasing' : 'stable',
                rainfallTrend: 'heavy',
                soilMoistureTrend: 'rising',
            },
            charts: {
                riskByState,
                populationExposure,
                incidentTrend,
            },
        };
        res.json({ success: true, data: analytics });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
});
/**
 * GET /api/analytics/risk-distribution
 * Risk distribution across zones
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
        res.status(500).json({ success: false, error: 'Failed to fetch risk distribution' });
    }
});
/**
 * GET /api/analytics/historical
 * Historical trends (last 9 days, dynamically dated)
 */
router.get('/historical', (_req, res) => {
    try {
        const trends = mockDataService.getHistoricalTrends();
        res.json({ success: true, data: trends });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch historical trends' });
    }
});
export default router;
//# sourceMappingURL=analytics.js.map