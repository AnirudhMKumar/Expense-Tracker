'use client'

import { useEffect, useState } from 'react'

type Props = {
  date: string | Date
  options?: Intl.DateTimeFormatOptions
  className?: string
}

export function FormattedDate({ date, options, className }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={className}>...</span>
  }

  return (
    <span className={className}>
      {new Date(date).toLocaleDateString(undefined, options)}
    </span>
  )
}
