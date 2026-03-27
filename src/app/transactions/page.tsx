'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Transaction, Category } from '@/types'
import TransactionForm from '@/components/transactions/TransactionForm'
import TransactionList from '@/components/transactions/TransactionList'
import { Plus, Search, FilterX, Download, Upload } from 'lucide-react'

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState({
    type: 'all',
    categoryId: 'all',
    startDate: '',
    endDate: '',
    search: '',
  })
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories)
    } catch {
      toast.error("Failed to load categories")
    }
  }, [])

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.categoryId !== 'all') params.append('categoryId', filters.categoryId)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.search) params.append('search', filters.search)
      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())

      const res = await fetch(`/api/transactions?${params.toString()}`)
      const response = await res.json()
      setTransactions(response.transactions)
      setPagination(prev => ({ ...prev, total: response.total }))
    } catch {
      toast.error("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [filters])

  const handleAddTransaction = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setShowForm(false)
        fetchTransactions()
        toast.success("Transaction added successfully")
      }
    } catch {
      toast.error("Failed to add transaction")
    }
  }

  const handleUpdateTransaction = async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setEditingTransaction(null)
        fetchTransactions()
        toast.success("Transaction updated successfully")
      }
    } catch {
      toast.error("Failed to update transaction")
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchTransactions()
        toast.success("Transaction deleted successfully")
      }
    } catch {
      toast.error("Failed to delete transaction")
    }
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.categoryId !== 'all') params.append('categoryId', filters.categoryId)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.search) params.append('search', filters.search)
      params.append('export', 'csv')

      const res = await fetch(`/api/transactions?${params.toString()}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'transactions.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Transactions exported successfully")
    } catch {
      toast.error("Failed to export transactions")
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/transactions', {
        method: 'PUT',
        body: formData,
      })

      const result = await res.json()
      if (res.ok) {
        toast.success(`Imported ${result.imported} transactions`)
        fetchTransactions()
      } else {
        toast.error(result.error || 'Import failed')
      }
    } catch {
      toast.error("Failed to import transactions")
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetFilters = () => {
    setFilters({
      type: 'all',
      categoryId: 'all',
      startDate: '',
      endDate: '',
      search: '',
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage and track your spending</p>
        </div>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleImport}
          className="hidden"
        />
        <Button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto gap-2 shadow-sm"
        >
          <Plus size={20} />
          Add Transaction
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          className="w-full md:w-auto gap-2 shadow-sm"
        >
          <Download size={20} />
          Export CSV
        </Button>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full md:w-auto gap-2 shadow-sm"
        >
          <Upload size={20} />
          Import CSV
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.categoryId} onValueChange={(v) => setFilters({ ...filters, categoryId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={resetFilters} title="Reset Filters">
                <FilterX size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading transactions...</p>
        </div>
      ) : (
        <>
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={handleDeleteTransaction}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {transactions.length} of {pagination.total} transactions
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
        <TransactionForm
          categories={categories}
          onSubmit={handleAddTransaction}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingTransaction && (
        <TransactionForm
          categories={categories}
          transaction={editingTransaction}
          onSubmit={(data) => handleUpdateTransaction(editingTransaction.id, data)}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  )
}
