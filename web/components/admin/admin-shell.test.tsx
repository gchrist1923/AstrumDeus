import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const sumber = readFileSync(path.join(process.cwd(), 'components', 'admin', 'admin-shell.tsx'), 'utf8')

describe('AdminShell lebar', () => {
  it('header dan badan tidak dikunci max-w-page', () => {
    expect(sumber).not.toMatch(/max-w-page/)
    expect(sumber).toMatch(/justify-between/)
    expect(sumber).toMatch(/md:w-52/)
    expect(sumber).toMatch(/flex-1/)
    expect(sumber).toMatch(/px-5/)
    expect(sumber).toMatch(/md:px-8/)
  })
})
