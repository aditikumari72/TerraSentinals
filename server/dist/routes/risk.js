import { Router } from 'express';
import { riskEngine } from '../services/riskEngine.js';
const router = Router();
/**
 * POST /api/risk/calculate
 * Calculate risk based on environmental factors
 */
router.post('/calculate', (req, res) => {
    try {
        const input = req.body;
        // Validate required fields
        if (typeof input.rainfall !== 'number' || typeof input.soilMoisture !== 'number') {
            res.status(400).json({
                success: false,
                error: 'Missing or invalid required fields: rainfall, soilMoisture',
            });
            return;
        }
        const riskOutput = riskEngine.calculateRisk(input);
        res.json({
            success: true,
            data: riskOutput,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to calculate risk',
        });
    }
});
/**
 * POST /api/risk/simulate-disaster
 * Simulate disaster progression with increasing rainfall
 */
router.post('/simulate-disaster', (req, res) => {
    try {
        const { rainfall = 30, soilMoisture = 50, slope = 35, rainfallIncrease = 15, steps = 5 } = req.body;
        const initialInput = {
            rainfall,
            soilMoisture,
            slope,
            elevation: 1500,
            historicalRisk: 20,
            satelliteAnomaly: 10,
        };
        const progression = riskEngine.simulateDisasterProgression(initialInput, rainfallIncrease, steps);
        res.json({
            success: true,
            data: {
                progression,
                summary: {
                    initialRisk: progression[0].riskLevel,
                    finalRisk: progression[progression.length - 1].riskLevel,
                    maxScore: Math.max(...progression.map((p) => p.riskScore)),
                    steps: progression.length,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to simulate disaster',
        });
    }
});
/**
 * GET /api/risk/all-zones
 * Get risk assessment for all zones
 */
router.get('/all-zones', (_req, res) => {
    try {
        const zones = [
            {
                id: 'east-sikkim',
                name: 'East Sikkim Demo Zone',
                rainfall: 45,
                soilMoisture: 68,
                slope: 40,
                elevation: 1680,
                historicalRisk: 35,
                satelliteAnomaly: 20,
            },
            {
                id: 'west-kameng',
                name: 'West Kameng Ridge',
                rainfall: 38,
                soilMoisture: 62,
                slope: 38,
                elevation: 2300,
                historicalRisk: 30,
                satelliteAnomaly: 15,
            },
            {
                id: 'ri-bhoi',
                name: 'Ri-Bhoi Slopes',
                rainfall: 52,
                soilMoisture: 75,
                slope: 35,
                elevation: 1450,
                historicalRisk: 25,
                satelliteAnomaly: 10,
            },
        ];
        const assessments = zones.map((zone) => ({
            zoneId: zone.id,
            zoneName: zone.name,
            ...riskEngine.calculateRisk({
                rainfall: zone.rainfall,
                soilMoisture: zone.soilMoisture,
                slope: zone.slope,
                elevation: zone.elevation,
                historicalRisk: zone.historicalRisk,
                satelliteAnomaly: zone.satelliteAnomaly,
            }),
        }));
        res.json({
            success: true,
            data: assessments,
            count: assessments.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch risk assessments',
        });
    }
});
export default router;
//# sourceMappingURL=risk.js.map