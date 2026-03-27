import { Budget } from '@/types'
import { Pencil, Trash2, Target, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { getCurrencySymbol } from '@/lib/utils'

type Props = {
  budgets: Budget[]
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export default function BudgetList({ budgets, onEdit, onDelete }: Props) {
  if (budgets.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-20 text-muted-foreground border-dashed">
        <Target className="h-10 w-10 mb-2 opacity-20" />
        <p className="text-lg">No budgets found</p>
        <p className="text-sm">Set monthly budgets for categories to track your goals.</p>
      </Card>
    )
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground shadow-lg border-none overflow-hidden relative">
        <div className="absolute right-0 top-0 p-8 opacity-10">
          <TrendingUp size={120} />
        </div>
        <CardHeader>
          <CardTitle className="text-primary-foreground/80 font-medium">Total Combined Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {getCurrencySymbol()}{totalBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-primary-foreground/60 mt-2">Allocated for the current month</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <Card
            key={budget.id}
            className="group border-2 hover:border-primary/20 transition-all duration-300 overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: `${budget.category.color}15` }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: budget.category.color || 'gray' }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {budget.category.name}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Monthly Goal</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(budget)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(budget.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                  {getCurrencySymbol()}{budget.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
