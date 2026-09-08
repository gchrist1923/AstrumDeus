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
