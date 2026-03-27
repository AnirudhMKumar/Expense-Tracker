import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const skip = (page - 1) * limit

    const where = type ? { type: type as 'expense' | 'income' } : {}

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: { _count: { select: { transactions: true } } },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.category.count({ where }),
    ])
    return NextResponse.json({ categories, total, page, limit })
  } catch (error) {
    console.error('[CATEGORIES_GET]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        icon: body.icon,
        color: body.color,
        type: body.type || 'expense',
      },
    })
    return NextResponse.json(category)
  } catch (error) {
    console.error('[CATEGORIES_POST]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
