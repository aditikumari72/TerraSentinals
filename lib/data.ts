// Synthetic demo data for the NER Landslide Intelligence command center.
// All values are prototype/synthetic and clearly labeled as such in the UI.

export const NER_STATES = [
  'Sikkim',
  'Assam',
  'Meghalaya',
  'Nagaland',
  'Mizoram',
  'Tripura',
  'Manipur',
  'Arunachal Pradesh',
] as const

export type ZoneStatus = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'

export interface RiskZone {
  id: string
  name: string
  state: string
  district: string
  score: number
  probability: number
  confidence: number
  population: number
  // normalized 0-100 position on the mock map
  x: number
  y: number
  factors: { label: string; value: number }[]
}

export const riskZones: RiskZone[] = [
  {
    id: 'east-sikkim',
    name: 'East Sikkim Demo Zone',
    state: 'Sikkim',
    district: 'Gangtok',
    score: 91,
    probability: 87,
    confidence: 91,
    population: 12400,
    x: 22,
    y: 30,
    factors: [
      { label: 'Heavy Rainfall', value: 31 },
      { label: 'Soil Moisture', value: 24 },
      { label: 'Steep Slope', value: 18 },
      { label: 'Historical Risk', value: 8 },
      { label: 'Satellite Anomaly', value: 6 },
    ],
  },
  {
    id: 'west-kameng',
    name: 'West Kameng Ridge',
    state: 'Arunachal Pradesh',
    district: 'Bomdila',
    score: 78,
    probability: 71,
    confidence: 84,
    population: 8600,
    x: 63,
    y: 22,
    factors: [
      { label: 'Heavy Rainfall', value: 26 },
      { label: 'Soil Moisture', value: 19 },
      { label: 'Steep Slope', value: 20 },
      { label: 'Historical Risk', value: 9 },
      { label: 'Satellite Anomaly', value: 4 },
    ],
  },
  {
    id: 'ri-bhoi',
    name: 'Ri-Bhoi Slopes',
    state: 'Meghalaya',
    district: 'Nongpoh',
    score: 66,
    probability: 58,
    confidence: 80,
    population: 15200,
    x: 38,
    y: 62,
    factors: [
      { label: 'Heavy Rainfall', value: 24 },
      { label: 'Soil Moisture', value: 18 },
      { label: 'Steep Slope', value: 14 },
      { label: 'Historical Risk', value: 7 },
      { label: 'Satellite Anomaly', value: 3 },
    ],
  },
  {
    id: 'dima-hasao',
    name: 'Dima Hasao Corridor',
    state: 'Assam',
    district: 'Haflong',
    score: 72,
    probability: 64,
    confidence: 82,
    population: 21800,
    x: 52,
    y: 55,
    factors: [
      { label: 'Heavy Rainfall', value: 25 },
      { label: 'Soil Moisture', value: 20 },
      { label: 'Steep Slope', value: 16 },
      { label: 'Historical Risk', value: 8 },
      { label: 'Satellite Anomaly', value: 3 },
    ],
  },
  {
    id: 'serchhip',
    name: 'Serchhip Hills',
    state: 'Mizoram',
    district: 'Serchhip',
    score: 54,
    probability: 47,
    confidence: 77,
    population: 9400,
    x: 60,
    y: 78,
    factors: [
      { label: 'Heavy Rainfall', value: 20 },
      { label: 'Soil Moisture', value: 15 },
      { label: 'Steep Slope', value: 12 },
      { label: 'Historical Risk', value: 5 },
      { label: 'Satellite Anomaly', value: 2 },
    ],
  },
  {
    id: 'senapati',
    name: 'Senapati Highlands',
    state: 'Manipur',
    district: 'Senapati',
    score: 44,
    probability: 39,
    confidence: 74,
    population: 11200,
    x: 74,
    y: 66,
    factors: [
      { label: 'Heavy Rainfall', value: 16 },
      { label: 'Soil Moisture', value: 13 },
      { label: 'Steep Slope', value: 10 },
      { label: 'Historical Risk', value: 4 },
      { label: 'Satellite Anomaly', value: 1 },
    ],
  },
  {
    id: 'phek',
    name: 'Phek Escarpment',
    state: 'Nagaland',
    district: 'Phek',
    score: 38,
    probability: 33,
    confidence: 72,
    population: 7300,
    x: 80,
    y: 50,
    factors: [
      { label: 'Heavy Rainfall', value: 14 },
      { label: 'Soil Moisture', value: 11 },
      { label: 'Steep Slope', value: 9 },
      { label: 'Historical Risk', value: 3 },
      { label: 'Satellite Anomaly', value: 1 },
    ],
  },
  {
    id: 'dhalai',
    name: 'Dhalai Basin',
    state: 'Tripura',
    district: 'Ambassa',
    score: 24,
    probability: 19,
    confidence: 70,
    population: 13600,
    x: 46,
    y: 88,
    factors: [
      { label: 'Heavy Rainfall', value: 9 },
      { label: 'Soil Moisture', value: 7 },
      { label: 'Steep Slope', value: 5 },
      { label: 'Historical Risk', value: 2 },
      { label: 'Satellite Anomaly', value: 1 },
    ],
  },
]

