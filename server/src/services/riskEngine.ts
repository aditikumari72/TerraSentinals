/**
 * AI Risk Engine
 * Calculates landslide risk based on multiple factors
 */

export interface RiskInput {
  rainfall: number // mm (0-200)
  soilMoisture: number // % (0-100)
  slope: number // degrees (0-90)
  elevation: number // meters
  historicalRisk: number // % (0-100)
  satelliteAnomaly: number // % (0-100)
}

export interface RiskOutput {
  riskScore: number // 0-100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  probability: number // 0-100 (likelihood of landslide)
  confidence: number // 0-100 (confidence in the prediction)
  factors: Array<{
    label: string
    value: number
    weight: number
  }>
  recommendation: string
}

class RiskEngine {
  /**
   * Calculate risk score based on multiple factors
   * Risk Levels:
   * 0-30: LOW
   * 31-60: MODERATE
   * 61-80: HIGH
   * 81-100: CRITICAL
   */
  calculateRisk(input: RiskInput): RiskOutput {
    // Validate inputs
    const validatedInput = this.validateInputs(input)

    // Calculate individual factor scores (0-100)
    const rainfallScore = this.calculateRainfallScore(validatedInput.rainfall)
    const moistureScore = this.calculateMoistureScore(validatedInput.soilMoisture)
    const slopeScore = this.calculateSlopeScore(validatedInput.slope)
    const elevationScore = this.calculateElevationScore(validatedInput.elevation)
    const historicalScore = validatedInput.historicalRisk
    const satelliteScore = validatedInput.satelliteAnomaly

    // Define weights for each factor (should sum to 1.0)
    const weights = {
      rainfall: 0.25,
      moisture: 0.20,
      slope: 0.18,
      elevation: 0.12,
      historical: 0.15,
      satellite: 0.10,
    }

    // Calculate weighted risk score
    const riskScore =
      rainfallScore * weights.rainfall +
      moistureScore * weights.moisture +
      slopeScore * weights.slope +
      elevationScore * weights.elevation +
      historicalScore * weights.historical +
      satelliteScore * weights.satellite

    // Determine risk level
    const riskLevel = this.getRiskLevel(riskScore)

    // Calculate probability of landslide
    const probability = this.calculateProbability(riskScore, validatedInput)

    // Calculate confidence
    const confidence = this.calculateConfidence(validatedInput, riskScore)

    // Generate factors array for display
    const factors = [
      { label: 'Heavy Rainfall', value: rainfallScore, weight: weights.rainfall },
      { label: 'Soil Moisture', value: moistureScore, weight: weights.moisture },
      { label: 'Steep Slope', value: slopeScore, weight: weights.slope },
      { label: 'High Elevation', value: elevationScore, weight: weights.elevation },
      { label: 'Historical Risk', value: historicalScore, weight: weights.historical },
      { label: 'Satellite Anomaly', value: satelliteScore, weight: weights.satellite },
    ]

    // Generate recommendation
    const recommendation = this.generateRecommendation(riskLevel, validatedInput)

    return {
      riskScore: Math.round(riskScore * 100) / 100,
      riskLevel,
      probability: Math.round(probability * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      factors,
      recommendation,
    }
  }

  private validateInputs(input: RiskInput): RiskInput {
    return {
      rainfall: Math.max(0, Math.min(200, input.rainfall || 0)),
      soilMoisture: Math.max(0, Math.min(100, input.soilMoisture || 0)),
      slope: Math.max(0, Math.min(90, input.slope || 0)),
      elevation: Math.max(0, input.elevation || 0),
      historicalRisk: Math.max(0, Math.min(100, input.historicalRisk || 0)),
      satelliteAnomaly: Math.max(0, Math.min(100, input.satelliteAnomaly || 0)),
    }
  }

  private calculateRainfallScore(rainfall: number): number {
    // Rainfall risk increases exponentially
    // 0mm = 0%, 50mm = 30%, 100mm = 60%, 150mm = 85%, 200mm = 100%
    if (rainfall < 20) return 0
    if (rainfall < 50) return (rainfall - 20) * 1.2
    if (rainfall < 100) return 36 + (rainfall - 50) * 0.48
    if (rainfall < 150) return 60 + (rainfall - 100) * 0.5
    return 85 + Math.min((rainfall - 150) * 0.3, 15)
  }

  private calculateMoistureScore(moisture: number): number {
    // Soil moisture risk increases with moisture content
    // 0% = 0%, 30% = 10%, 60% = 50%, 80% = 80%, 100% = 100%
    if (moisture < 30) return moisture * 0.33
    if (moisture < 60) return 10 + (moisture - 30) * 1.33
    if (moisture < 80) return 50 + (moisture - 60) * 1.5
    return 80 + (moisture - 80) * 1
  }

  private calculateSlopeScore(slope: number): number {
    // Slope risk increases dramatically at steeper angles
    // 0° = 0%, 15° = 20%, 30° = 45%, 45° = 75%, 60° = 95%, 90° = 100%
    if (slope < 15) return slope * 1.33
    if (slope < 30) return 20 + (slope - 15) * 1.67
    if (slope < 45) return 45 + (slope - 30) * 2
    if (slope < 60) return 75 + (slope - 45) * 1.33
    return 95 + Math.min((slope - 60) * 0.83, 5)
  }

  private calculateElevationScore(elevation: number): number {
    // Higher elevations in mountainous regions have different risks
    // Mountain regions (>1500m) have higher baseline risk
    // 0m = 5%, 1000m = 25%, 1500m = 40%, 2500m = 60%, 3500m = 75%
    if (elevation < 500) return 5
    if (elevation < 1000) return 5 + (elevation - 0) * 0.04
    if (elevation < 1500) return 25 + (elevation - 1000) * 0.03
    if (elevation < 2500) return 40 + (elevation - 1500) * 0.02
    return 60 + Math.min((elevation - 2500) * 0.005, 15)
  }

  private calculateProbability(riskScore: number, input: RiskInput): number {
    // Probability increases with risk score and certain triggering conditions
    let baseProbability = riskScore * 0.8
    let adjustedProbability = baseProbability

    // Recent rainfall increases probability significantly
    if (input.rainfall > 100) {
      adjustedProbability += 15
    } else if (input.rainfall > 50) {
      adjustedProbability += 8
    }

    // High soil moisture combined with steep slope increases probability
    if (input.soilMoisture > 70 && input.slope > 30) {
      adjustedProbability += 10
    }

    // Satellite anomaly is a strong indicator
    if (input.satelliteAnomaly > 50) {
      adjustedProbability += 12
    }

    return Math.min(adjustedProbability, 100)
  }

  private calculateConfidence(input: RiskInput, riskScore: number): number {
    // Confidence increases with data quality and consistency
    let confidence = 50 // Base confidence

    // More data points increase confidence
    const dataPoints = [
      input.rainfall > 0,
      input.soilMoisture > 0,
      input.slope > 0,
      input.elevation > 0,
      input.historicalRisk > 0,
      input.satelliteAnomaly > 0,
    ].filter(Boolean).length

    confidence += dataPoints * 5

    // Extreme scores (very low or very high) have higher confidence
    if (riskScore < 20 || riskScore > 80) {
      confidence += 10
    }

    // Recent rainfall data increases confidence
    if (input.rainfall > 10) {
      confidence += 5
    }

    return Math.min(confidence, 100)
  }

  private getRiskLevel(score: number): 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
    if (score <= 30) return 'LOW'
    if (score <= 60) return 'MODERATE'
    if (score <= 80) return 'HIGH'
    return 'CRITICAL'
  }

