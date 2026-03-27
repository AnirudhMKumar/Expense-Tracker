import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const categoryId = searchParams.get('categoryId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const search = searchParams.get('search')

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    
    if (type) where.type = type
    if (categoryId) where.categoryId = categoryId
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {}
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)
      where.date = dateFilter
    }
    if (search) {
      where.description = { contains: search }
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])
    return NextResponse.json({ transactions, total, page, limit })
  } catch (error) {
    console.error('[TRANSACTIONS_GET]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.amount || !body.categoryId || !body.type) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(body.amount),
        description: body.description,
        type: body.type,
        date: body.date ? new Date(body.date) : new Date(),
        categoryId: body.categoryId,
      },
      include: { category: true },
    })
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('[TRANSACTIONS_POST]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
