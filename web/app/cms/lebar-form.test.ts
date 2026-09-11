import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(...bagian: string[]): string {
  return readFileSync(path.join(process.cwd(), ...bagian), 'utf8')
}

describe('form pendek CMS di tengah kolom', () => {
  it('news, player, menu memakai mx-auto bersama max-w', () => {
    expect(baca('app', 'cms', 'news', 'news-form.tsx')).toMatch(/max-w-2xl[\s\S]*mx-auto|mx-auto[\s\S]*max-w-2xl/)
    expect(baca('app', 'cms', 'players', 'player-form.tsx')).toMatch(
      /max-w-2xl[\s\S]*mx-auto|mx-auto[\s\S]*max-w-2xl/,
    )
    expect(baca('app', 'cms', 'menu', 'page.tsx')).toMatch(/max-w-xl[\s\S]*mx-auto|mx-auto[\s\S]*max-w-xl/)
  })
})
