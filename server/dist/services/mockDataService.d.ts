/**
 * Mock Data Service
 * Provides synthetic demo data for NER Landslide Intelligence
 * All data is clearly labeled as synthetic for demonstration purposes
 */
export interface RiskZone {
    id: string;
    name: string;
    state: string;
    district: string;
    latitude: number;
    longitude: number;
    score: number;
    probability: number;
    confidence: number;
    population: number;
    factors: Array<{
        label: string;
        value: number;
    }>;
    lastUpdated: string;
}
export interface Sensor {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    altitude: number;
    type: string;
    x: number;
    y: number;
    status: 'online' | 'degraded' | 'offline';
    lastReading?: {
        timestamp: string;
        rainfall: number;
        soilMoisture: number;
        temperature: number;
    };
}
export interface Incident {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    type: 'landslide' | 'flood' | 'erosion' | 'rockfall' | 'road_blocked';
    severity: 'low' | 'moderate' | 'high' | 'critical';
    timestamp: string;
    casualties?: number;
    status: 'reported' | 'verified' | 'resolved';
}
export interface Alert {
    id: string;
    zoneId: string;
    level: 'low' | 'moderate' | 'high' | 'critical';
    message: string;
    timestamp: string;
    resolved: boolean;
}
export interface WeatherData {
    timestamp: string;
    rainfall: number;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    windSpeed: number;
    forecast: Array<{
        date: string;
        rainfall: number;
    }>;
}
declare class MockDataService {
    private riskZones;
    private sensors;
    private incidents;
    private alerts;
    getRiskZones(): RiskZone[];
    getRiskZone(id: string): RiskZone | undefined;
    getSensors(): Sensor[];
    getSensor(id: string): Sensor | undefined;
    getIncidents(): Incident[];
    getAlerts(): Alert[];
    getWeatherData(): WeatherData;
    /** Historical trend data for the last 9 days */
    getHistoricalTrends(): {
        riskTrends: {
            date: string;
            score: number;
        }[];
        rainfallTrends: {
            date: string;
            rainfall: number;
        }[];
        soilMoistureTrends: {
            date: string;
            moisture: number;
        }[];
    };
    /** Incident trend for last 7 days */
    getIncidentTrend(): {
        day: string;
        incidents: number;
        resolved: number;
    }[];
    createIncident(incident: Partial<Incident>): Incident;
    updateIncidentStatus(id: string, status: Incident['status']): Incident | null;
    createAlert(alert: Partial<Alert>): Alert;
    resolveAlert(id: string): Alert | null;
    /** Simulates rainfall-scenario risk escalation across all zones */
    updateWithRainfallScenario(rainfallIncrease: number): RiskZone[];
}
export declare const mockDataService: MockDataService;
export {};
//# sourceMappingURL=mockDataService.d.ts.map