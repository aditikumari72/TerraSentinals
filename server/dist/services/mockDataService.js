/**
 * Mock Data Service
 * Provides synthetic demo data for NER Landslide Intelligence
 * All data is clearly labeled as synthetic for demonstration purposes
 */
/** Returns YYYY-MM-DD string offset by `days` from today */
function dateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}
/** Returns YYYY-MM-DD string for N days ago */
function dateAgo(days) {
    return dateOffset(-days);
}
class MockDataService {
    constructor() {
        this.riskZones = [
            {
                id: 'east-sikkim',
                name: 'East Sikkim Demo Zone',
                state: 'Sikkim',
                district: 'Gangtok',
                latitude: 28.7041,
                longitude: 88.6064,
                score: 91,
                probability: 87,
                confidence: 91,
                population: 12400,
                factors: [
                    { label: 'Heavy Rainfall', value: 31 },
                    { label: 'Soil Moisture', value: 24 },
                    { label: 'Steep Slope', value: 18 },
                    { label: 'Historical Risk', value: 8 },
                    { label: 'Satellite Anomaly', value: 6 },
                ],
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 'west-kameng',
                name: 'West Kameng Ridge',
                state: 'Arunachal Pradesh',
                district: 'Bomdila',
                latitude: 28.0667,
                longitude: 92.6833,
                score: 78,
                probability: 71,
                confidence: 84,
                population: 8600,
                factors: [
                    { label: 'Heavy Rainfall', value: 26 },
                    { label: 'Soil Moisture', value: 19 },
                    { label: 'Steep Slope', value: 20 },
                    { label: 'Historical Risk', value: 9 },
                    { label: 'Satellite Anomaly', value: 4 },
                ],
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 'ri-bhoi',
                name: 'Ri-Bhoi Slopes',
                state: 'Meghalaya',
                district: 'Nongpoh',
                latitude: 25.4667,
                longitude: 91.8333,
                score: 66,
                probability: 58,
                confidence: 80,
                population: 15200,
                factors: [
                    { label: 'Heavy Rainfall', value: 22 },
                    { label: 'Soil Moisture', value: 17 },
                    { label: 'Steep Slope', value: 14 },
                    { label: 'Historical Risk', value: 7 },
                    { label: 'Satellite Anomaly', value: 3 },
                ],
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 'dima-hasao',
                name: 'Dima Hasao Corridor',
                state: 'Assam',
                district: 'Haflong',
                latitude: 25.1667,
                longitude: 93.0333,
                score: 72,
                probability: 64,
                confidence: 82,
                population: 21800,
                factors: [
                    { label: 'Heavy Rainfall', value: 25 },
                    { label: 'Soil Moisture', value: 20 },
                    { label: 'Steep Slope', value: 16 },
                    { label: 'Historical Risk', value: 8 },
                    { label: 'Satellite Anomaly', value: 3 },
                ],
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 'serchhip',
                name: 'Serchhip Hills',
                state: 'Mizoram',
                district: 'Serchhip',
                latitude: 23.3167,
                longitude: 92.85,
                score: 54,
                probability: 47,
                confidence: 77,
                population: 9400,
                factors: [
                    { label: 'Heavy Rainfall', value: 20 },
                    { label: 'Soil Moisture', value: 15 },
                    { label: 'Steep Slope', value: 12 },
                    { label: 'Historical Risk', value: 5 },
                    { label: 'Satellite Anomaly', value: 2 },
                ],
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 'senapati',
                name: 'Senapati Highlands',
                state: 'Manipur',
                district: 'Senapati',
                latitude: 25.2667,
                longitude: 94.0167,
                score: 44,
                probability: 39,
                confidence: 74,
                population: 11200,
                factors: [
                    { label: 'Heavy Rainfall', value: 16 },
                    { label: 'Soil Moisture', value: 13 },
                    { label: 'Steep Slope', value: 10 },
                    { label: 'Historical Risk', value: 4 },
                    { label: 'Satellite Anomaly', value: 1 },
                ],
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 'phek',
                name: 'Phek Escarpment',
                state: 'Nagaland',
                district: 'Phek',
                latitude: 25.6833,
                longitude: 94.4667,
                score: 38,
                probability: 33,
                confidence: 72,
                population: 7300,
                factors: [
                    { label: 'Heavy Rainfall', value: 14 },
                    { label: 'Soil Moisture', value: 11 },
                    { label: 'Steep Slope', value: 9 },
                    { label: 'Historical Risk', value: 3 },
                    { label: 'Satellite Anomaly', value: 1 },
                ],
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 'dhalai',
                name: 'Dhalai Basin',
                state: 'Tripura',
                district: 'Ambassa',
                latitude: 23.9333,
                longitude: 91.8,
                score: 24,
                probability: 19,
                confidence: 70,
                population: 13600,
                factors: [
                    { label: 'Heavy Rainfall', value: 9 },
                    { label: 'Soil Moisture', value: 7 },
                    { label: 'Steep Slope', value: 5 },
                    { label: 'Historical Risk', value: 2 },
                    { label: 'Satellite Anomaly', value: 1 },
                ],
                lastUpdated: new Date().toISOString(),
            },
        ];
        this.sensors = [
            {
                id: 'SNS-014',
                name: 'Gangtok Piezometer Array',
                latitude: 28.7041,
                longitude: 88.6064,
                altitude: 1680,
                type: 'Piezometer',
                x: 24,
                y: 33,
                status: 'online',
                lastReading: {
                    timestamp: new Date().toISOString(),
                    rainfall: 45.2,
                    soilMoisture: 68.5,
                    temperature: 19,
                },
            },
            {
                id: 'SNS-021',
                name: 'Bomdila Rain Gauge',
                latitude: 28.0667,
                longitude: 92.6833,
                altitude: 2300,
                type: 'Rain Gauge',
                x: 61,
                y: 25,
                status: 'online',
                lastReading: {
                    timestamp: new Date().toISOString(),
                    rainfall: 38.1,
                    soilMoisture: 62.3,
                    temperature: 16,
                },
            },
            {
                id: 'SNS-033',
                name: 'Nongpoh Inclinometer',
                latitude: 25.4667,
                longitude: 91.8333,
                altitude: 1450,
                type: 'Inclinometer',
                x: 40,
                y: 60,
                status: 'degraded',
                lastReading: {
                    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    rainfall: 52.8,
                    soilMoisture: 75.2,
                    temperature: 24,
                },
            },
            {
                id: 'SNS-048',
                name: 'Haflong Soil Probe',
                latitude: 25.1667,
                longitude: 93.0333,
                altitude: 1200,
                type: 'Soil Probe',
                x: 54,
                y: 58,
                status: 'online',
                lastReading: {
                    timestamp: new Date().toISOString(),
                    rainfall: 41.5,
                    soilMoisture: 71.8,
                    temperature: 22,
                },
            },
            {
                id: 'SNS-052',
                name: 'Senapati Rain Gauge',
                latitude: 25.2667,
                longitude: 94.0167,
                altitude: 1600,
                type: 'Rain Gauge',
                x: 76,
                y: 64,
                status: 'offline',
                lastReading: {
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    rainfall: 0,
                    soilMoisture: 0,
                    temperature: 0,
                },
            },
            {
                id: 'SNS-067',
                name: 'Serchhip Piezometer',
                latitude: 23.3167,
                longitude: 92.85,
                altitude: 1100,
                type: 'Piezometer',
                x: 58,
                y: 80,
                status: 'online',
                lastReading: {
                    timestamp: new Date().toISOString(),
                    rainfall: 33.4,
                    soilMoisture: 59.1,
                    temperature: 26,
                },
            },
        ];
        this.incidents = [
            {
                id: 'incident-001',
                name: 'Minor Landslide - East Sikkim',
                latitude: 28.71,
                longitude: 88.61,
                type: 'landslide',
                severity: 'high',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                casualties: 0,
                status: 'reported',
            },
            {
                id: 'incident-002',
                name: 'Erosion Alert - West Kameng',
                latitude: 28.07,
                longitude: 92.68,
                type: 'erosion',
                severity: 'moderate',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                status: 'verified',
            },
            {
                id: 'incident-003',
                name: 'Road Blocked - NH-10',
                latitude: 27.2,
                longitude: 88.52,
                type: 'road_blocked',
                severity: 'high',
                timestamp: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
                status: 'verified',
            },
            {
                id: 'incident-004',
                name: 'Rockfall - Bomdila',
                latitude: 27.27,
                longitude: 92.41,
                type: 'rockfall',
                severity: 'moderate',
                timestamp: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
                status: 'verified',
            },
            {
                id: 'incident-005',
                name: 'Slope Crack - Nongpoh',
                latitude: 25.9,
                longitude: 91.75,
                type: 'landslide',
                severity: 'high',
                timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
                casualties: 0,
                status: 'reported',
            },
        ];
        this.alerts = [
            {
                id: 'alert-001',
                zoneId: 'east-sikkim',
                level: 'critical',
                message: 'Heavy rainfall detected - Risk escalating rapidly',
                timestamp: new Date().toISOString(),
                resolved: false,
            },
            {
                id: 'alert-002',
                zoneId: 'west-kameng',
                level: 'high',
                message: 'Soil moisture increasing - Monitor closely',
                timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                resolved: false,
            },
            {
                id: 'alert-003',
                zoneId: 'ri-bhoi',
                level: 'moderate',
                message: 'Seasonal rainfall pattern detected',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                resolved: false,
            },
            {
                id: 'alert-004',
                zoneId: 'dima-hasao',
                level: 'high',
                message: 'Landslide debris reported on NH-54 - Route under assessment',
                timestamp: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
                resolved: false,
            },
            {
                id: 'alert-005',
                zoneId: 'serchhip',
                level: 'low',
                message: 'Elevated humidity — continue standard monitoring',
                timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
                resolved: false,
            },
        ];
    }
    // ─── Getters ───────────────────────────────────────────────────────────────
    getRiskZones() {
        return this.riskZones;
    }
    getRiskZone(id) {
        return this.riskZones.find((z) => z.id === id);
    }
    getSensors() {
        return this.sensors;
    }
    getSensor(id) {
        return this.sensors.find((s) => s.id === id);
    }
    getIncidents() {
        return this.incidents;
    }
    getAlerts() {
        return this.alerts;
    }
    getWeatherData() {
        return {
            timestamp: new Date().toISOString(),
            rainfall: 45.2,
            soilMoisture: 68.5,
            temperature: 19,
            humidity: 82,
            windSpeed: 12,
            forecast: [
                { date: dateOffset(1), rainfall: 58 },
                { date: dateOffset(2), rainfall: 42 },
                { date: dateOffset(3), rainfall: 35 },
                { date: dateOffset(4), rainfall: 28 },
                { date: dateOffset(5), rainfall: 31 },
            ],
        };
    }
    /** Historical trend data for the last 9 days */
    getHistoricalTrends() {
        const riskScores = [65, 68, 72, 75, 78, 82, 85, 84, 81];
        const rainfallMm = [25, 32, 45, 55, 48, 52, 38, 35, 28];
        const moisturePct = [45, 52, 58, 65, 68, 72, 70, 68, 65];
        return {
            riskTrends: riskScores.map((score, i) => ({
                date: dateAgo(8 - i),
                score,
            })),
            rainfallTrends: rainfallMm.map((rainfall, i) => ({
                date: dateAgo(8 - i),
                rainfall,
            })),
            soilMoistureTrends: moisturePct.map((moisture, i) => ({
                date: dateAgo(8 - i),
                moisture,
            })),
        };
    }
    /** Incident trend for last 7 days */
    getIncidentTrend() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const incidents = [8, 12, 10, 18, 24, 31, 27];
        const resolved = [6, 9, 8, 11, 14, 19, 22];
        return days.map((day, i) => ({ day, incidents: incidents[i], resolved: resolved[i] }));
    }
    // ─── Mutations ─────────────────────────────────────────────────────────────
    createIncident(incident) {
        const newIncident = {
            id: `incident-${Date.now()}`,
            name: incident.name || 'New Incident',
            latitude: incident.latitude || 0,
            longitude: incident.longitude || 0,
            type: incident.type || 'landslide',
            severity: incident.severity || 'moderate',
            timestamp: new Date().toISOString(),
            status: 'reported',
        };
        this.incidents.push(newIncident);
        return newIncident;
    }
    updateIncidentStatus(id, status) {
        const incident = this.incidents.find((i) => i.id === id);
        if (!incident)
            return null;
        incident.status = status;
        return incident;
    }
    createAlert(alert) {
        const newAlert = {
            id: `alert-${Date.now()}`,
            zoneId: alert.zoneId || '',
            level: alert.level || 'moderate',
            message: alert.message || 'Alert generated',
            timestamp: new Date().toISOString(),
            resolved: false,
        };
        this.alerts.push(newAlert);
        return newAlert;
    }
    resolveAlert(id) {
        const alert = this.alerts.find((a) => a.id === id);
        if (!alert)
            return null;
        alert.resolved = true;
        return alert;
    }
    /** Simulates rainfall-scenario risk escalation across all zones */
    updateWithRainfallScenario(rainfallIncrease) {
        return this.riskZones.map((zone) => ({
            ...zone,
            score: Math.min(100, zone.score + rainfallIncrease * 0.5),
            probability: Math.min(100, zone.probability + rainfallIncrease * 0.4),
            factors: zone.factors.map((f) => {
                if (f.label === 'Heavy Rainfall') {
                    return { ...f, value: Math.min(100, f.value + rainfallIncrease) };
                }
                if (f.label === 'Soil Moisture') {
                    return { ...f, value: Math.min(100, f.value + rainfallIncrease * 0.3) };
                }
                return f;
            }),
            lastUpdated: new Date().toISOString(),
        }));
    }
}
export const mockDataService = new MockDataService();
//# sourceMappingURL=mockDataService.js.map