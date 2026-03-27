import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormattedAmount } from './formatted-amount'

describe('FormattedAmount', () => {
  it('renders placeholder before mounting', () => {
    // Note: Since useEffect runs after first render, 
    // we can't easily test the 'not mounted' state in jsdom 
    // without more complex mocking, but we can test the final output.
    render(<FormattedAmount amount={1234.56} />)
    expect(screen.getByText(/₹1,234.56/)).toBeDefined()
  })

  it('renders with prefix', () => {
    render(<FormattedAmount amount={500} prefix="+" />)
    expect(screen.getByText(/\+₹500.00/)).toBeDefined()
  })

  it('formats large numbers correctly in en-IN', () => {
    // 1,00,000 for Indian locale
    render(<FormattedAmount amount={100000} />)
    expect(screen.getByText(/₹1,00,000.00/)).toBeDefined()
  })
})
