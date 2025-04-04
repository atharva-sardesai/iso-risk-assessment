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
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { RISK_CATEGORIES } from "@/lib/constants"

interface RiskAssessmentTableProps {
  risks: RiskAssessment[]
  onRiskUpdate: () => void
}

export function RiskAssessmentTable({ risks = [], onRiskUpdate }: RiskAssessmentTableProps) {
  const [sortField, setSortField] = useState<keyof RiskAssessment>("risk_level")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedRisk, setSelectedRisk] = useState<RiskAssessment | null>(null)
  const [filters, setFilters] = useState<Partial<Record<keyof RiskAssessment, string>>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

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
    const values = new Set(risks.map(a => {
      const value = a[field]
      return value !== undefined && value !== null ? String(value) : undefined
    }).filter(Boolean))
    return Array.from(values)
  }

  const filteredRisks = risks.filter((risk) => {
    const matchesSearch =
      risk.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.threat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.vulnerability.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === "all" || risk.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const sortedRisks = [...filteredRisks].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue === undefined || aValue === null) return 1
    if (bValue === undefined || bValue === null) return -1
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return sortDirection === 'asc'
      ? Number(aValue) - Number(bValue)
      : Number(bValue) - Number(aValue)
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('risk_assessments')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh the risks list
      onRiskUpdate()
    } catch (error) {
      console.error('Error deleting risk assessment:', error)
      // You might want to show an error message to the user here
    }
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
    <div className="rounded-md border">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search risks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80"
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {RISK_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        ref={tableContainerRef}
        className="relative overflow-auto"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("asset")} className="cursor-pointer">
                Asset
                {sortField === "asset" && (
                  sortDirection === "asc" ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                Category
                {sortField === "category" && (
                  sortDirection === "asc" ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("risk_level")} className="cursor-pointer">
                Risk Level
                {sortField === "risk_level" && (
                  sortDirection === "asc" ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("priority")} className="cursor-pointer">
                Priority
                {sortField === "priority" && (
                  sortDirection === "asc" ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell>{risk.asset}</TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>
                  <Badge variant={getRiskBadgeVariant(risk.risk_level)}>
                    {getRiskLevelLabel(risk.risk_level)}
                  </Badge>
                </TableCell>
                <TableCell>{risk.priority}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedRisk(risk)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRiskUpdate()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(risk.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedRisk && (
        <RiskDetailsDialog
          risk={selectedRisk}
          open={!!selectedRisk}
          onOpenChange={(open) => !open && setSelectedRisk(null)}
        />
      )}
    </div>
  )
}

