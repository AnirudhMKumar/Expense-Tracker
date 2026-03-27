import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('[TRANSACTION_ID_GET]', error)
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
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: body.amount ? parseFloat(body.amount) : undefined,
        description: body.description,
        type: body.type,
        date: body.date ? new Date(body.date) : undefined,
        categoryId: body.categoryId,
      },
      include: { category: true },
    })
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('[TRANSACTION_ID_PUT]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.transaction.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[TRANSACTION_ID_DELETE]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
