import { describe, expect, it } from 'vitest'
import { adminPathAktif } from '@/lib/admin/nav-aktif'

describe('adminPathAktif', () => {
  it('ringkasan hanya aktif di path persis', () => {
    expect(adminPathAktif('/cms', '/cms')).toBe(true)
    expect(adminPathAktif('/cms', '/cms/news')).toBe(false)
    expect(adminPathAktif('/internal', '/internal')).toBe(true)
    expect(adminPathAktif('/internal', '/internal/schedule')).toBe(false)
  })

  it('menu lain aktif di diri sendiri dan turunan', () => {
    expect(adminPathAktif('/cms/news', '/cms/news')).toBe(true)
    expect(adminPathAktif('/cms/news', '/cms/news/new')).toBe(true)
    expect(adminPathAktif('/cms/news', '/cms/players')).toBe(false)
  })
})
