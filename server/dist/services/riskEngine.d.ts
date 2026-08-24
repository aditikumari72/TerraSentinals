/**
 * AI Risk Engine
 * Calculates landslide risk based on multiple factors
 */
export interface RiskInput {
    rainfall: number;
    soilMoisture: number;
    slope: number;
    elevation: number;
    historicalRisk: number;
    satelliteAnomaly: number;
}
export interface RiskOutput {
    riskScore: number;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    probability: number;
    confidence: number;
    factors: Array<{
        label: string;
        value: number;
        weight: number;
    }>;
    recommendation: string;
}
declare class RiskEngine {
    /**
     * Calculate risk score based on multiple factors
     * Risk Levels:
     * 0-30: LOW
     * 31-60: MODERATE
     * 61-80: HIGH
     * 81-100: CRITICAL
     */
    calculateRisk(input: RiskInput): RiskOutput;
    private validateInputs;
    private calculateRainfallScore;
    private calculateMoistureScore;
    private calculateSlopeScore;
    private calculateElevationScore;
    private calculateProbability;
    private calculateConfidence;
    private getRiskLevel;
    private generateRecommendation;
    /**
     * Simulate disaster scenario progression
     */
    simulateDisasterProgression(initialInput: RiskInput, rainfallIncrease: number, steps?: number): Array<RiskOutput & {
        step: number;
    }>;
}
export declare const riskEngine: RiskEngine;
export {};
//# sourceMappingURL=riskEngine.d.ts.map