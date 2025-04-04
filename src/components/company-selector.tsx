"use client"

import { useEffect, useState } from 'react'
import { Company } from '@/lib/types'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompanySelectorProps {
  onCompanySelect: (companyId: string) => void
  selectedCompanyId?: string
}

export function CompanySelector({ onCompanySelect, selectedCompanyId }: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [newCompanyName, setNewCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setIsLoading(true)
        setError(null)

        if (!isSupabaseAvailable()) {
          const envError = !process.env.NEXT_PUBLIC_SUPABASE_URL 
            ? 'NEXT_PUBLIC_SUPABASE_URL is missing'
            : !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing'
              : 'Database connection failed'
          
          setError(`Database connection is not available. ${envError}`)
          setCompanies([])
          return
        }

        const { data, error } = await supabase!
          .from('companies')
          .select('*')
          .order('name')

        if (error) throw error
        setCompanies(data || [])
      } catch (error) {
        console.error('Error fetching companies:', error)
        setError(`Failed to fetch companies: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setCompanies([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  async function createCompany() {
    try {
      if (!newCompanyName.trim()) {
        setError("Company name cannot be empty")
        return
      }

      if (!isSupabaseAvailable()) {
        const envError = !process.env.NEXT_PUBLIC_SUPABASE_URL 
          ? 'NEXT_PUBLIC_SUPABASE_URL is missing'
          : !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing'
            : 'Database connection failed'
        
        setError(`Database connection is not available. ${envError}`)
        return
      }

      const { data, error } = await supabase!
        .from('companies')
        .insert([{ name: newCompanyName.trim() }])
        .select()
        .single()

      if (error) throw error

      setCompanies([...companies, data])
      setNewCompanyName('')
      onCompanySelect(data.id)
    } catch (error) {
      console.error('Error creating company:', error)
      setError(`Failed to create company: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading companies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Error</h1>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-medium">{error}</p>
          <p className="mt-2 text-sm">
            Please check your environment configuration and try again.
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm">Environment variables status:</p>
            <ul className="text-sm space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Available' : '❌ Missing'}</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Available' : '❌ Missing'}</li>
            </ul>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Select Company</h1>

      <div className="space-y-4">
        <Select
          value={selectedCompanyId}
          onValueChange={onCompanySelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Add New Company
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Company Name"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
            />
            <Button onClick={createCompany} className="w-full">
              Create Company
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 