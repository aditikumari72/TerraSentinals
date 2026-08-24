import { Router } from 'express';
import { mockDataService } from '../services/mockDataService.js';
const router = Router();
/**
 * GET /api/weather
 * Get current weather and forecast data
 */
router.get('/', (_req, res) => {
    try {
        const weatherData = mockDataService.getWeatherData();
        res.json({
            success: true,
            data: weatherData,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch weather data',
        });
    }
});
export default router;
//# sourceMappingURL=weather.js.map