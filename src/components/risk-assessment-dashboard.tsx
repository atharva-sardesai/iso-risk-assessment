"use client"

import { useEffect, useState, useCallback } from 'react'
import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RiskAssessmentTable } from "@/components/risk-assessment-table"
import { RiskAssessmentForm } from "@/components/risk-assessment-form"
import { getRiskLevelLabel } from "@/lib/utils"
import type { RiskAssessment } from "@/lib/types"
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

interface RiskAssessmentDashboardProps {
  companyId: string
}

export function RiskAssessmentDashboard({ companyId }: RiskAssessmentDashboardProps) {
  const [risks, setRisks] = useState<RiskAssessment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<RiskAssessment | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchRisks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!isSupabaseAvailable()) {
        setError("Database connection is not available. Please check your environment configuration.")
        setRisks([])
        return
      }
      
      const { data, error } = await supabase!
        .from('risk_assessments')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRisks(data || [])
    } catch (error) {
      console.error('Error fetching risks:', error)
      setError("Failed to fetch risk assessments. Please try again later.")
      setRisks([])
    } finally {
      setIsLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    if (companyId) {
      fetchRisks()
    }
  }, [companyId, fetchRisks])

  const filteredAssessments = risks.filter((assessment) => {
    const matchesSearch =
      assessment.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.threat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.vulnerability.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterCategory === "all") return matchesSearch
    
    // Convert the risk level to a label for comparison
    const riskLabel = getRiskLevelLabel(assessment.risk_level).toLowerCase()
    return matchesSearch && riskLabel === filterCategory.toLowerCase()
  })

  const handleEdit = (assessment: RiskAssessment) => {
    setEditingAssessment(assessment)
    setShowForm(true)
  }

  const handleSave = async (assessment: RiskAssessment) => {
    try {
      if (!isSupabaseAvailable()) {
        setError("Database connection is not available. Please check your environment configuration.")
        return
      }
      
      if (editingAssessment) {
        // Update existing assessment
        const { error } = await supabase!
          .from('risk_assessments')
          .update(assessment)
          .eq('id', editingAssessment.id)

        if (error) throw error
      } else {
        // Create new assessment
        const { error } = await supabase!
          .from('risk_assessments')
          .insert([{ ...assessment, company_id: companyId }])

        if (error) throw error
      }

      // Refresh the risks list
      await fetchRisks()
      
      // Reset form state
      setShowForm(false)
      setEditingAssessment(null)
    } catch (error) {
      console.error('Error saving risk assessment:', error)
      setError("Failed to save risk assessment. Please try again later.")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (!isSupabaseAvailable()) {
        setError("Database connection is not available. Please check your environment configuration.")
        return
      }
      
      const { error } = await supabase!
        .from('risk_assessments')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh the risks list
      await fetchRisks()
    } catch (error) {
      console.error('Error deleting risk assessment:', error)
      setError("Failed to delete risk assessment. Please try again later.")
    }
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
      ...risks.map((item) => [
        item.id,
        item.category || "",
        item.asset,
        item.threat,
        item.vulnerability,
        item.impact,
        item.likelihood,
        item.risk_level,
        item.existing_controls,
        item.treatment_plan,
        item.owner || "",
        item.priority || "",
        item.control_effectiveness || ""
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading risks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Risk
        </Button>
      </div>
      {showForm ? (
        <RiskAssessmentForm 
          initialData={editingAssessment} 
          onSave={handleSave} 
          onCancel={() => setShowForm(false)} 
          companyId={companyId}
        />
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

          <RiskAssessmentTable 
            risks={filteredAssessments} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  )
}

