'use client'

import { useEffect, useState, useCallback } from 'react'
import { DashboardStats } from '@/types'
import StatsCards from '@/components/dashboard/StatsCards'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import SpendingChart from '@/components/dashboard/SpendingChart'
import BudgetProgress from '@/components/dashboard/BudgetProgress'

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState<number>(0)
  const [year, setYear] = useState<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const now = new Date()
    setMonth(now.getMonth() + 1)
    setYear(now.getFullYear())
    setMounted(true)
  }, [])

  const fetchDashboard = useCallback(async () => {
    if (!mounted) return
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard?month=${month}&year=${year}`)
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [month, year, mounted])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

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

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-muted-foreground text-lg">No data available for this period</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your finances</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
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
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <SpendingChart data={stats.categoryBreakdown} />
        <BudgetProgress budgets={stats.budgets} categoryBreakdown={stats.categoryBreakdown} />
      </div>

      <div className="mt-8">
        <RecentTransactions transactions={stats.recentTransactions} />
      </div>
    </div>
  )
}
