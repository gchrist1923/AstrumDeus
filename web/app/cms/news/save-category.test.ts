import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { assertSelectableCategory } from '@/lib/content/active-options'

describe('assertSelectableCategory', () => {
  const inactive = { id: 'cat-1', isActive: false }

  it('menolak kategori nonaktif saat create', () => {
    expect(assertSelectableCategory(inactive, 'create')).toBe(false)
  })

  it('mengizinkan update yang mempertahankan kategori nonaktif', () => {
    expect(assertSelectableCategory(inactive, 'update', 'cat-1')).toBe(true)
  })
})

describe('form berita memakai kategori aktif', () => {
  const newsDir = path.join(process.cwd(), 'app', 'cms', 'news')

  it('memakai select categoryId, bukan teks bebas', () => {
    const form = readFileSync(path.join(newsDir, 'news-form.tsx'), 'utf8')
    expect(form).toMatch(/name="categoryId"/)
    expect(form).toMatch(/<select/)
    expect(form).not.toMatch(/name="category"/)
  })

  it('menyimpan lewat categoryId tanpa upsert nama bebas', () => {
    const actions = readFileSync(path.join(newsDir, 'actions.ts'), 'utf8')
    expect(actions).toMatch(/teks\(formData, 'categoryId'\)/)
    expect(actions).toMatch(/assertSelectableCategory/)
    expect(actions).not.toMatch(/upsert\(/)
    expect(actions).not.toMatch(/teks\(formData, 'category'\)/)
  })

  it('halaman baru hanya mengambil kategori aktif', () => {
    const page = readFileSync(path.join(newsDir, 'new', 'page.tsx'), 'utf8')
    expect(page).toMatch(/isActive:\s*true/)
  })

  it('halaman edit menyertakan current lewat activePlusCurrent dan categoryId', () => {
    const page = readFileSync(path.join(newsDir, '[id]', 'page.tsx'), 'utf8')
    expect(page).toMatch(/activePlusCurrent/)
    expect(page).toMatch(/categoryId:/)
  })
})

describe('dropdown pertandingan memakai turnamen aktif', () => {
  const matchesDir = path.join(process.cwd(), 'app', 'cms', 'matches')

  it('halaman baru hanya mengambil turnamen aktif', () => {
    const page = readFileSync(path.join(matchesDir, 'new', 'page.tsx'), 'utf8')
    expect(page).toMatch(/isActive:\s*true/)
  })

  it('halaman edit menyertakan current lewat activePlusCurrent', () => {
    const page = readFileSync(path.join(matchesDir, '[id]', 'page.tsx'), 'utf8')
    expect(page).toMatch(/activePlusCurrent/)
  })
})
