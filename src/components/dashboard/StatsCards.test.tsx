import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatsCards from './StatsCards'
import { DashboardStats } from '@/types'

const mockStats: DashboardStats = {
  totalIncome: 5000,
  totalExpenses: 2000,
  balance: 3000,
  recentTransactions: [],
  categoryBreakdown: [],
  budgets: [],
  month: 2,
  year: 2026,
}

describe('StatsCards', () => {
  it('renders all stats correctly', () => {
    render(<StatsCards stats={mockStats} />)
    
    expect(screen.getByText('Total Income')).toBeDefined()
    expect(screen.getByText('Total Expenses')).toBeDefined()
    expect(screen.getByText('Balance')).toBeDefined()
    
    // Check amounts using more flexible matchers as content might be split
    expect(screen.getByText(/5,000\.00/)).toBeDefined()
    expect(screen.getByText(/2,000\.00/)).toBeDefined()
    expect(screen.getByText(/3,000\.00/)).toBeDefined()
  })

  it('shows negative balance styling if balance is negative', () => {
    const negativeStats = { ...mockStats, balance: -500 }
    render(<StatsCards stats={negativeStats} />)
    const balanceAmount = screen.getByText(/-₹500\.00/)
    expect(balanceAmount.className).toContain('text-amber-600')
  })
})