export interface Sensor {
  id: string
  x: number
  y: number
  status: 'online' | 'degraded' | 'offline'
  type: string
}

export const sensors: Sensor[] = [
  { id: 'SNS-014', x: 24, y: 33, status: 'online', type: 'Piezometer' },
  { id: 'SNS-021', x: 61, y: 25, status: 'online', type: 'Rain Gauge' },
  { id: 'SNS-033', x: 40, y: 60, status: 'degraded', type: 'Inclinometer' },
  { id: 'SNS-048', x: 54, y: 58, status: 'online', type: 'Soil Probe' },
  { id: 'SNS-052', x: 76, y: 64, status: 'offline', type: 'Rain Gauge' },
  { id: 'SNS-067', x: 58, y: 80, status: 'online', type: 'Piezometer' },
]

export interface MapIncident {
  id: string
  x: number
  y: number
  type: string
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE'
}

export const mapIncidents: MapIncident[] = [
  { id: 'i1', x: 26, y: 28, type: 'Landslide', severity: 'CRITICAL' },
  { id: 'i2', x: 50, y: 53, type: 'Road Blocked', severity: 'HIGH' },
  { id: 'i3', x: 36, y: 64, type: 'Rockfall', severity: 'MODERATE' },
]

export const hospitals = [
  { id: 'h1', x: 30, y: 40, name: 'Gangtok District Hospital' },
  { id: 'h2', x: 48, y: 68, name: 'Haflong Civil Hospital' },
  { id: 'h3', x: 70, y: 58, name: 'Senapati Health Center' },
]

export const roadBlocks = [
  { id: 'r1', x: 44, y: 48, name: 'NH-10 Landslide Debris' },
  { id: 'r2', x: 58, y: 46, name: 'SH-2 Washout' },
]

export interface Incident {
  id: string
  type: 'Slope Crack' | 'Road Blocked' | 'Rockfall' | 'Landslide' | 'Waterlogging'
  location: string
  time: string
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'
  status: 'NEW' | 'VERIFYING' | 'VERIFIED' | 'RESOLVED'
}

