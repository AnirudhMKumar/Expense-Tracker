'use client'

import { useEffect, useState, useCallback } from 'react'
import { Category } from '@/types'
import { Plus } from 'lucide-react'
import CategoryList from '@/components/categories/CategoryList'
import CategoryForm from '@/components/categories/CategoryForm'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())
      const res = await fetch(`/api/categories?${params.toString()}`)
      const response = await res.json()
      setCategories(response.categories)
      setPagination(prev => ({ ...prev, total: response.total }))
    } catch {
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleAddCategory = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setShowForm(false)
        fetchCategories()
        toast.success("Category added successfully")
      }
    } catch {
      toast.error("Failed to add category")
    }
  }

  const handleUpdateCategory = async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setEditingCategory(null)
        fetchCategories()
        toast.success("Category updated successfully")
      }
    } catch {
      toast.error("Failed to update category")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCategories()
        toast.success("Category deleted successfully")
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to delete category")
      }
    } catch {
      toast.error("Failed to delete category")
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your income and expenses</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto gap-2 shadow-sm"
        >
          <Plus size={20} />
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading categories...</p>
        </div>
      ) : (
        <>
          <CategoryList
            categories={categories}
            onEdit={setEditingCategory}
            onDelete={handleDeleteCategory}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {categories.length} of {pagination.total} categories
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page * pagination.limit >= pagination.total}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <CategoryForm
          onSubmit={handleAddCategory}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onSubmit={(data) => handleUpdateCategory(editingCategory.id, data)}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  )
}
