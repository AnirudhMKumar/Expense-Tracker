'use client'

import { useEffect, useState, useCallback } from 'react'
import { Budget, Category } from '@/types'
import { Plus } from 'lucide-react'
import BudgetList from '@/components/budgets/BudgetList'
import BudgetForm from '@/components/budgets/BudgetForm'
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories?type=expense&limit=100')
      const data = await res.json()
      setCategories(data.categories)
    } catch {
      toast.error("Failed to load categories")
    }
  }, [])

  const fetchBudgets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/budgets?month=${month}&year=${year}`)
      const data = await res.json()
      setBudgets(data)
    } catch {
      toast.error("Failed to load budgets")
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  const handleAddBudget = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, month, year }),
      })
      if (res.ok) {
        setShowForm(false)
        fetchBudgets()
        toast.success("Budget set successfully")
      }
    } catch {
      toast.error("Failed to set budget")
    }
  }

  const handleUpdateBudget = async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setEditingBudget(null)
        fetchBudgets()
        toast.success("Budget updated successfully")
      }
    } catch {
      toast.error("Failed to update budget")
    }
  }

  const handleDeleteBudget = async (id: string) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchBudgets()
        toast.success("Budget deleted successfully")
      }
    } catch {
      toast.error("Failed to delete budget")
    }
  }

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground mt-1">Set and manage your monthly spending limits</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="flex gap-2">
            <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 shadow-sm"
          >
            <Plus size={20} />
            Add Budget
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading budgets...</p>
        </div>
      ) : (
        <BudgetList
          budgets={budgets}
          onEdit={setEditingBudget}
          onDelete={handleDeleteBudget}
        />
      )}

      {showForm && (
        <BudgetForm
          categories={categories.filter((c) => c.type === 'expense')}
          onSubmit={handleAddBudget}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingBudget && (
        <BudgetForm
          categories={categories.filter((c) => c.type === 'expense')}
          budget={editingBudget}
          initialMonth={month}
          initialYear={year}
          onSubmit={(data) => handleUpdateBudget(editingBudget.id, data)}
          onClose={() => setEditingBudget(null)}
        />
      )}
    </div>
  )
}
