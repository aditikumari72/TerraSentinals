import { Router } from 'express';
import { mockDataService } from '../services/mockDataService.js';
const router = Router();
/**
 * POST /api/impact-analysis
 * Analyze potential impact of a landslide for a given zone
 */
router.post('/', (req, res) => {
    try {
        const { zoneId } = req.body;
        if (!zoneId) {
            res.status(400).json({ success: false, error: 'Missing required field: zoneId' });
            return;
        }
        // Use live zone data if available
        const zone = mockDataService.getRiskZone(zoneId);
        const riskScore = zone?.score ?? (req.body.riskScore ?? 75);
        const population = zone?.population ?? (req.body.population ?? 10000);
        const affectedPopulation = Math.round(population * (riskScore / 100) * 0.3);
        const estimatedCasualties = Math.round(affectedPopulation * 0.05);
        const economicImpact = estimatedCasualties * 500000 + affectedPopulation * 12000;
        const evacuationRequired = riskScore > 70;
        const impact = {
            zoneId,
            zoneName: zone?.name ?? zoneId,
            state: zone?.state ?? 'Unknown',
            riskScore,
            population,
            affectedPopulation,
            estimatedCasualties,
            economicImpact,
            evacuationRequired,
            evacuationRadius: evacuationRequired ? (riskScore > 85 ? '5-10 km' : '2-5 km') : 'Not required',
            infrastructure: {
                roads: Math.ceil(riskScore / 20),
                buildings: Math.ceil(riskScore / 25),
                bridges: Math.ceil(riskScore / 30),
            },
            recommendations: buildRecommendations(riskScore, evacuationRequired),
            lastUpdated: zone?.lastUpdated ?? new Date().toISOString(),
        };
        res.json({ success: true, data: impact });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to analyze impact' });
    }
});
/**
 * GET /api/impact-analysis/summary
 * Aggregate impact summary across all critical zones
 */
router.get('/summary', (_req, res) => {
    try {
        const zones = mockDataService.getRiskZones();
        const incidents = mockDataService.getIncidents();
        const atRiskZones = zones.filter((z) => z.score > 30);
        const totalExposed = atRiskZones.reduce((sum, z) => sum + z.population, 0);
        const criticalZones = zones.filter((z) => z.score > 80);
        const estimatedCasualties = criticalZones.reduce((sum, z) => {
            const affected = Math.round(z.population * (z.score / 100) * 0.3);
            return sum + Math.round(affected * 0.05);
        }, 0);
        res.json({
            success: true,
            data: {
                totalExposedPopulation: totalExposed,
                criticalZoneCount: criticalZones.length,
                highRiskZoneCount: zones.filter((z) => z.score > 60 && z.score <= 80).length,
                estimatedCasualties,
                activeIncidents: incidents.filter((i) => i.status !== 'resolved').length,
                atRiskZones: atRiskZones.map((z) => ({
                    id: z.id,
                    name: z.name,
                    state: z.state,
                    score: z.score,
                    population: z.population,
                })),
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch impact summary' });
    }
});
function buildRecommendations(riskScore, evacuationRequired) {
    const base = [
        'Alert community leaders immediately',
        'Pre-position emergency supplies',
        'Brief medical facilities for casualty influx',
        'Activate communication systems',
    ];
    if (evacuationRequired) {
        return [
            'IMMEDIATE: Begin evacuation of affected areas',
            'Activate emergency response protocols',
            'Establish relief and evacuation centers',
            ...base,
        ];
    }
    if (riskScore > 50) {
        return ['Activate emergency response protocols', 'Prepare evacuation centers', ...base];
    }
    return ['Continue monitoring', ...base];
}
export default router;
//# sourceMappingURL=impact-analysis.js.map