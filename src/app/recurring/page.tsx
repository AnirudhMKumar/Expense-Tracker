'use client'

import { useEffect, useState, useCallback } from 'react'
import { RecurringTransaction, Category } from '@/types'
import { Plus } from 'lucide-react'
import RecurringList from '@/components/recurring/RecurringList'
import RecurringForm from '@/components/recurring/RecurringForm'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function RecurringPage() {
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories)
    } catch {
      toast.error("Failed to load categories")
    }
  }, [])

  const fetchRecurring = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/recurring')
      const data = await res.json()
      setRecurring(data)
    } catch {
      toast.error("Failed to load recurring transactions")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchRecurring()
  }, [fetchRecurring])

  const handleAddRecurring = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setShowForm(false)
        fetchRecurring()
        toast.success("Recurring transaction added")
      }
    } catch {
      toast.error("Failed to add recurring transaction")
    }
  }

  const handleUpdateRecurring = async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/recurring/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setEditingRecurring(null)
        fetchRecurring()
        toast.success("Recurring transaction updated")
      }
    } catch {
      toast.error("Failed to update recurring transaction")
    }
  }

  const handleDeleteRecurring = async (id: string) => {
    try {
      const res = await fetch(`/api/recurring/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchRecurring()
        toast.success("Recurring transaction deleted")
      }
    } catch {
      toast.error("Failed to delete recurring transaction")
    }
  }

  const handleToggleRecurring = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/recurring/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })
      if (res.ok) {
        fetchRecurring()
        toast.success(isActive ? "Recurring activated" : "Recurring paused")
      }
    } catch {
      toast.error("Failed to update recurring")
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recurring Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage your recurring income and expenses</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto gap-2 shadow-sm"
        >
          <Plus size={20} />
          Add Recurring
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      ) : (
        <RecurringList
          recurring={recurring}
          onEdit={setEditingRecurring}
          onDelete={handleDeleteRecurring}
          onToggle={handleToggleRecurring}
        />
      )}

      {showForm && (
        <RecurringForm
          categories={categories}
          onSubmit={handleAddRecurring}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingRecurring && (
        <RecurringForm
          categories={categories}
          recurring={editingRecurring}
          onSubmit={(data) => handleUpdateRecurring(editingRecurring.id, data)}
          onClose={() => setEditingRecurring(null)}
        />
      )}
    </div>
  )
}
