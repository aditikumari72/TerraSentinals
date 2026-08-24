/**
 * Mock Data Service
 * Provides synthetic demo data for NER Landslide Intelligence
 * All data is clearly labeled as synthetic for demonstration purposes
 */

export interface RiskZone {
  id: string
  name: string
  state: string
  district: string
  latitude: number
  longitude: number
  score: number
  probability: number
  confidence: number
  population: number
  factors: Array<{ label: string; value: number }>
  lastUpdated: string
}

export interface Sensor {
  id: string
  name: string
  latitude: number
  longitude: number
  altitude: number
  type: string
  status: 'active' | 'inactive' | 'error'
  lastReading?: {
    timestamp: string
    rainfall: number
    soilMoisture: number
    temperature: number
  }
}

export interface Incident {
  id: string
  name: string
  latitude: number
  longitude: number
  type: 'landslide' | 'flood' | 'erosion'
  severity: 'low' | 'moderate' | 'high' | 'critical'
  timestamp: string
  casualties?: number
  status: 'reported' | 'verified' | 'resolved'
}

export interface Alert {
  id: string
  zoneId: string
  level: 'low' | 'moderate' | 'high' | 'critical'
  message: string
  timestamp: string
  resolved: boolean
}

export interface WeatherData {
  timestamp: string
  rainfall: number
  soilMoisture: number
  temperature: number
  humidity: number
  windSpeed: number
  forecast: Array<{ date: string; rainfall: number }>
}

class MockDataService {
  private riskZones: RiskZone[] = [
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
        { label: 'Steep Slope', value: 16 },
        { label: 'Historical Risk', value: 7 },
        { label: 'Satellite Anomaly', value: 3 },
      ],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'manipur-valley',
      name: 'Manipur Valley Basin',
      state: 'Manipur',
      district: 'Imphal West',
      latitude: 24.82,
      longitude: 94.91,
      score: 45,
      probability: 38,
      confidence: 75,
      population: 22000,
      factors: [
        { label: 'Heavy Rainfall', value: 15 },
        { label: 'Soil Moisture', value: 12 },
        { label: 'Steep Slope', value: 8 },
        { label: 'Historical Risk', value: 5 },
        { label: 'Satellite Anomaly', value: 2 },
      ],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'arunachal-ridge',
      name: 'Arunachal Ridge Zone',
      state: 'Arunachal Pradesh',
      district: 'Lohit',
      latitude: 28.2167,
      longitude: 96.3,
      score: 72,
      probability: 65,
      confidence: 82,
      population: 9500,
      factors: [
        { label: 'Heavy Rainfall', value: 24 },
        { label: 'Soil Moisture', value: 18 },
        { label: 'Steep Slope', value: 19 },
        { label: 'Historical Risk', value: 8 },
        { label: 'Satellite Anomaly', value: 5 },
      ],
      lastUpdated: new Date().toISOString(),
    },
  ]

  private sensors: Sensor[] = [
    {
      id: 'sensor-001',
      name: 'Gangtok Weather Station',
      latitude: 28.7041,
      longitude: 88.6064,
      altitude: 1680,
      type: 'weather',
      status: 'active',
      lastReading: {
        timestamp: new Date().toISOString(),
        rainfall: 45.2,
        soilMoisture: 68.5,
        temperature: 19,
      },
    },
    {
      id: 'sensor-002',
      name: 'Bomdila Seismic Array',
      latitude: 28.0667,
      longitude: 92.6833,
      altitude: 2300,
      type: 'seismic',
      status: 'active',
      lastReading: {
        timestamp: new Date().toISOString(),
        rainfall: 38.1,
        soilMoisture: 62.3,
        temperature: 16,
      },
    },
    {
      id: 'sensor-003',
      name: 'Nongpoh Moisture Sensor',
      latitude: 25.4667,
      longitude: 91.8333,
      altitude: 1450,
      type: 'soil',
      status: 'active',
      lastReading: {
        timestamp: new Date().toISOString(),
        rainfall: 52.8,
        soilMoisture: 75.2,
        temperature: 24,
      },
    },
  ]

  private incidents: Incident[] = [
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
  ]

  private alerts: Alert[] = [
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
  ]

  getRiskZones(): RiskZone[] {
    return this.riskZones
  }

  getRiskZone(id: string): RiskZone | undefined {
    return this.riskZones.find((z) => z.id === id)
  }

  getSensors(): Sensor[] {
    return this.sensors
  }

  getSensor(id: string): Sensor | undefined {
    return this.sensors.find((s) => s.id === id)
  }

  getIncidents(): Incident[] {
    return this.incidents
  }

  getAlerts(): Alert[] {
    return this.alerts
  }

  getWeatherData(): WeatherData {
    return {
      timestamp: new Date().toISOString(),
      rainfall: 45.2,
      soilMoisture: 68.5,
      temperature: 19,
      humidity: 82,
      windSpeed: 12,
      forecast: [
        { date: '2026-08-24', rainfall: 38 },
        { date: '2026-08-25', rainfall: 42 },
        { date: '2026-08-26', rainfall: 35 },
      ],
    }
  }

  // Update risk zones with simulated rainfall increase
  updateWithRainfallScenario(rainfallIncrease: number): RiskZone[] {
    return this.riskZones.map((zone) => ({
      ...zone,
      score: Math.min(100, zone.score + rainfallIncrease * 0.5),
      probability: Math.min(100, zone.probability + rainfallIncrease * 0.4),
      factors: zone.factors.map((f) => {
        if (f.label === 'Heavy Rainfall') {
          return { ...f, value: Math.min(100, f.value + rainfallIncrease) }
        }
        if (f.label === 'Soil Moisture') {
          return { ...f, value: Math.min(100, f.value + rainfallIncrease * 0.3) }
        }
        return f
      }),
      lastUpdated: new Date().toISOString(),
    }))
  }

  createIncident(incident: Partial<Incident>): Incident {
    const newIncident: Incident = {
      id: `incident-${Date.now()}`,
      name: incident.name || 'New Incident',
      latitude: incident.latitude || 0,
      longitude: incident.longitude || 0,
      type: incident.type || 'landslide',
      severity: incident.severity || 'moderate',
      timestamp: new Date().toISOString(),
      status: 'reported',
    }
    this.incidents.push(newIncident)
    return newIncident
  }

  createAlert(alert: Partial<Alert>): Alert {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      zoneId: alert.zoneId || '',
      level: alert.level || 'moderate',
      message: alert.message || 'Alert generated',
      timestamp: new Date().toISOString(),
      resolved: false,
    }
    this.alerts.push(newAlert)
    return newAlert
  }
}

export const mockDataService = new MockDataService()
