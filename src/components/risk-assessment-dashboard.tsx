"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RiskAssessmentTable } from "@/components/risk-assessment-table"
import { RiskAssessmentForm } from "@/components/risk-assessment-form"
import { initialRiskAssessments } from "@/lib/data"
import { getRiskLevelLabel } from "@/lib/utils"
import type { RiskAssessment } from "@/lib/types"

export function RiskAssessmentDashboard() {
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>(initialRiskAssessments)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<RiskAssessment | null>(null)

  const filteredAssessments = riskAssessments.filter((assessment) => {
    const matchesSearch =
      assessment.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.threat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.vulnerability.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterCategory === "all") return matchesSearch
    
    // Convert the risk level to a label for comparison
    const riskLabel = getRiskLevelLabel(assessment.riskLevel).toLowerCase()
    return matchesSearch && riskLabel === filterCategory.toLowerCase()
  })

  const handleEdit = (assessment: RiskAssessment) => {
    setEditingAssessment(assessment)
    setShowForm(true)
  }

  const handleSave = (assessment: RiskAssessment) => {
    if (editingAssessment) {
      // Update existing assessment
      setRiskAssessments(riskAssessments.map((item) => (item.id === assessment.id ? assessment : item)))
    } else {
      // Add new assessment
      setRiskAssessments([
        ...riskAssessments,
        {
          ...assessment,
          id: `risk-${Date.now()}`,
        },
      ])
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setRiskAssessments(riskAssessments.filter((item) => item.id !== id))
  }

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Category",
        "Asset",
        "Threat",
        "Vulnerability",
        "Impact",
        "Likelihood",
        "Risk Level",
        "Existing Controls",
        "Treatment Plan",
        "Owner",
        "Priority",
        "Control Effectiveness"
      ],
      ...riskAssessments.map((item) => [
        item.id,
        item.category || "",
        item.asset,
        item.threat,
        item.vulnerability,
        item.impact,
        item.likelihood,
        item.riskLevel,
        item.existingControls,
        item.treatmentPlan,
        item.owner || "",
        item.priority || "",
        item.controlEffectiveness || ""
      ])
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `risk-assessment-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <RiskAssessmentForm initialData={editingAssessment} onSave={handleSave} onCancel={() => setShowForm(false)} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder="Search assets, threats, vulnerabilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80"
              />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={handleExport} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <RiskAssessmentTable assessments={filteredAssessments} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      )}
    </div>
  )
}

