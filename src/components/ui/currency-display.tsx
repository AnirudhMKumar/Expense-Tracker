'use client'

import { getCurrencySymbol } from '@/lib/utils'

interface CurrencyDisplayProps {
  amount: number
  className?: string
  showSign?: boolean
}

export default function CurrencyDisplay({ amount, className, showSign = false }: CurrencyDisplayProps) {
  const symbol = getCurrencySymbol()
  const displaySign = showSign && amount > 0 ? '+' : ''
  const absoluteAmount = Math.abs(amount)

  return (
    <span className={className}>
      {displaySign}{symbol}{absoluteAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  )
}