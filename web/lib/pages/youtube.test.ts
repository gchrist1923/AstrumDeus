import { describe, expect, it } from 'vitest'
import { youtubeCover, youtubeId } from '@/lib/pages/youtube'

describe('youtubeId', () => {
  it('mengambil id dari watch, youtu.be, dan embed', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=dQw4w9wgGcQ')).toBe('dQw4w9wgGcQ')
    expect(youtubeId('https://youtu.be/dQw4w9wgGcQ')).toBe('dQw4w9wgGcQ')
    expect(youtubeId('https://www.youtube.com/embed/dQw4w9wgGcQ')).toBe('dQw4w9wgGcQ')
  })

  it('menolak URL non-YouTube', () => {
    expect(youtubeId('https://vimeo.com/123')).toBeNull()
    expect(youtubeId('bukan-url')).toBeNull()
  })
})

describe('youtubeCover', () => {
  it('mengembalikan thumbnail hqdefault', () => {
    expect(youtubeCover('https://youtu.be/dQw4w9wgGcQ')).toBe(
      'https://i.ytimg.com/vi/dQw4w9wgGcQ/hqdefault.jpg',
    )
  })
})
