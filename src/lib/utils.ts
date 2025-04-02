import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateRiskLevel(impact: number, likelihood: number): number {
  // Convert likelihood from percentage (0-100) to decimal (0-1)
  const likelihoodDecimal = likelihood / 100
  return impact * likelihoodDecimal
}

export function getRiskLevelLabel(riskScore: number): string {
  if (riskScore >= 8) return "Critical"
  if (riskScore >= 6) return "High"
  if (riskScore >= 4) return "Medium"
  return "Low"
}

