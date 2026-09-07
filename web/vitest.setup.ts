import '@testing-library/jest-dom/vitest'
import * as axeMatchers from 'vitest-axe/matchers'
import { expect, vi } from 'vitest'

vi.mock('next/font/google', () => ({
  Chakra_Petch: (options: { variable: string }) => ({
    variable: options.variable,
    className: options.variable,
    style: { fontFamily: 'Chakra Petch' },
  }),
  Barlow: (options: { variable: string }) => ({
    variable: options.variable,
    className: options.variable,
    style: { fontFamily: 'Barlow' },
  }),
}))

expect.extend(axeMatchers)

declare module 'vitest' {
  interface Matchers<R, T> {
    toHaveNoViolations: () => R
  }
}
