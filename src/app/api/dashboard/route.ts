import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const now = new Date()
    const selectedMonth = month ? parseInt(month) : now.getMonth() + 1
    const selectedYear = year ? parseInt(year) : now.getFullYear()

    const startDate = new Date(selectedYear, selectedMonth - 1, 1)
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59)

    const [totalIncome, totalExpenses, recentTransactions, categoryBreakdown, budgets] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          type: 'income',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          type: 'expense',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: { category: true },
      }),
      prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
          type: 'expense',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.budget.findMany({
        where: { month: selectedMonth, year: selectedYear },
        include: { category: true },
      }),
    ])

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryBreakdown.map(c => c.categoryId) } },
    })

    const breakdownWithCategories = categoryBreakdown.map(item => ({
      categoryId: item.categoryId,
      amount: item._sum.amount || 0,
      category: categories.find(c => c.id === item.categoryId),
    }))

    return NextResponse.json({
      totalIncome: totalIncome._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      balance: (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
      recentTransactions,
      categoryBreakdown: breakdownWithCategories,
      budgets,
      month: selectedMonth,
      year: selectedYear,
    })
  } catch (error) {
    console.error('[DASHBOARD_GET]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
