/**
 * API Client for NER Landslide Intelligence
 * Handles all communication with the backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Health Check
  async health() {
    return this.request('/health')
  }

  // Zones
  async getZones() {
    return this.request('/zones')
  }

  async getZone(id: string) {
    return this.request(`/zones/${id}`)
  }

  async recalculateZoneRisk(id: string) {
    return this.request(`/zones/${id}/recalculate`, { method: 'POST' })
  }

  // Risk
  async calculateRisk(input: {
    rainfall: number
    soilMoisture: number
    slope: number
    elevation: number
    historicalRisk: number
    satelliteAnomaly: number
  }) {
    return this.request('/risk/calculate', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  async simulateDisaster(input?: {
    rainfall?: number
    soilMoisture?: number
    slope?: number
    rainfallIncrease?: number
    steps?: number
  }) {
    return this.request('/risk/simulate-disaster', {
      method: 'POST',
      body: JSON.stringify(input || {}),
    })
  }

  async getAllZonesRisk() {
    return this.request('/risk/all-zones')
  }

  // Weather
  async getWeather() {
    return this.request('/weather')
  }

  // Sensors
  async getSensors() {
    return this.request('/sensors')
  }

  async getSensor(id: string) {
    return this.request(`/sensors/${id}`)
  }

  // Incidents
  async getIncidents() {
    return this.request('/incidents')
  }

  async createIncident(input: {
    name: string
    latitude: number
    longitude: number
    type: string
    severity: string
    casualties?: number
  }) {
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  // Alerts
  async getAlerts() {
    return this.request('/alerts')
  }

  async createAlert(input: { zoneId: string; level: string; message: string }) {
    return this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  // Reports
  async getReports() {
    return this.request('/reports')
  }

  async generateReport(input: { type: string; zoneIds?: string[] }) {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  // Impact Analysis
  async analyzeImpact(input: {
    zoneId: string
    riskScore?: number
    population?: number
  }) {
    return this.request('/impact-analysis', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  // Safe Routing
  async calculateSafeRoutes(input: {
    startLat: number
    startLon: number
    endLat: number
    endLon: number
    riskZones?: string[]
  }) {
    return this.request('/safe-routing', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  // Analytics
  async getDashboardAnalytics() {
    return this.request('/analytics/dashboard')
  }

  async getRiskDistribution() {
    return this.request('/analytics/risk-distribution')
  }

  async getHistoricalTrends() {
    return this.request('/analytics/historical')
  }
}

export const apiClient = new ApiClient()
