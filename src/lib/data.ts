import type { RiskAssessment } from "./types"

export const initialRiskAssessments: RiskAssessment[] = [
  {
    id: "risk-1",
    category: "Access Control",
    asset: "Customer Database",
    threat: "Unauthorized Access",
    vulnerability: "Weak password policies allowing brute force attacks",
    impact: 8,
    likelihood: 50,
    riskLevel: 4,
    existingControls: "Basic password requirements, account lockout after 5 failed attempts",
    treatmentPlan: "Implement MFA, password complexity requirements, and regular password rotation",
    owner: "Security Team",
    priority: "High",
    controlEffectiveness: "Medium",
  }
]

