"use client"

import { useRouter } from "next/navigation"
import { RiskAssessmentForm } from "@/components/risk-assessment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { RiskAssessment } from "@/lib/types"

export default function AddRiskPage() {
  const router = useRouter()

  const handleSave = (assessment: RiskAssessment) => {
    // TODO: Implement save functionality
    console.log("Saving assessment:", assessment)
    router.push("/") // Navigate back to home after saving
  }

  const handleCancel = () => {
    router.push("/") // Navigate back to home on cancel
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
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