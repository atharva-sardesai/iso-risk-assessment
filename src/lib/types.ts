export interface Company {
  id: string
  name: string
  created_at: string
}

export interface RiskAssessment {
  id: string
  company_id: string
  asset: string
  threat: string
  vulnerability: string
  impact: number
  likelihood: number
  risk_level: number
  existing_controls: string
  treatment_plan: string
  owner?: string
  priority?: string
  category?: string
  control_effectiveness?: string
  created_at: string
  updated_at: string
}

