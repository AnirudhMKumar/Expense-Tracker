import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const recurring = await prisma.recurringTransaction.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(recurring)
  } catch (error) {
    console.error('[RECURRING_GET]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.amount || !body.categoryId || !body.type || !body.startDate) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const recurring = await prisma.recurringTransaction.create({
      data: {
        amount: parseFloat(body.amount),
        description: body.description,
        type: body.type,
        categoryId: body.categoryId,
        frequency: body.frequency || 'monthly',
        customDays: body.customDays,
        dayOfMonth: body.dayOfMonth,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
      include: { category: true },
    })
    return NextResponse.json(recurring)
  } catch (error) {
    console.error('[RECURRING_POST]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}