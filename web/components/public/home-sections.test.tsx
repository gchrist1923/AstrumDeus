import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeSections } from '@/components/public/home-sections'
import { getHomeContent } from '@/lib/content/dummy'

const FLAGS = { roster: true, matches: true, 'media-kit': true, partners: true }

describe('HomeSections hero', () => {
  it('memakai copy dan gambar hero dari props', () => {
    render(
      <HomeSections
        flags={FLAGS}
        content={getHomeContent()}
        hero={{
          eyebrow: 'MLBB · Jakarta',
          title: 'AD Esports',
          tagline: 'Paragraf hero CMS',
          image: '/media/hero.png',
          imageAlt: 'Foto roster',
        }}
      />,
    )

    expect(screen.getByText('MLBB · Jakarta')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AD Esports' })).toBeInTheDocument()
    expect(screen.getByText('Paragraf hero CMS')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Foto roster' })).toHaveAttribute('src', '/media/hero.png')
    expect(screen.queryByText('PUBG Mobile · Indonesia')).not.toBeInTheDocument()
  })
})
