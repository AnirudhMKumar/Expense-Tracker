import { Budget } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormattedAmount } from "../ui/formatted-amount"

type Props = {
  budgets: Budget[]
  categoryBreakdown: {
    categoryId: string
    amount: number
  }[]
}

export default function BudgetProgress({ budgets, categoryBreakdown }: Props) {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Target className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-lg font-semibold">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {(!budgets || budgets.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <p>No budgets set for this month</p>
          </div>
        ) : (
          <div className="space-y-6 mt-2">
            {budgets.map((budget) => {
              const expense = categoryBreakdown.find(b => b.categoryId === budget.categoryId)
              const spent = expense ? expense.amount : 0
              const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100)
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-medium leading-none">{budget.category.name}</p>
                      <div className="text-xs text-muted-foreground mt-1 flex gap-1">
                        <FormattedAmount amount={spent} />
                        <span>/</span>
                        <FormattedAmount amount={budget.amount} />
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      percentage > 90 ? "text-rose-600" : percentage > 70 ? "text-amber-600" : "text-emerald-600"
                    )}>
                      {percentage}%
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
