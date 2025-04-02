"use client"

import { useRouter } from "next/navigation"
import { RiskAssessmentDashboard } from "@/components/Seccomply risk-assessment-dashboard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ISO 27001 Risk Assessment</h1>
        <Button onClick={() => router.push("/add-risk")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Risk
        </Button>
      </div>
      <RiskAssessmentDashboard />
    </main>
  )
}

