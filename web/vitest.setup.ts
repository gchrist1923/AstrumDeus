import '@testing-library/jest-dom/vitest'
import * as axeMatchers from 'vitest-axe/matchers'
import { expect } from 'vitest'

expect.extend(axeMatchers)

declare module 'vitest' {
  interface Matchers<R, T> {
    toHaveNoViolations: () => R
  }
}
