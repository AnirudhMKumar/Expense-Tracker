import { DashboardStats } from '@/types'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'
import { FormattedAmount } from "../ui/formatted-amount"

type Props = {
  stats: DashboardStats
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    {
      title: 'Total Income',
      amount: stats.totalIncome,
      icon: TrendingUp,
      className: 'text-emerald-600',
      bgClassName: 'bg-emerald-500/10',
      borderClassName: 'border-emerald-500/20',
    },
    {
      title: 'Total Expenses',
      amount: stats.totalExpenses,
      icon: TrendingDown,
      className: 'text-rose-600',
      bgClassName: 'bg-rose-500/10',
      borderClassName: 'border-rose-500/20',
    },
    {
      title: 'Balance',
      amount: stats.balance,
      icon: Wallet,
      className: stats.balance >= 0 ? 'text-sky-600' : 'text-amber-600',
      bgClassName: stats.balance >= 0 ? 'bg-sky-500/10' : 'bg-amber-500/10',
      borderClassName: stats.balance >= 0 ? 'border-sky-500/20' : 'border-amber-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className={cn("overflow-hidden border-2 transition-all hover:shadow-md", card.borderClassName)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn("p-2 rounded-full", card.bgClassName)}>
                <Icon className={cn("h-4 w-4", card.className)} />
              </div>
            </CardHeader>
            <CardContent>
              <FormattedAmount 
                amount={card.amount} 
                className={cn("text-2xl font-bold tracking-tight", card.className)} 
              />
              <p className="text-xs text-muted-foreground mt-1">
                For selected period
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
