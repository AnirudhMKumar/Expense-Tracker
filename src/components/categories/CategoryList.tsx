'use client'

import { useState } from 'react'
import { Category } from '@/types'
import { Pencil, Trash2, Tags } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'

type Props = {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filteredCategories = categories.filter((cat) => {
    if (filter === 'all') return true
    return cat.type === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-muted rounded-lg w-fit">
        {(['all', 'income', 'expense'] as const).map((type) => (
          <Button
            key={type}
            variant={filter === type ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter(type)}
            className={cn(
              "capitalize px-4 transition-all",
              filter === type && "bg-background shadow-sm"
            )}
          >
            {type}
          </Button>
        ))}
      </div>

      {filteredCategories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-muted-foreground border-dashed">
          <Tags className="h-10 w-10 mb-2 opacity-20" />
          <p className="text-lg">No categories found</p>
          <p className="text-sm">Add a category to start organizing your transactions.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="group border-2 hover:border-primary/20 transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: category.color || 'gray' }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {category.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(category.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
