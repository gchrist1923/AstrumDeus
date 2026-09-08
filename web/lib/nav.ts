export type NavKey = 'home' | 'roster' | 'matches' | 'news' | 'media-kit' | 'partners' | 'contact'

export interface NavItem {
  key: NavKey
  label: string
  href: string
  mandatory: boolean
}

export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'home', label: 'Home', href: '/', mandatory: true },
  { key: 'roster', label: 'Roster', href: '/roster', mandatory: false },
  { key: 'matches', label: 'Matches', href: '/matches', mandatory: false },
  { key: 'news', label: 'News', href: '/news', mandatory: true },
  { key: 'media-kit', label: 'Media Kit', href: '/media-kit', mandatory: false },
  { key: 'partners', label: 'Partners', href: '/partners', mandatory: false },
  { key: 'contact', label: 'Contact', href: '/contact', mandatory: true },
]

export type MenuFlags = Partial<Record<NavKey, boolean>>

export function getVisibleNavItems(flags: MenuFlags = {}): NavItem[] {
  return NAV_ITEMS.filter((item) => item.mandatory || flags[item.key] === true)
}

export function isMenuEnabled(key: NavKey, flags: MenuFlags = {}): boolean {
  const item = NAV_ITEMS.find((kandidat) => kandidat.key === key)

  if (!item) {
    return false
  }

  return item.mandatory || flags[key] === true
}

export interface ExtraNavItem {
  label: string
  href: string
}

export function mergeNav(base: NavItem[], extra: ExtraNavItem[] = []): ExtraNavItem[] {
  return [
    ...base.map(({ label, href }) => ({ label, href })),
    ...extra,
  ]
}
