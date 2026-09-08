import '@testing-library/jest-dom/vitest'
import * as axeMatchers from 'vitest-axe/matchers'
import { expect, vi } from 'vitest'

vi.mock('@/lib/content/cms', async () => await import('@/lib/content/dummy'))

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>()
  return {
    ...actual,
    usePathname: () => '/',
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  }
})

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

// jsdom lacks canvas; axe colour-contrast checks call getContext and warn without this stub
HTMLCanvasElement.prototype.getContext = () => null

expect.extend(axeMatchers)

declare module 'vitest' {
  // Declaration merging requires Vitest's second generic parameter even though this matcher does not use it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R, _T> {
    toHaveNoViolations: () => R
  }
}
