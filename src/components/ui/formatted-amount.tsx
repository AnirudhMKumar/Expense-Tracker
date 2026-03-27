'use client'

type Props = {
  amount: number
  prefix?: string
  className?: string
}

export function FormattedAmount({ amount, prefix = '', className }: Props) {
  const currencySymbol = '₹'

  const isNegative = amount < 0
  const absoluteAmount = Math.abs(amount)
  const displaySign = isNegative ? '-' : prefix

  return (
    <span className={className}>
      {displaySign}{currencySymbol}{absoluteAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  )
}