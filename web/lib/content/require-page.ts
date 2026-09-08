import { notFound } from 'next/navigation'
import { MENU_FLAGS } from '@/lib/content/flags'
import { isMenuEnabled, type NavKey } from '@/lib/nav'
import type { MenuFlags } from '@/lib/nav'

export function requirePage(key: NavKey, flags: MenuFlags = MENU_FLAGS): void {
  if (!isMenuEnabled(key, flags)) {
    notFound()
  }
}
