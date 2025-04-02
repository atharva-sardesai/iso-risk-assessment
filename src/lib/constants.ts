export const ISO_RISK_CATEGORIES = [
  "Access Control",
  "Asset Management",
  "Business Continuity",
  "Cryptography",
  "Human Resources Security",
  "Information Security Policies",
  "Network Security",
  "Operations Security",
  "Physical Security",
  "Software Development Security",
  "Supplier Relationships",
  "System Acquisition and Maintenance",
  "Third Party Management",
  "Vulnerability Management",
  "Other"
] as const

export type IsoRiskCategory = typeof ISO_RISK_CATEGORIES[number] 