"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { RiskAssessment } from "@/lib/types"
import { getRiskLevelLabel } from "@/lib/utils"

interface RiskDetailsDialogProps {
  risk: RiskAssessment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RiskDetailsDialog({ risk, open, onOpenChange }: RiskDetailsDialogProps) {
  const getRiskBadgeVariant = (riskLevel: number) => {
    const label = getRiskLevelLabel(riskLevel)
    switch (label.toLowerCase()) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
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
            <Badge variant={getRiskBadgeVariant(risk.risk_level)}>
              {getRiskLevelLabel(risk.risk_level)}
            </Badge>
          </DialogTitle>
          <DialogDescription>Complete details of the selected risk assessment</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {risk.category && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Category</h3>
              <p>{risk.category}</p>
            </div>
          )}

          {risk.asset && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Asset</h3>
              <p>{risk.asset}</p>
            </div>
          )}

          {risk.threat && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Threat</h3>
              <p>{risk.threat}</p>
            </div>
          )}

          {risk.vulnerability && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Vulnerability</h3>
              <p>{risk.vulnerability}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Impact</h3>
            <p>{risk.impact}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Likelihood</h3>
            <p>{risk.likelihood}</p>
          </div>

          {risk.existing_controls && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Existing Controls</h3>
              <p>{risk.existing_controls}</p>
            </div>
          )}

          {risk.treatment_plan && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Treatment Plan</h3>
              <p>{risk.treatment_plan}</p>
            </div>
          )}

          {risk.owner && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Owner</h3>
              <p>{risk.owner}</p>
            </div>
          )}

          {risk.priority && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Priority</h3>
              <p>{risk.priority}</p>
            </div>
          )}

          {risk.control_effectiveness && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Control Effectiveness</h3>
              <p>{risk.control_effectiveness}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

