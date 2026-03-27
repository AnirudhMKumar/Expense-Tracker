import { RecurringTransaction } from '@/types'
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Edit, Trash2, Play, Pause } from 'lucide-react'

type Props = {
  recurring: RecurringTransaction[]
  onEdit: (recurring: RecurringTransaction) => void
  onDelete: (id: string) => void
  onToggle: (id: string, isActive: boolean) => void
}

export default function RecurringList({ recurring, onEdit, onDelete, onToggle }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recurring.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              No recurring transactions yet
            </TableCell>
          </TableRow>
        ) : (
          recurring.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.category.name}</TableCell>
              <TableCell>₹{r.amount.toFixed(2)}</TableCell>
              <TableCell>
                <span className={r.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                  {r.type}
                </span>
              </TableCell>
              <TableCell>
                {r.frequency === 'monthly' 
                  ? `Monthly (${r.dayOfMonth})` 
                  : `Custom (${r.customDays})`
                }
              </TableCell>
              <TableCell>{r.startDate.split('T')[0]}</TableCell>
              <TableCell>
                <span className={r.isActive ? 'text-green-600' : 'text-gray-500'}>
                  {r.isActive ? 'Active' : 'Paused'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onToggle(r.id, !r.isActive)}
                  >
                    {r.isActive ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(r)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(r.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
