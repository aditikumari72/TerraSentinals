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
    status: 'active' | 'inactive' | 'error';
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
    type: 'landslide' | 'flood' | 'erosion';
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
    updateWithRainfallScenario(rainfallIncrease: number): RiskZone[];
    createIncident(incident: Partial<Incident>): Incident;
    createAlert(alert: Partial<Alert>): Alert;
}
export declare const mockDataService: MockDataService;
export {};
//# sourceMappingURL=mockDataService.d.ts.map