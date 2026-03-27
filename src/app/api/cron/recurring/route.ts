import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    
    if (secret !== process.env.CRON_SECRET && process.env.CRON_SECRET) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const today = new Date()
    const currentDay = today.getDate()
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()

    const activeRecurring = await prisma.recurringTransaction.findMany({
      where: { isActive: true },
      include: { category: true },
    })

    let created = 0

    for (const recurring of activeRecurring) {
      if (new Date(recurring.startDate) > today) continue
      
      if (recurring.endDate && new Date(recurring.endDate) < today) continue

      const lastCreated = new Date(recurring.lastCreated)
      const lastCreatedMonth = lastCreated.getMonth() + 1
      const lastCreatedYear = lastCreated.getFullYear()

      let shouldCreate = false

      if (recurring.frequency === 'monthly') {
        if (recurring.dayOfMonth === currentDay) {
          if (lastCreatedMonth !== currentMonth || lastCreatedYear !== currentYear) {
            shouldCreate = true
          }
        }
      } else if (recurring.frequency === 'custom') {
        const customDays = recurring.customDays?.split(',').map(d => parseInt(d.trim())) || []
        if (customDays.includes(currentDay)) {
          if (lastCreatedMonth !== currentMonth || lastCreatedYear !== currentYear) {
            shouldCreate = true
          }
        }
      }

      if (shouldCreate) {
        await prisma.transaction.create({
          data: {
            amount: recurring.amount,
            description: recurring.description,
            type: recurring.type,
            categoryId: recurring.categoryId,
            date: today,
          },
        })

        await prisma.recurringTransaction.update({
          where: { id: recurring.id },
          data: { lastCreated: today },
        })

        created++
      }
    }

    return NextResponse.json({ success: true, created })
  } catch (error) {
    console.error('[CRON_RECURRING]', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
