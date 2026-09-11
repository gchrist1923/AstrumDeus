import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { YoutubePlayer } from '@/components/public/youtube-player'

describe('YoutubePlayer', () => {
  it('menampilkan cover lalu iframe setelah klik', () => {
    render(<YoutubePlayer url="https://youtu.be/dQw4w9wgGcQ" />)
    const cover = screen.getByRole('button', { name: 'Putar video' }).querySelector('img')
    expect(cover).toHaveAttribute(
      'src',
      'https://i.ytimg.com/vi/dQw4w9wgGcQ/hqdefault.jpg',
    )
    expect(screen.queryByTitle('Video YouTube')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Putar video' }))
    expect(screen.getByTitle('Video YouTube')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/dQw4w9wgGcQ?autoplay=1',
    )
  })

  it('URL non-YouTube menampilkan tautan teks', () => {
    render(<YoutubePlayer url="https://example.com/film" />)
    expect(screen.getByRole('link', { name: 'https://example.com/film' })).toHaveAttribute(
      'href',
      'https://example.com/film',
    )
    expect(screen.queryByRole('button', { name: 'Putar video' })).not.toBeInTheDocument()
  })
})
