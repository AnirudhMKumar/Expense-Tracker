'use client'

import { useEffect, useState } from 'react'
import { Category, Transaction } from '@/types'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, getCurrencySymbol } from '@/lib/utils'

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  description: z.string().max(100).optional(),
  type: z.enum(["expense", "income"]),
  categoryId: z.string().min(1, "Please select a category"),
  date: z.string().min(1, "Date is required"),
})

type Props = {
  categories: Category[]
  transaction?: Transaction
  onSubmit: (data: Record<string, unknown>) => void
  onClose: () => void
}

export default function TransactionForm({ categories, transaction, onSubmit, onClose }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction?.amount?.toString() || "",
      description: transaction?.description || "",
      type: (transaction?.type as "expense" | "income") || "expense",
      categoryId: transaction?.categoryId || "",
      date: transaction?.date 
        ? new Date(transaction.date).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
    },
  })

  const [type, setType] = useState(form.getValues("type") || "expense")
  const filteredCategories = categories.filter((cat) => cat.type === type)

  useEffect(() => {
    const currentCategory = categories.find(c => c.id === form.getValues("categoryId"))
    if (currentCategory && currentCategory.type !== type) {
      form.setValue("categoryId", "")
    }
  }, [type, categories, form])

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      amount: parseFloat(values.amount)
    })
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "expense" ? "destructive" : "outline"}
                className={cn("flex-1", type === "expense" && "bg-rose-600 hover:bg-rose-700")}
                onClick={() => { form.setValue("type", "expense"); setType("expense") }}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={type === "income" ? "default" : "outline"}
                className={cn("flex-1", type === "income" && "bg-emerald-600 hover:bg-emerald-700")}
                onClick={() => { form.setValue("type", "income"); setType("income") }}
              >
                Income
              </Button>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{getCurrencySymbol()}</span>
                      <Input placeholder="0.00" className="pl-7" {...field} type="number" step="0.01" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="What was this for?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {transaction ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
