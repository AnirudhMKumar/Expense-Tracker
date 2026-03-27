'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { PieChart as PieChartIcon } from 'lucide-react'
import { getCurrencySymbol } from '@/lib/utils'

type Props = {
  data: {
    categoryId: string
    amount: number
    category: {
      id: string
      name: string
      color: string | null
    } | null
  }[]
}

export default function SpendingChart({ data }: Props) {
  const chartData = data?.map((item) => ({
    name: item.category?.name || 'Unknown',
    value: item.amount,
    color: item.category?.color || '#6B7280',
  })) || []

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <PieChartIcon className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No spending data available
          </div>
        ) : (
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="stroke-background stroke-2" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--card-foreground))'
                  }}
                  itemStyle={{ color: 'inherit' }}
                  formatter={(value) => [`${getCurrencySymbol()}${(value as number).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Amount']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
