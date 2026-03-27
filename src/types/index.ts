export type Category = {
  id: string
  name: string
  icon: string | null
  color: string | null
  type: string
  createdAt: string
  updatedAt: string
}

export type Transaction = {
  id: string
  amount: number
  description: string | null
  type: string
  date: string
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

export type Budget = {
  id: string
  amount: number
  month: number
  year: number
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

export type RecurringTransaction = {
  id: string
  amount: number
  description: string | null
  type: string
  categoryId: string
  category: Category
  frequency: string
  customDays: string | null
  dayOfMonth: number | null
  startDate: string
  endDate: string | null
  isActive: boolean
  lastCreated: string
  createdAt: string
  updatedAt: string
}

export type DashboardStats = {
  totalIncome: number
  totalExpenses: number
  balance: number
  recentTransactions: Transaction[]
  categoryBreakdown: {
    categoryId: string
    amount: number
    category: Category | null
  }[]
  budgets: Budget[]
  month: number
  year: number
}
