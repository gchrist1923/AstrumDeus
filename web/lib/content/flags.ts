import type { MenuFlags, NavKey } from '@/lib/nav'

export const MENU_FLAGS: MenuFlags = {
  roster: true,
  matches: true,
  'media-kit': true,
  partners: true,
}

export async function getMenuFlags(): Promise<MenuFlags> {
  try {
    const { prisma } = await import('@/lib/db')
    const items = await prisma.menuItem.findMany()

    if (items.length === 0) {
      return MENU_FLAGS
    }

    const flags: MenuFlags = {}

    for (const item of items) {
      if (!item.isMandatory) {
        flags[item.key as NavKey] = item.isEnabled
      }
    }

    return flags
  } catch {
    return MENU_FLAGS
  }
}
