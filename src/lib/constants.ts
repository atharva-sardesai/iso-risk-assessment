export const RISK_CATEGORIES = [
  "Access Control",
  "Asset Management",
  "Business Continuity",
  "Change Management",
  "Cryptography",
  "Data Protection",
  "Identity Management",
  "Incident Management",
  "Network Security",
  "Operations Security",
  "Physical Security",
  "Security Architecture",
  "Security Monitoring",
  "Software Development",
  "Supplier Management",
  "Other"
]

export const COMMON_ASSETS = [
  "Customer Database",
  "Employee Data",
  "Financial Systems",
  "Intellectual Property",
  "Network Infrastructure",
  "Physical Infrastructure",
  "Production Systems",
  "Source Code",
  "User Access Credentials",
  "Web Applications",
  "Other"
]

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