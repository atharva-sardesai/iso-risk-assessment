"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRiskLevelLabel } from "@/lib/utils"
import type { RiskAssessment } from "@/lib/types"
import { RISK_CATEGORIES, COMMON_ASSETS } from "@/lib/constants"
import { supabase, isSupabaseAvailable } from "@/lib/supabase"

interface RiskAssessmentFormProps {
  initialData?: RiskAssessment | null
  onSave?: (assessment: RiskAssessment) => void
  onCancel?: () => void
  companyId: string
}

export function RiskAssessmentForm({ initialData, onSave, onCancel, companyId }: RiskAssessmentFormProps) {
  const [formData, setFormData] = useState<Partial<RiskAssessment>>(
    initialData || {
      asset: "",
      threat: "",
      vulnerability: "",
      impact: 1,
      likelihood: 1,
      risk_level: 1,
      existing_controls: "",
      treatment_plan: "",
      owner: "",
      priority: "Medium",
      category: "Technical",
      control_effectiveness: "Partially Effective",
    }
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showOtherCategory, setShowOtherCategory] = useState(false)
  const [showOtherAsset, setShowOtherAsset] = useState(false)
  const [otherCategory, setOtherCategory] = useState("")
  const [otherAsset, setOtherAsset] = useState("")

  // Update risk level when impact or likelihood changes
  useEffect(() => {
    const impact = Number(formData.impact) || 1
    const likelihood = Number(formData.likelihood) || 1
    const riskLevel = impact * likelihood
    
    setFormData(prev => ({
      ...prev,
      risk_level: riskLevel
    }))
  }, [formData.impact, formData.likelihood])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    if (field === "category" && value === "Other") {
      setShowOtherCategory(true)
    } else if (field === "category") {
      setShowOtherCategory(false)
    }
    if (field === "asset" && value === "Other") {
      setShowOtherAsset(true)
    } else if (field === "asset") {
      setShowOtherAsset(false)
    }
    
    // Handle numeric fields
    if (field === "impact" || field === "likelihood") {
      setFormData((prev) => ({ ...prev, [field]: Number(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleOtherCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOtherCategory(value)
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleOtherAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOtherAsset(value)
    setFormData(prev => ({ ...prev, asset: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!isSupabaseAvailable()) {
        setError("Database connection is not available. Please check your environment configuration.")
        setIsSubmitting(false)
        return
      }

      // Validate required fields
      if (!formData.asset || !formData.threat || !formData.vulnerability) {
        setError("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      // Convert impact and likelihood to numbers
      const impact = Number(formData.impact) || 1
      const likelihood = Number(formData.likelihood) || 1
      
      // Calculate risk level
      const riskLevel = impact * likelihood

      // Prepare the data for submission
      const assessmentData = {
        ...formData,
        company_id: companyId,
        impact,
        likelihood,
        risk_level: riskLevel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("Submitting assessment data:", assessmentData)

      if (initialData?.id) {
        // Update existing assessment
        const { error } = await supabase!
          .from('risk_assessments')
          .update(assessmentData)
          .eq('id', initialData.id)

        if (error) {
          console.error("Error updating assessment:", error)
          setError(`Error updating assessment: ${error.message}`)
          setIsSubmitting(false)
          return
        }
      } else {
        // Create new assessment
        const { error } = await supabase!
          .from('risk_assessments')
          .insert([assessmentData])

        if (error) {
          console.error("Error creating assessment:", error)
          setError(`Error creating assessment: ${error.message}`)
          setIsSubmitting(false)
          return
        }
      }

      // Call the onSave callback if provided
      if (onSave) {
        onSave(assessmentData as RiskAssessment)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Edit Risk Assessment" : "New Risk Assessment"}</CardTitle>
          <CardDescription>
            {initialData ? "Update the details of this risk assessment" : "Add a new risk to your ISO 27001 assessment"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {showOtherCategory ? (
                <Input
                  id="category"
                  name="category"
                  value={otherCategory}
                  onChange={handleOtherCategoryChange}
                  placeholder="Enter category"
                />
              ) : (
                <Select 
                  value={formData.category || "Technical"} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_CATEGORIES.map((category) => (
                      <SelectItem key={`category-${category}`} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              {showOtherAsset ? (
                <Input
                  id="asset"
                  name="asset"
                  value={otherAsset}
                  onChange={handleOtherAssetChange}
                  placeholder="Enter asset"
                />
              ) : (
                <Select 
                  value={formData.asset || "Other"} 
                  onValueChange={(value) => handleSelectChange("asset", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_ASSETS.map((asset) => (
                      <SelectItem key={`asset-${asset}`} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="threat">Threat</Label>
              <Input
                id="threat"
                name="threat"
                value={formData.threat || ""}
                onChange={handleChange}
                placeholder="e.g., Unauthorized Access"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Risk Owner</Label>
              <Input
                id="owner"
                name="owner"
                value={formData.owner || ""}
                onChange={handleChange}
                placeholder="e.g., CISO, IT Manager"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vulnerability">Vulnerability</Label>
            <Textarea
              id="vulnerability"
              name="vulnerability"
              value={formData.vulnerability || ""}
              onChange={handleChange}
              placeholder="Describe the vulnerability in detail"
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="impact">Impact</Label>
              <Select 
                value={String(formData.impact || 1)} 
                onValueChange={(value) => handleSelectChange("impact", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="impact-1" value="1">1 - Negligible</SelectItem>
                  <SelectItem key="impact-2" value="2">2 - Minor</SelectItem>
                  <SelectItem key="impact-3" value="3">3 - Moderate</SelectItem>
                  <SelectItem key="impact-4" value="4">4 - Major</SelectItem>
                  <SelectItem key="impact-5" value="5">5 - Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="likelihood">Likelihood</Label>
              <Select 
                value={String(formData.likelihood || 1)} 
                onValueChange={(value) => handleSelectChange("likelihood", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select likelihood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="likelihood-1" value="1">1 - Rare</SelectItem>
                  <SelectItem key="likelihood-2" value="2">2 - Unlikely</SelectItem>
                  <SelectItem key="likelihood-3" value="3">3 - Possible</SelectItem>
                  <SelectItem key="likelihood-4" value="4">4 - Likely</SelectItem>
                  <SelectItem key="likelihood-5" value="5">5 - Almost Certain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk_level">Risk Level</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="risk_level" 
                  name="risk_level" 
                  value={formData.risk_level?.toFixed(2) || "1.00"} 
                  readOnly 
                  className="bg-muted" 
                />
                <span className="text-sm text-muted-foreground">
                  ({getRiskLevelLabel(formData.risk_level || 1)})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="existing_controls">Existing Controls</Label>
              <Textarea
                id="existing_controls"
                name="existing_controls"
                value={formData.existing_controls || ""}
                onChange={handleChange}
                placeholder="List any existing controls that mitigate this risk"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="control_effectiveness">Control Effectiveness</Label>
              <Select
                value={formData.control_effectiveness || "Partially Effective"}
                onValueChange={(value) => handleSelectChange("control_effectiveness", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select effectiveness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="effectiveness-not" value="Not Effective">Not Effective</SelectItem>
                  <SelectItem key="effectiveness-partial" value="Partially Effective">Partially Effective</SelectItem>
                  <SelectItem key="effectiveness-effective" value="Effective">Effective</SelectItem>
                  <SelectItem key="effectiveness-very" value="Very Effective">Very Effective</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment_plan">Treatment Plan</Label>
            <Textarea
              id="treatment_plan"
              name="treatment_plan"
              value={formData.treatment_plan || ""}
              onChange={handleChange}
              placeholder="Describe the plan to address this risk"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority || "Medium"} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="priority-low" value="Low">Low</SelectItem>
                  <SelectItem key="priority-medium" value="Medium">Medium</SelectItem>
                  <SelectItem key="priority-high" value="High">High</SelectItem>
                  <SelectItem key="priority-critical" value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (initialData ? "Update Risk" : "Add Risk")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