export const incidents: Incident[] = [
  { id: 'INC-2041', type: 'Landslide', location: 'Gangtok, East Sikkim', time: '2 min ago', severity: 'CRITICAL', status: 'VERIFYING' },
  { id: 'INC-2040', type: 'Road Blocked', location: 'NH-10, Rangpo', time: '11 min ago', severity: 'HIGH', status: 'VERIFIED' },
  { id: 'INC-2039', type: 'Slope Crack', location: 'Nongpoh, Ri-Bhoi', time: '24 min ago', severity: 'HIGH', status: 'NEW' },
  { id: 'INC-2038', type: 'Rockfall', location: 'Bomdila, West Kameng', time: '38 min ago', severity: 'MODERATE', status: 'VERIFIED' },
  { id: 'INC-2037', type: 'Waterlogging', location: 'Haflong, Dima Hasao', time: '52 min ago', severity: 'MODERATE', status: 'VERIFYING' },
  { id: 'INC-2036', type: 'Slope Crack', location: 'Serchhip, Mizoram', time: '1 hr ago', severity: 'LOW', status: 'RESOLVED' },
  { id: 'INC-2035', type: 'Landslide', location: 'Senapati, Manipur', time: '2 hr ago', severity: 'HIGH', status: 'RESOLVED' },
]

export interface CitizenReport {
  id: string
  hazard: string
  location: string
  confidence: number
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'
  status: string
  time: string
  reporter: string
}

export const citizenReports: CitizenReport[] = [
  { id: 'CR-881', hazard: 'Slope Crack', location: 'Ranipool, East Sikkim', confidence: 94, severity: 'HIGH', status: 'FIELD VERIFICATION REQUIRED', time: '4 min ago', reporter: 'Field Volunteer' },
  { id: 'CR-880', hazard: 'Road Debris', location: 'Singtam, East Sikkim', confidence: 88, severity: 'HIGH', status: 'AI VERIFIED', time: '9 min ago', reporter: 'Citizen' },
  { id: 'CR-879', hazard: 'Water Seepage', location: 'Rangpo, East Sikkim', confidence: 76, severity: 'MODERATE', status: 'CLUSTERING', time: '15 min ago', reporter: 'Citizen' },
  { id: 'CR-878', hazard: 'Slope Crack', location: 'Ranipool, East Sikkim', confidence: 91, severity: 'HIGH', status: 'AI VERIFIED', time: '21 min ago', reporter: 'Patrol Unit' },
  { id: 'CR-877', hazard: 'Fallen Boulder', location: 'Pakyong, East Sikkim', confidence: 82, severity: 'MODERATE', status: 'FIELD VERIFICATION REQUIRED', time: '33 min ago', reporter: 'Citizen' },
  { id: 'CR-876', hazard: 'Mud Flow', location: 'Rhenock, East Sikkim', confidence: 69, severity: 'MODERATE', status: 'CLUSTERING', time: '47 min ago', reporter: 'Citizen' },
  { id: 'CR-875', hazard: 'Slope Crack', location: 'Ranipool, East Sikkim', confidence: 79, severity: 'MODERATE', status: 'AI VERIFIED', time: '1 hr ago', reporter: 'Field Volunteer' },
]

// KPI cards for command center
export interface Kpi {
  label: string
  value: string
  trend: string
  trendUp: boolean
  status: 'critical' | 'high' | 'ok'
  spark: number[]
}

export const kpis: Kpi[] = [
  { label: 'Critical Zones', value: '12', trend: '+3', trendUp: true, status: 'critical', spark: [6, 7, 8, 8, 10, 11, 12] },
  { label: 'High Risk Zones', value: '27', trend: '+5', trendUp: true, status: 'high', spark: [20, 21, 23, 22, 25, 26, 27] },
  { label: 'Active Alerts', value: '8', trend: '+2', trendUp: true, status: 'critical', spark: [3, 4, 4, 5, 6, 7, 8] },
  { label: 'People At Risk', value: '42,680', trend: '+8.2K', trendUp: true, status: 'high', spark: [28, 31, 33, 36, 38, 41, 42] },
  { label: 'Blocked Roads', value: '14', trend: '+4', trendUp: true, status: 'high', spark: [7, 8, 9, 10, 11, 13, 14] },
  { label: 'Sensor Health', value: '94%', trend: '-1%', trendUp: false, status: 'ok', spark: [97, 96, 96, 95, 95, 94, 94] },
]

