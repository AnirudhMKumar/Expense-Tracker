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

    const exportFormat = searchParams.get('export')
    if (exportFormat === 'csv') {
      const transactions = await prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
      })
      const csvHeader = 'Date,Type,Amount,Category,Description\n'
      const csvRows = transactions.map(t => 
        `${t.date},${t.type},${t.amount},${t.category.name},"${t.description || ''}"`
      ).join('\n')
      return new NextResponse(csvHeader + csvRows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="transactions.csv"',
        },
      })
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

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

export async function PUT(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return new NextResponse("CSV file is empty", { status: 400 })
    }

    const header = lines[0].toLowerCase().split(',').map(h => h.trim())
    const dateIdx = header.indexOf('date')
    const typeIdx = header.indexOf('type')
    const amountIdx = header.indexOf('amount')
    const categoryIdx = header.indexOf('category')
    const descIdx = header.indexOf('description')

    if (dateIdx === -1 || typeIdx === -1 || amountIdx === -1 || categoryIdx === -1) {
      return new NextResponse("Missing required columns: date, type, amount, category", { status: 400 })
    }

    const categories = await prisma.category.findMany()
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c]))

    const results = { imported: 0, failed: 0, errors: [] as string[] }

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
        const dateStr = values[dateIdx]
        const type = values[typeIdx]?.toLowerCase()
        const amount = parseFloat(values[amountIdx])
        const categoryName = values[categoryIdx]?.toLowerCase()
        const description = values[descIdx] || ''

        if (!dateStr || !type || isNaN(amount) || !categoryName) {
          results.failed++
          results.errors.push(`Row ${i}: Missing required fields`)
          continue
        }

        if (type !== 'income' && type !== 'expense') {
          results.failed++
          results.errors.push(`Row ${i}: Invalid type "${type}"`)
          continue
        }

        const category = categoryMap.get(categoryName)
        if (!category) {
          results.failed++
          results.errors.push(`Row ${i}: Category "${categoryName}" not found`)
          continue
        }

        await prisma.transaction.create({
          data: {
            amount,
            description,
            type,
            date: new Date(dateStr),
            categoryId: category.id,
          },
        })
        results.imported++
      } catch (err) {
        results.failed++
        results.errors.push(`Row ${i}: ${err instanceof Error ? err.message : 'Parse error'}`)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('[TRANSACTIONS_IMPORT]', error)
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
