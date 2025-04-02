"use client"

import { useState, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { RiskAssessment } from "@/lib/types"
import { RiskDetailsDialog } from "@/components/risk-details-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRiskLevelLabel } from "@/lib/utils"

interface RiskAssessmentTableProps {
  assessments: RiskAssessment[]
  onEdit: (assessment: RiskAssessment) => void
  onDelete: (id: string) => void
}

export function RiskAssessmentTable({ assessments, onEdit, onDelete }: RiskAssessmentTableProps) {
  const [sortField, setSortField] = useState<keyof RiskAssessment>("riskLevel")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedRisk, setSelectedRisk] = useState<RiskAssessment | null>(null)
  const [filters, setFilters] = useState<Partial<Record<keyof RiskAssessment, string>>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const handleSort = (field: keyof RiskAssessment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleFilter = (field: keyof RiskAssessment, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === "all" ? undefined : value
    }))
  }

  const getUniqueValues = (field: keyof RiskAssessment) => {
    const values = new Set(assessments.map(a => {
      const value = a[field]
      return value !== undefined && value !== null ? String(value) : undefined
    }))
    return Array.from(values).filter(Boolean) as string[]
  }

  const filteredAssessments = assessments.filter(assessment => {
    return Object.entries(filters).every(([field, value]) => {
      if (!value) return true
      const assessmentValue = assessment[field as keyof RiskAssessment]
      if (assessmentValue === undefined || assessmentValue === null) return false
      return String(assessmentValue).toLowerCase() === value.toLowerCase()
    })
  })

  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    if (aValue === undefined || bValue === undefined) return 0
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

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

  const renderColumnHeader = (field: keyof RiskAssessment, label: string, filterable = false) => {
    const uniqueValues = filterable ? getUniqueValues(field) : []
    
    return (
      <TableHead>
        <div className="flex items-center gap-2">
          <div className="cursor-pointer flex-1" onClick={() => handleSort(field)}>
            {label}
            {sortField === field && (
              sortDirection === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4 inline" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              )
            )}
          </div>
          {filterable && uniqueValues.length > 0 && (
            <Select value={filters[field] || "all"} onValueChange={(value) => handleFilter(field, value)}>
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </TableHead>
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (tableContainerRef.current?.offsetLeft || 0))
    setStartY(e.pageY - (tableContainerRef.current?.offsetTop || 0))
    setScrollLeft(tableContainerRef.current?.scrollLeft || 0)
    setScrollTop(tableContainerRef.current?.scrollTop || 0)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    
    if (tableContainerRef.current) {
      const x = e.pageX - (tableContainerRef.current.offsetLeft || 0)
      const y = e.pageY - (tableContainerRef.current.offsetTop || 0)
      const walkX = (x - startX) * 1.5 // Multiply by 1.5 to make scrolling faster
      const walkY = (y - startY) * 1.5

      tableContainerRef.current.scrollLeft = scrollLeft - walkX
      tableContainerRef.current.scrollTop = scrollTop - walkY
    }
  }

  return (
    <div className="w-full">
      <div className="relative rounded-md border">
        <div 
          ref={tableContainerRef}
          className="overflow-auto scrollbar-visible cursor-grab active:cursor-grabbing"
          style={{ 
            paddingBottom: '1rem',
            maxHeight: '70vh', // Add a max height to enable vertical scrolling
            userSelect: isDragging ? 'none' : 'auto' // Prevent text selection while dragging
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <Table>
            <TableHeader className="bg-background">
              <TableRow>
                {renderColumnHeader("companyName", "Company", true)}
                {renderColumnHeader("category", "Category", true)}
                {renderColumnHeader("asset", "Asset", true)}
                {renderColumnHeader("threat", "Threat", true)}
                {renderColumnHeader("vulnerability", "Vulnerability")}
                {renderColumnHeader("impact", "Impact", true)}
                {renderColumnHeader("likelihood", "Likelihood", true)}
                {renderColumnHeader("riskLevel", "Risk Level", true)}
                <TableHead className="hidden lg:table-cell">Controls</TableHead>
                <TableHead className="text-right sticky right-0 bg-background">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No risk assessments found. Add a new risk assessment to get started.
                  </TableCell>
                </TableRow>
              ) : (
                sortedAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>{assessment.companyName || "—"}</TableCell>
                    <TableCell>{assessment.category || "—"}</TableCell>
                    <TableCell className="font-medium">{assessment.asset}</TableCell>
                    <TableCell>{assessment.threat}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {assessment.vulnerability.length > 50
                        ? `${assessment.vulnerability.substring(0, 50)}...`
                        : assessment.vulnerability}
                    </TableCell>
                    <TableCell>{String(assessment.impact)}</TableCell>
                    <TableCell>{String(assessment.likelihood)}</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(Number(assessment.riskLevel))}>{assessment.riskLevel}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {assessment.existingControls.length > 50
                        ? `${assessment.existingControls.substring(0, 50)}...`
                        : assessment.existingControls}
                    </TableCell>
                    <TableCell className="text-right sticky right-0 bg-background">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedRisk(assessment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(assessment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(assessment.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-visible::-webkit-scrollbar {
          height: 10px;
          width: 10px;
          background: transparent;
        }
        .scrollbar-visible::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 5px;
        }
        .scrollbar-visible::-webkit-scrollbar-track {
          background: #f4f4f5;
          border-radius: 5px;
        }
        .scrollbar-visible {
          scrollbar-width: thin;
          scrollbar-color: #d4d4d4 #f4f4f5;
        }
      `}</style>

      {selectedRisk && (
        <RiskDetailsDialog risk={selectedRisk} open={!!selectedRisk} onOpenChange={() => setSelectedRisk(null)} />
      )}
    </div>
  )
}

