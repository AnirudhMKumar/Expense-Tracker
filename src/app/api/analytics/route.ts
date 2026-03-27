import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear()

    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)

    const transactions = await prisma.transaction.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: { category: true },
    })

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyData = months.map((month, index) => {
      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date)
        return date.getMonth() === index
      })
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      return { month, income, expenses }
    })

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const categoryTotals: Record<string, { amount: number; color: string; name: string }> = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const catId = t.categoryId
        if (!categoryTotals[catId]) {
          categoryTotals[catId] = {
            amount: 0,
            color: t.category.color || '#6B7280',
            name: t.category.name,
          }
        }
        categoryTotals[catId].amount += t.amount
      })

    const categoryData = Object.values(categoryTotals).map((item) => ({
      name: item.name,
      amount: item.amount,
      color: item.color,
    }))

    return NextResponse.json({
      monthlyData,
      categoryData,
      totalIncome,
      totalExpenses,
      year,
    })
  } catch (error) {
    console.error('[ANALYTICS_GET]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