  private generateRecommendation(riskLevel: string, _input: RiskInput): string {
    switch (riskLevel) {
      case 'LOW':
        return 'Conditions are stable. Continue routine monitoring and maintain early warning systems.'
      case 'MODERATE':
        return 'Conditions are concerning. Increase monitoring frequency and prepare contingency plans. Alert community leaders.'
      case 'HIGH':
        return 'Conditions are critical. Activate emergency response protocols. Consider pre-evacuation of vulnerable areas.'
      case 'CRITICAL':
        return 'Immediate action required. Begin evacuation immediately. Deploy emergency response teams. Establish relief centers.'
      default:
        return 'Monitor conditions closely'
    }
  }

  /**
   * Simulate disaster scenario progression
   */
  simulateDisasterProgression(
    initialInput: RiskInput,
    rainfallIncrease: number,
    steps: number = 5
  ): Array<RiskOutput & { step: number }> {
    const results = []
    let currentInput = { ...initialInput }

    for (let i = 0; i <= steps; i++) {
      const riskOutput = this.calculateRisk(currentInput)
      results.push({
        ...riskOutput,
        step: i,
      })

      // Increase rainfall for next step
      currentInput.rainfall += rainfallIncrease
      // Increase soil moisture due to rainfall
      currentInput.soilMoisture = Math.min(100, currentInput.soilMoisture + rainfallIncrease * 0.2)
      // Slightly increase satellite anomaly if risk is high
      if (riskOutput.riskScore > 60) {
        currentInput.satelliteAnomaly = Math.min(100, currentInput.satelliteAnomaly + rainfallIncrease * 0.15)
      }
    }

    return results
  }
}

export const riskEngine = new RiskEngine()
