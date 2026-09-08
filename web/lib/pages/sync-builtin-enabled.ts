export function builtinEnabledUpdates(menuKey: string, isEnabled: boolean) {
  return {
    menuItem: {
      where: { key: menuKey },
      data: { isEnabled },
    },
    sitePage: {
      where: { menuKey },
      data: { isEnabled },
    },
  }
}

export type BuiltinEnabledClient = {
  $transaction: (ops: unknown[]) => Promise<unknown>
  menuItem: {
    update: (args: { where: { key: string }; data: { isEnabled: boolean } }) => unknown
  }
  sitePage: {
    update: (args: { where: { menuKey: string }; data: { isEnabled: boolean } }) => unknown
  }
}

export async function syncBuiltinEnabled(
  db: BuiltinEnabledClient,
  menuKey: string,
  isEnabled: boolean,
): Promise<void> {
  const updates = builtinEnabledUpdates(menuKey, isEnabled)
  await db.$transaction([
    db.menuItem.update(updates.menuItem),
    db.sitePage.update(updates.sitePage),
  ])
}
