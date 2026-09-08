export const ROLES = ['admin', 'editor', 'team', 'finance'] as const

export type Role = (typeof ROLES)[number]

const ROLE_SET = new Set<string>(ROLES)

export function parseRoles(raw: string): Role[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is Role => typeof item === 'string' && ROLE_SET.has(item))
  } catch {
    return []
  }
}

export function hasRole(roles: Role[], role: Role): boolean {
  return roles.includes(role)
}

export function canAccessCms(roles: Role[]): boolean {
  return hasRole(roles, 'admin') || hasRole(roles, 'editor')
}

export function canAccessInternal(roles: Role[]): boolean {
  return hasRole(roles, 'admin') || hasRole(roles, 'team') || hasRole(roles, 'finance')
}

export function canToggleMenu(roles: Role[]): boolean {
  return hasRole(roles, 'admin')
}

export function canManageSettings(roles: Role[]): boolean {
  return hasRole(roles, 'admin')
}

export function canWriteContent(roles: Role[]): boolean {
  return hasRole(roles, 'admin') || hasRole(roles, 'editor')
}

export function canReadReports(roles: Role[]): boolean {
  return hasRole(roles, 'admin') || hasRole(roles, 'finance')
}

export function canWriteSchedule(roles: Role[], ownerId: string, actorId = 'saya'): boolean {
  if (hasRole(roles, 'admin')) {
    return true
  }

  return hasRole(roles, 'team') && ownerId === actorId
}

export function canWriteCashBook(
  roles: Role[],
  bookType: 'operasional' | 'tim',
  recordedById: string,
  actorId = 'saya',
): boolean {
  if (hasRole(roles, 'finance')) {
    return true
  }

  if (bookType === 'tim' && hasRole(roles, 'team')) {
    return recordedById === actorId
  }

  return false
}

export function canReadCashBook(roles: Role[], bookType: 'operasional' | 'tim'): boolean {
  if (hasRole(roles, 'admin') || hasRole(roles, 'finance')) {
    return true
  }

  return bookType === 'tim' && hasRole(roles, 'team')
}
