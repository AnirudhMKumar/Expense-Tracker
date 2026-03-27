import { Transaction } from '@/types'
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FormattedDate } from "../ui/formatted-date"
import { FormattedAmount } from "../ui/formatted-amount"

type Props = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export default function TransactionList({ transactions, onEdit, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">No transactions found</p>
        <p className="text-sm mt-1">Try adjusting your filters or add a new transaction.</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[300px]">Transaction</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="group hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
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
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{transaction.type}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: transaction.category.color || 'gray' }} 
                  />
                  <span className="text-sm font-medium">
                    {transaction.category.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                <FormattedDate 
                  date={transaction.date} 
                  options={{
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }} 
                />
              </TableCell>
              <TableCell className="text-right">
                <FormattedAmount 
                  amount={transaction.amount} 
                  prefix={transaction.type === 'income' ? '+' : '-'}
                  className={cn(
                    "font-bold",
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  )}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(transaction)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(transaction.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
