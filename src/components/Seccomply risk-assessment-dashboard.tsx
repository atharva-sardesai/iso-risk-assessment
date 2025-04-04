"use client"

import { RiskAssessmentDashboard as RAD } from "@/components/risk-assessment-dashboard"

export const RiskAssessmentDashboard = ({ companyId }: { companyId: string }) => {
  return <RAD companyId={companyId} />
}

