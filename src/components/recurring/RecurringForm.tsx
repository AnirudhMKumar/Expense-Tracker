'use client'

import { useEffect, useState } from 'react'
import { Category, RecurringTransaction } from '@/types'
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
import { cn } from '@/lib/utils'

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  description: z.string().max(100).optional(),
  type: z.enum(["expense", "income"]),
  categoryId: z.string().min(1, "Please select a category"),
  frequency: z.enum(["monthly", "custom"]),
  dayOfMonth: z.coerce.number().min(1).max(28).optional(),
  customDays: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
})

type Props = {
  categories: Category[]
  recurring?: RecurringTransaction
  onSubmit: (data: Record<string, unknown>) => void
  onClose: () => void
}

export default function RecurringForm({ categories, recurring, onSubmit, onClose }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: recurring?.amount?.toString() || "",
      description: recurring?.description || "",
      type: (recurring?.type as "expense" | "income") || "expense",
      categoryId: recurring?.categoryId || "",
      frequency: (recurring?.frequency as "monthly" | "custom") || "monthly",
      dayOfMonth: recurring?.dayOfMonth?.toString() || "",
      customDays: recurring?.customDays || "",
      startDate: recurring?.startDate ? recurring.startDate.split('T')[0] : "",
      endDate: recurring?.endDate ? recurring.endDate.split('T')[0] : "",
    },
  })

  const frequency = form.watch("frequency")
  const [type, setType] = useState(form.getValues("type") || "expense")
  const filteredCategories = categories.filter((cat) => cat.type === type)

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.type) setType(value.type as "expense" | "income")
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      amount: parseFloat(values.amount),
      description: values.description,
      type: values.type,
      categoryId: values.categoryId,
      frequency: values.frequency,
      dayOfMonth: values.dayOfMonth,
      customDays: values.customDays,
      startDate: values.startDate,
      endDate: values.endDate || null,
    })
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{recurring ? 'Edit Recurring' : 'Add Recurring'}</DialogTitle>
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
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
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
                    <Input placeholder="What is this for?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={(v) => field.onChange(v as "monthly" | "custom")} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom (specific days)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {frequency === 'monthly' ? (
              <FormField
                control={form.control}
                name="dayOfMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Month</FormLabel>
                    <Select 
                      onValueChange={(v) => field.onChange(v)} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="customDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days (comma-separated, e.g., "1,15")</FormLabel>
                    <FormControl>
                      <Input placeholder="1,15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {recurring ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
