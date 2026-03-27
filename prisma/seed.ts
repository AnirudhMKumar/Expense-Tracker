import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
})

const prisma = new PrismaClient({ adapter })

const defaultCategories = [
  { name: 'Salary', icon: 'Wallet', color: '#10B981', type: 'income' },
  { name: 'Freelance', icon: 'Briefcase', color: '#3B82F6', type: 'income' },
  { name: 'Investment', icon: 'TrendingUp', color: '#8B5CF6', type: 'income' },
  { name: 'Other Income', icon: 'Plus', color: '#6366F1', type: 'income' },
  { name: 'Food & Dining', icon: 'Utensils', color: '#F59E0B', type: 'expense' },
  { name: 'Transportation', icon: 'Car', color: '#3B82F6', type: 'expense' },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#EC4899', type: 'expense' },
  { name: 'Entertainment', icon: 'Film', color: '#8B5CF6', type: 'expense' },
  { name: 'Bills & Utilities', icon: 'Receipt', color: '#EF4444', type: 'expense' },
  { name: 'Healthcare', icon: 'Heart', color: '#10B981', type: 'expense' },
  { name: 'Education', icon: 'BookOpen', color: '#6366F1', type: 'expense' },
  { name: 'Travel', icon: 'Plane', color: '#14B8A6', type: 'expense' },
  { name: 'Other Expense', icon: 'MoreHorizontal', color: '#6B7280', type: 'expense' },
]

async function main() {
  console.log('Seeding categories...')
  
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }
  
  console.log('Seeding completed!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