// Risk score over time (command center + trend page)
export const riskTrend = [
  { time: '06:00', risk: 48 },
  { time: '08:00', risk: 52 },
  { time: '10:00', risk: 61 },
  { time: '12:00', risk: 74 },
  { time: '14:00', risk: 87 },
  { time: '16:00', risk: 91 },
]

// Rainfall vs risk
export const rainfallVsRisk = [
  { time: '06:00', rainfall: 12, risk: 48 },
  { time: '08:00', rainfall: 18, risk: 52 },
  { time: '10:00', rainfall: 31, risk: 61 },
  { time: '12:00', rainfall: 52, risk: 74 },
  { time: '14:00', rainfall: 78, risk: 87 },
  { time: '16:00', rainfall: 95, risk: 91 },
]

export const weatherCards = [
  { label: 'Rain 1H', value: '18 mm', sub: 'Intense', tone: 'high' as const },
  { label: 'Rain 6H', value: '64 mm', sub: 'Heavy', tone: 'high' as const },
  { label: 'Rain 24H', value: '186 mm', sub: 'Extreme', tone: 'critical' as const },
  { label: 'Rain 72H', value: '412 mm', sub: 'Extreme', tone: 'critical' as const },
  { label: 'Soil Moisture', value: '82%', sub: 'Saturated', tone: 'critical' as const },
  { label: 'Temperature', value: '19°C', sub: 'Stable', tone: 'ok' as const },
  { label: 'Humidity', value: '96%', sub: 'Very High', tone: 'high' as const },
  { label: 'Wind', value: '24 km/h', sub: 'SW Gusts', tone: 'ok' as const },
]

export const rainForecast = [
  { window: 'Next 6 Hours', value: '58 mm', trend: 'Rising', tone: 'high' as const },
  { window: 'Next 24 Hours', value: '145 mm', trend: 'Extreme', tone: 'critical' as const },
]

// Analytics data
export const riskByState = NER_STATES.map((state, i) => ({
  state: state.length > 9 ? state.slice(0, 8) + '.' : state,
  fullState: state,
  risk: [91, 72, 66, 38, 54, 24, 44, 78][i],
}))

export const incidentTrend = [
  { day: 'Mon', incidents: 8, resolved: 6 },
  { day: 'Tue', incidents: 12, resolved: 9 },
  { day: 'Wed', incidents: 10, resolved: 8 },
  { day: 'Thu', incidents: 18, resolved: 11 },
  { day: 'Fri', incidents: 24, resolved: 14 },
  { day: 'Sat', incidents: 31, resolved: 19 },
  { day: 'Sun', incidents: 27, resolved: 22 },
]

export const populationExposure = NER_STATES.map((state, i) => ({
  state: state.length > 9 ? state.slice(0, 8) + '.' : state,
  people: [42680, 21800, 15200, 7300, 9400, 13600, 11200, 8600][i],
}))

export const roadBlockageTrend = [
  { day: 'Mon', blocked: 4 },
  { day: 'Tue', blocked: 6 },
  { day: 'Wed', blocked: 5 },
  { day: 'Thu', blocked: 9 },
  { day: 'Fri', blocked: 11 },
  { day: 'Sat', blocked: 13 },
  { day: 'Sun', blocked: 14 },
]

export const sensorHealthTrend = [
  { day: 'Mon', health: 97 },
  { day: 'Tue', health: 96 },
  { day: 'Wed', health: 96 },
  { day: 'Thu', health: 95 },
  { day: 'Fri', health: 95 },
  { day: 'Sat', health: 94 },
  { day: 'Sun', health: 94 },
]

export const alertFrequency = [
  { day: 'Mon', alerts: 2 },
  { day: 'Tue', alerts: 3 },
  { day: 'Wed', alerts: 4 },
  { day: 'Thu', alerts: 5 },
  { day: 'Fri', alerts: 6 },
  { day: 'Sat', alerts: 7 },
  { day: 'Sun', alerts: 8 },
]
