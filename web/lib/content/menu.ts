export function applyMenuToggle(
  item: { isMandatory: boolean; isEnabled: boolean },
  enabled: boolean,
): { ok: true; isEnabled: boolean } | { ok: false; error: string } {
  if (item.isMandatory) {
    return { ok: false, error: 'Menu wajib tidak bisa dimatikan.' }
  }

  return { ok: true, isEnabled: enabled }
}
