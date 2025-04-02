export interface RiskAssessment {
  id: string
  companyName?: string
  asset: string
  threat: string
  vulnerability: string
  impact: number
  likelihood: number
  riskLevel: number
  existingControls: string
  treatmentPlan: string
  owner?: string
  priority?: string
  category?: string
  controlEffectiveness?: string
}

