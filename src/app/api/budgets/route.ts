import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const where: Record<string, unknown> = {}
    if (month) where.month = parseInt(month)
    if (year) where.year = parseInt(year)

    const budgets = await prisma.budget.findMany({
      where,
      include: { category: true },
    })
    return NextResponse.json(budgets)
  } catch (error) {
    console.error('[BUDGETS_GET]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.month || !body.year || !body.categoryId || body.amount === undefined) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const budget = await prisma.budget.upsert({
      where: {
        month_year_categoryId: {
          month: body.month,
          year: body.year,
          categoryId: body.categoryId,
        },
      },
      update: { amount: parseFloat(body.amount) },
      create: {
        amount: parseFloat(body.amount),
        month: body.month,
        year: body.year,
        categoryId: body.categoryId,
      },
      include: { category: true },
    })
    return NextResponse.json(budget)
  } catch (error) {
    console.error('[BUDGETS_POST]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
