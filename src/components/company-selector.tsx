import { useEffect, useState } from 'react'
import { Company } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

interface CompanySelectorProps {
  onCompanySelect: (company: Company) => void
}

export function CompanySelector({ onCompanySelect }: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [newCompanyName, setNewCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function createCompany() {
    if (!newCompanyName.trim()) return

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name: newCompanyName.trim() }])
        .select()
        .single()

      if (error) throw error
      if (data) {
        setCompanies([...companies, data])
        setNewCompanyName('')
      }
    } catch (error) {
      console.error('Error creating company:', error)
    }
  }

  if (isLoading) {
    return <div>Loading companies...</div>
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Select Company</h1>
      
      <div className="space-y-4">
        {companies.map((company) => (
          <Button
            key={company.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onCompanySelect(company)}
          >
            {company.name}
          </Button>
        ))}
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