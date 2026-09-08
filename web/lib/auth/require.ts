import { redirect } from 'next/navigation'
import { canAccessCms, canAccessInternal, type Role } from '@/lib/auth/roles'
import { getCurrentUser, type AuthUser } from '@/lib/auth/session'

export async function requireCmsUser(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user || !canAccessCms(user.roles)) {
    redirect('/login?next=/cms')
  }

  return user
}

export async function requireInternalUser(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user || !canAccessInternal(user.roles)) {
    redirect('/login?next=/internal')
  }

  return user
}

export function assertRoles(user: AuthUser, allowed: Role[]): void {
  if (!allowed.some((role) => user.roles.includes(role))) {
    redirect('/cms')
  }
}
