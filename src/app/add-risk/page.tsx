"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { RiskAssessmentForm } from "@/components/risk-assessment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { RiskAssessment } from "@/lib/types"

export default function AddRiskPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const companyId = searchParams.get('companyId')

  if (!companyId) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>No company ID provided. Please select a company first.</p>
        </div>
      </div>
    )
  }

  const handleSave = (assessment: RiskAssessment) => {
    // Navigate to the company's risk assessment page
    router.push(`/companies/${companyId}/risks`)
  }

  const handleCancel = () => {
    // Navigate back to the company's risk assessment page
    router.push(`/companies/${companyId}/risks`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/companies/${companyId}/risks`)}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Risk Assessment</h1>
      </div>
      
      <RiskAssessmentForm
        initialData={null}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
} 