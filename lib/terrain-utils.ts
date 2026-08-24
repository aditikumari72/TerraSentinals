// Utilities for generating synthetic 3D terrain and GIS data for NER Landslide Intelligence

export interface TerrainHeightData {
  width: number
  height: number
  data: Float32Array
}

export interface GeoLocation {
  lat: number
  lon: number
  altitude: number
  name: string
  type: 'sensor' | 'incident' | 'hospital' | 'settlement'
}

export interface RiverSegment {
  x: number
  z: number
  width: number
}

export interface RoadSegment {
  x1: number
  z1: number
  x2: number
  z2: number
  width: number
}

/**
 * Generate synthetic Perlin-like noise for realistic terrain
 * Uses simplex noise algorithm for smooth, natural-looking elevation
 */
function generateNoise(
  x: number,
  y: number,
  scale: number = 1,
  octaves: number = 4,
  persistence: number = 0.5,
  lacunarity: number = 2
): number {
  let value = 0
  let amplitude = 1
  let frequency = 1
  let maxValue = 0

  for (let i = 0; i < octaves; i++) {
    value += perlin(x * frequency / scale, y * frequency / scale) * amplitude
    maxValue += amplitude
    amplitude *= persistence
    frequency *= lacunarity
  }

  return value / maxValue
}

/**
 * Simple perlin-like noise function
 */
function perlin(x: number, y: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi

  // Pseudo-random function
  const rand = (n: number): number => {
    const x = Math.sin(n * 12.9898) * 43758.5453
    return x - Math.floor(x)
  }

  const n00 = rand(xi + yi * 57)
  const n10 = rand(xi + 1 + yi * 57)
  const n01 = rand(xi + (yi + 1) * 57)
  const n11 = rand(xi + 1 + (yi + 1) * 57)

  // Smoothstep interpolation
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)

  const nx0 = n00 + u * (n10 - n00)
  const nx1 = n01 + u * (n11 - n01)
  return nx0 + v * (nx1 - nx0)
}

/**
 * Generate synthetic terrain height data for NER region
 * Simulates the mountainous terrain of North Eastern Region
 */
export function generateTerrainHeightMap(
  width: number = 512,
  height: number = 512,
  options: {
    baseHeight?: number
    maxHeight?: number
    mountainPeaks?: number
  } = {}
): TerrainHeightData {
  const { baseHeight = 500, maxHeight = 3500, mountainPeaks = 8 } = options

  const data = new Float32Array(width * height)
  const scale = 200

  // Generate base noise
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let elevation = baseHeight

      // Multi-scale noise for natural terrain
      const noise1 = generateNoise(x, y, scale, 3, 0.6, 2.2) * 1000
      const noise2 = generateNoise(x, y, scale * 3, 2, 0.5, 2) * 500
      const noise3 = generateNoise(x, y, scale * 0.5, 4, 0.7, 2.1) * 300

      elevation += noise1 + noise2 + noise3

      // Add some ridge effects for mountain ranges
      const ridgeNoise = Math.abs(generateNoise(x * 0.5, y * 0.5, 100, 2, 0.6, 2)) * 1000
      elevation += ridgeNoise

      // Add river valleys (slight depression)
      const riverNoise = generateNoise(x * 0.8, y * 1.2, 150, 2, 0.5, 2)
      if (riverNoise < 0.3) {
        elevation -= Math.abs(riverNoise) * 300
      }

      // Clamp elevation
      elevation = Math.max(baseHeight / 2, Math.min(maxHeight, elevation))

      data[y * width + x] = elevation
    }
  }

  return { width, height, data }
}

/**
 * Generate realistic river paths based on terrain height map
 */
export function generateRiverPaths(heightMap: TerrainHeightData, numRivers: number = 3): RiverSegment[] {
  const rivers: RiverSegment[] = []
  const { width, height, data } = heightMap

  for (let i = 0; i < numRivers; i++) {
    // Start from a random high point
    const startX = Math.random() * width
    const startZ = Math.random() * height

    // Trace river path following lowest elevation
    const riverPath: RiverSegment[] = []
    let x = startX
    let z = startZ
    let pathLength = 0
    const maxPathLength = 500

    while (pathLength < maxPathLength && x > 0 && x < width && z > 0 && z < height) {
      const idx = Math.floor(z) * width + Math.floor(x)
      const currentHeight = data[idx]

      // Find lowest neighbor
      let lowestHeight = currentHeight
      let lowestX = x
      let lowestZ = z

      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          const nx = Math.floor(x) + dx
          const nz = Math.floor(z) + dz
          if (nx >= 0 && nx < width && nz >= 0 && nz < height) {
            const nIdx = nz * width + nx
            if (data[nIdx] < lowestHeight) {
              lowestHeight = data[nIdx]
              lowestX = nx
              lowestZ = nz
            }
          }
        }
      }

      if (lowestHeight >= currentHeight) break

      x = lowestX
      z = lowestZ
      riverPath.push({
        x: (x / width) * 100,
        z: (z / height) * 100,
        width: 15 + Math.random() * 10,
      })
      pathLength++
    }

    rivers.push(...riverPath)
  }

  return rivers
}

/**
 * Generate road network paths
 */
