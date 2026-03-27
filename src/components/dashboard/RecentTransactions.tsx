import { Transaction } from '@/types'
import { ArrowUpRight, ArrowDownRight, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FormattedDate } from "../ui/formatted-date"
import { FormattedAmount } from "../ui/formatted-amount"

type Props = {
  transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: Props) {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-2 rounded-full transition-transform group-hover:scale-110",
                      transaction.type === 'income' 
                        ? 'bg-emerald-500/10 text-emerald-600' 
                        : 'bg-rose-500/10 text-rose-600'
                    )}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium leading-none">
                      {transaction.description || transaction.category.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {transaction.category.name} • <FormattedDate date={transaction.date} />
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <FormattedAmount 
                    amount={transaction.amount} 
                    prefix={transaction.type === 'income' ? '+' : '-'}
                    className={cn(
                      "font-bold",
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
