'use client'

import { Category } from '@/types'
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
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const colors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16',
  '#06B6D4', '#64748B'
]

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  type: z.enum(["expense", "income"]),
  color: z.string().min(1, "Color is required"),
})

type Props = {
  category?: Category
  onSubmit: (data: Record<string, unknown>) => void
  onClose: () => void
}

export default function CategoryForm({ category, onSubmit, onClose }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      type: (category?.type as "expense" | "income") || "expense",
      color: category?.color || colors[0],
    },
  })

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Groceries, Salary..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={field.value === "expense" ? "destructive" : "outline"}
                      className={cn("flex-1", field.value === "expense" && "bg-rose-600 hover:bg-rose-700")}
                      onClick={() => field.onChange("expense")}
                    >
                      Expense
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "income" ? "default" : "outline"}
                      className={cn("flex-1", field.value === "income" && "bg-emerald-600 hover:bg-emerald-700")}
                      onClick={() => field.onChange("income")}
                    >
                      Income
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="grid grid-cols-6 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        className={cn(
                          "relative h-10 w-10 rounded-xl transition-all hover:scale-110",
                          field.value === color && "ring-2 ring-primary ring-offset-2"
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {field.value === color && (
                          <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {category ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