export function generateRoadNetwork(heightMap: TerrainHeightData, numRoads: number = 4): RoadSegment[] {
  const roads: RoadSegment[] = []
  const { width, height } = heightMap

  for (let i = 0; i < numRoads; i++) {
    const startX = Math.random() * width
    const startZ = Math.random() * height
    const endX = Math.random() * width
    const endZ = Math.random() * height

    roads.push({
      x1: (startX / width) * 100,
      z1: (startZ / height) * 100,
      x2: (endX / width) * 100,
      z2: (endZ / height) * 100,
      width: 8 + Math.random() * 4,
    })
  }

  return roads
}

/**
 * Generate synthetic sensor and incident locations
 */
export function generateGeoLocations(heightMap: TerrainHeightData): GeoLocation[] {
  const { width, height, data } = heightMap
  const locations: GeoLocation[] = []

  const sensors = 25
  const incidents = 8
  const hospitals = 4
  const settlements = 12

  // Generate sensors
  for (let i = 0; i < sensors; i++) {
    const x = Math.random() * width
    const z = Math.random() * height
    const idx = Math.floor(z) * width + Math.floor(x)
    locations.push({
      lat: 28 + (z / height) * 4,
      lon: 91 + (x / width) * 5,
      altitude: data[idx] || 1000,
      name: `Sensor-${i + 1}`,
      type: 'sensor',
    })
  }

  // Generate incidents
  for (let i = 0; i < incidents; i++) {
    const x = Math.random() * width
    const z = Math.random() * height
    const idx = Math.floor(z) * width + Math.floor(x)
    locations.push({
      lat: 28 + (z / height) * 4,
      lon: 91 + (x / width) * 5,
      altitude: data[idx] || 1000,
      name: `Incident-${i + 1}`,
      type: 'incident',
    })
  }

  // Generate hospitals
  for (let i = 0; i < hospitals; i++) {
    const x = Math.random() * width
    const z = Math.random() * height
    const idx = Math.floor(z) * width + Math.floor(x)
    locations.push({
      lat: 28 + (z / height) * 4,
      lon: 91 + (x / width) * 5,
      altitude: data[idx] || 1000,
      name: `Hospital-${i + 1}`,
      type: 'hospital',
    })
  }

  // Generate settlements
  for (let i = 0; i < settlements; i++) {
    const x = Math.random() * width
    const z = Math.random() * height
    const idx = Math.floor(z) * width + Math.floor(x)
    locations.push({
      lat: 28 + (z / height) * 4,
      lon: 91 + (x / width) * 5,
      altitude: data[idx] || 1000,
      name: `Settlement-${i + 1}`,
      type: 'settlement',
    })
  }

  return locations
}

/**
 * Generate synthetic rainfall data for timeline
 */
export function generateRainfallTimeseries(
  days: number = 30
): Array<{ timestamp: string; rainfall_mm: number; forecastRainfall_mm: number }> {
  const data: Array<{ timestamp: string; rainfall_mm: number; forecastRainfall_mm: number }> = []
  const now = new Date()

  for (let i = -days; i <= 3; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)

    // Past data
    if (i < 0) {
      const historical = 20 + Math.random() * 80 + Math.sin(i / 5) * 30
      data.push({
        timestamp: date.toISOString().split('T')[0],
        rainfall_mm: Math.max(0, historical),
        forecastRainfall_mm: 0,
      })
    }
    // Live/current day
    else if (i === 0) {
      data.push({
        timestamp: date.toISOString().split('T')[0],
        rainfall_mm: 45 + Math.random() * 40,
        forecastRainfall_mm: 50 + Math.random() * 35,
      })
    }
    // Forecast
    else {
      data.push({
        timestamp: date.toISOString().split('T')[0],
        rainfall_mm: 0,
        forecastRainfall_mm: 30 + Math.random() * 60,
      })
    }
  }

  return data
}

/**
 * Calculate color for risk/elevation visualization
 */
export function getTerrainColor(elevation: number, minElev: number, maxElev: number): { r: number; g: number; b: number } {
  const normalized = (elevation - minElev) / (maxElev - minElev)

  // Terrain color gradient: water -> green -> brown -> white
  if (normalized < 0.2) {
    // Water
    return { r: 0.2, g: 0.5, b: 0.8 }
  } else if (normalized < 0.4) {
    // Lowlands - green
    return { r: 0.2, g: 0.6, b: 0.3 }
  } else if (normalized < 0.6) {
    // Mid-elevation - brown
    const t = (normalized - 0.4) / 0.2
    return { r: 0.6 + t * 0.2, g: 0.4 + t * 0.1, b: 0.1 }
  } else if (normalized < 0.8) {
    // High elevation - tan
    return { r: 0.8, g: 0.7, b: 0.4 }
  } else {
    // Snow caps - white
    return { r: 0.95, g: 0.95, b: 0.95 }
  }
}

/**
 * Generate risk heatmap overlay
 */
export function generateRiskHeatmap(
  width: number = 64,
  height: number = 64
): Array<{ x: number; z: number; riskScore: number }> {
  const heatmap: Array<{ x: number; z: number; riskScore: number }> = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Create risk hotspots using noise
      const noise = generateNoise(x, y, 20, 3, 0.6, 2)
      const risk = Math.max(0, Math.min(100, (noise + 1) * 50))

      heatmap.push({
        x: (x / width) * 100,
        z: (y / height) * 100,
        riskScore: risk,
      })
    }
  }

  return heatmap
}
