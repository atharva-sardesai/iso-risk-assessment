"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateRiskLevel, getRiskLevelLabel } from "@/lib/utils"
import type { RiskAssessment } from "@/lib/types"

interface RiskAssessmentFormProps {
  initialData?: RiskAssessment | null
  onSave: (data: RiskAssessment) => void
  onCancel: () => void
}

export function RiskAssessmentForm({ initialData, onSave, onCancel }: RiskAssessmentFormProps) {
  const [formData, setFormData] = useState<RiskAssessment>({
    id: initialData?.id || "",
    asset: initialData?.asset || "",
    threat: initialData?.threat || "",
    vulnerability: initialData?.vulnerability || "",
    impact: initialData?.impact || 1,
    likelihood: initialData?.likelihood || 0,
    riskLevel: initialData?.riskLevel || 0,
    existingControls: initialData?.existingControls || "",
    treatmentPlan: initialData?.treatmentPlan || "",
    owner: initialData?.owner || "",
    priority: initialData?.priority || "",
    category: initialData?.category || "",
    controlEffectiveness: initialData?.controlEffectiveness || "",
  })

  // Update risk level when impact or likelihood changes
  useEffect(() => {
    const riskLevel = calculateRiskLevel(formData.impact, formData.likelihood)
    setFormData((prev) => ({ ...prev, riskLevel }))
  }, [formData.impact, formData.likelihood])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
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
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Access Control, Network Security"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Input
                id="asset"
                name="asset"
                value={formData.asset}
                onChange={handleChange}
                placeholder="e.g., Customer Database"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="threat">Threat</Label>
              <Input
                id="threat"
                name="threat"
                value={formData.threat}
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
              value={formData.vulnerability}
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
                value={formData.impact.toString()} 
                onValueChange={(value) => handleSelectChange("impact", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact (1-10)" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="likelihood">Likelihood</Label>
              <Select 
                value={formData.likelihood.toString()} 
                onValueChange={(value) => handleSelectChange("likelihood", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select likelihood (0-100%)" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Score</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="riskLevel" 
                  name="riskLevel" 
                  value={formData.riskLevel.toFixed(2)} 
                  readOnly 
                  className="bg-muted" 
                />
                <span className="text-sm text-muted-foreground">
                  ({getRiskLevelLabel(formData.riskLevel)})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="existingControls">Existing Controls</Label>
              <Textarea
                id="existingControls"
                name="existingControls"
                value={formData.existingControls}
                onChange={handleChange}
                placeholder="List any existing controls that mitigate this risk"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="controlEffectiveness">Control Effectiveness</Label>
              <Select
                value={formData.controlEffectiveness || ""}
                onValueChange={(value) => handleSelectChange("controlEffectiveness", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select effectiveness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Set">Not Set</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatmentPlan">Treatment Plan</Label>
            <Textarea
              id="treatmentPlan"
              name="treatmentPlan"
              value={formData.treatmentPlan}
              onChange={handleChange}
              placeholder="Describe the plan to address this risk"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority || ""} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Set">Not Set</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update Risk" : "Add Risk"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

