import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
    })
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json(category)
  } catch (error) {
    console.error('[CATEGORY_ID_GET]', error)
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
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        icon: body.icon,
        color: body.color,
        type: body.type,
      },
    })
    return NextResponse.json(category)
  } catch (error) {
    console.error('[CATEGORY_ID_PUT]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if category has transactions
    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id }
    })

    if (transactionCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category with existing transactions. Delete the transactions first.' 
      }, { status: 400 })
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CATEGORY_ID_DELETE]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
