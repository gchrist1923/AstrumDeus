import { notFound } from 'next/navigation'
import { MENU_FLAGS } from '@/lib/content/flags'
import { isMenuEnabled, type NavKey } from '@/lib/nav'

export function requirePage(key: NavKey): void {
  if (!isMenuEnabled(key, MENU_FLAGS)) {
    notFound()
  }
}
