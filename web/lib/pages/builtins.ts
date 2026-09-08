import { applyMenuToggle } from '@/lib/content/menu'
import { NAV_ITEMS, type NavKey } from '@/lib/nav'

export type BuiltinKind = 'builtin'

export interface BuiltinPage {
  menuKey: NavKey
  slug: string
  title: string
  href: string
  mandatory: boolean
  kind: BuiltinKind
  editHref: string
}

const EDIT_HREFS: Record<NavKey, string> = {
  home: '/cms/settings',
  roster: '/cms/players',
  matches: '/cms/matches',
  news: '/cms/news',
  'media-kit': '/cms/media-kit',
  partners: '/cms/partners',
  contact: '/cms/inbox',
}

export const BUILTIN_PAGES: readonly BuiltinPage[] = NAV_ITEMS.map((item) => ({
  menuKey: item.key,
  slug: item.key,
  title: item.label,
  href: item.href,
  mandatory: item.mandatory,
  kind: 'builtin',
  editHref: EDIT_HREFS[item.key],
}))

export function applyBuiltinToggle(mandatory: boolean, enabled: boolean): boolean {
  const result = applyMenuToggle({ isMandatory: mandatory, isEnabled: true }, enabled)
  if (!result.ok) {
    throw new Error(result.error)
  }

  return result.isEnabled
}
