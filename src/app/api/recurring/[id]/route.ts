import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const recurring = await prisma.recurringTransaction.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!recurring) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(recurring)
  } catch (error) {
    console.error('[RECURRING_ID_GET]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const recurring = await prisma.recurringTransaction.update({
      where: { id },
      data: {
        amount: body.amount ? parseFloat(body.amount) : undefined,
        description: body.description,
        type: body.type,
        categoryId: body.categoryId,
        frequency: body.frequency,
        customDays: body.customDays,
        dayOfMonth: body.dayOfMonth,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : undefined,
        isActive: body.isActive,
      },
      include: { category: true },
    })
    return NextResponse.json(recurring)
  } catch (error) {
    console.error('[RECURRING_ID_PUT]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.recurringTransaction.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[RECURRING_ID_DELETE]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}