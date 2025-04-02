"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { RiskAssessment } from "@/lib/types"

interface RiskDetailsDialogProps {
  risk: RiskAssessment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RiskDetailsDialog({ risk, open, onOpenChange }: RiskDetailsDialogProps) {
  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Risk Assessment Details</span>
            <Badge variant={getRiskBadgeVariant(risk.riskLevel)}>{risk.riskLevel}</Badge>
          </DialogTitle>
          <DialogDescription>Complete details of the selected risk assessment</DialogDescription>
        </DialogHeader>

        {risk.companyName && (
          <div className="py-2 border-b mb-4">
            <h2 className="text-lg font-semibold">{risk.companyName}</h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {risk.category && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Category</h3>
              <p>{risk.category}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Asset</h3>
            <p>{risk.asset}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Threat</h3>
            <p>{risk.threat}</p>
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Vulnerability</h3>
            <p>{risk.vulnerability}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Impact</h3>
            <p>{risk.impact}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Likelihood</h3>
            <p>{risk.likelihood}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Existing Controls</h3>
            <p>{risk.existingControls}</p>
          </div>

          {risk.controlEffectiveness && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Control Effectiveness</h3>
              <p>{risk.controlEffectiveness}</p>
            </div>
          )}

          <div className="space-y-2 col-span-1 md:col-span-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Treatment Plan</h3>
            <p>{risk.treatmentPlan}</p>
          </div>

          {risk.owner && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Risk Owner</h3>
              <p>{risk.owner}</p>
            </div>
          )}

          {risk.priority && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Priority</h3>
              <p>{risk.priority}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

