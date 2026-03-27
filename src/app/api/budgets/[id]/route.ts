import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
    }
    return NextResponse.json(budget)
  } catch (error) {
    console.error('[BUDGET_ID_GET]', error)
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
    const budget = await prisma.budget.update({
      where: { id },
      data: {
        amount: body.amount ? parseFloat(body.amount) : undefined,
        categoryId: body.categoryId,
        month: body.month ? parseInt(body.month) : undefined,
        year: body.year ? parseInt(body.year) : undefined,
      },
      include: { category: true },
    })
    return NextResponse.json(budget)
  } catch (error) {
    console.error('[BUDGET_ID_PUT]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.budget.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[BUDGET_ID_DELETE]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
