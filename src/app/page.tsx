"use client"

import { useState } from 'react'
import { Company } from '@/lib/types'
import { CompanySelector } from '@/components/company-selector'
import { RiskAssessmentDashboard } from '@/components/risk-assessment-dashboard'

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  if (!selectedCompany) {
    return <CompanySelector onCompanySelect={setSelectedCompany} />
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Risk Assessment Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Company: {selectedCompany.name}
          </span>
          <button
            onClick={() => setSelectedCompany(null)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Change Company
          </button>
        </div>
      </div>
      <RiskAssessmentDashboard companyId={selectedCompany.id} />
    </main>
  )
}

