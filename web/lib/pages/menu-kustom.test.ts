import { describe, expect, it } from 'vitest'
import { customFieldName, customPagesForMenu } from '@/lib/pages/menu-kustom'

const academy = {
  id: 'p1',
  title: 'Academy',
  kind: 'custom',
  status: 'published',
  isEnabled: true,
}

describe('customPagesForMenu', () => {
  it('hanya custom yang terbit', () => {
    expect(
      customPagesForMenu([
        academy,
        { ...academy, id: 'd1', title: 'Draf', status: 'draft' },
        { id: 'h', title: 'Home', kind: 'builtin', status: 'published', isEnabled: true },
      ]),
    ).toEqual([
      { id: 'p1', title: 'Academy', isEnabled: true, fieldName: 'custom:p1' },
    ])
  })

  it('mengurutkan menurut judul', () => {
    const hasil = customPagesForMenu([
      { ...academy, id: 'z', title: 'Zebra' },
      { ...academy, id: 'a', title: 'Academy' },
    ])
    expect(hasil.map((item) => item.title)).toEqual(['Academy', 'Zebra'])
  })
})

describe('customFieldName', () => {
  it('memakai prefix custom:', () => {
    expect(customFieldName('abc')).toBe('custom:abc')
  })
})
