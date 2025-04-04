import type { RiskAssessment } from "./types"

export const initialRiskAssessments: RiskAssessment[] = [
  {
    id: "risk-1",
    company_id: "company-1",
    category: "Access Control",
    asset: "Customer Database",
    threat: "Unauthorized Access",
    vulnerability: "Weak password policies allowing brute force attacks",
    impact: 8,
    likelihood: 50,
    risk_level: 4,
    existing_controls: "Basic password requirements, account lockout after 5 failed attempts",
    treatment_plan: "Implement MFA, password complexity requirements, and regular password rotation",
    owner: "Security Team",
    priority: "High",
    control_effectiveness: "Medium",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

