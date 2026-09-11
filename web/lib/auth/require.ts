import { redirect } from 'next/navigation'
import { can, type AccessAction, type AccessModule } from '@/lib/auth/grants'
import {
  canAccessCms,
  canAccessInternal,
  canReadCashBook,
  redirectForModule,
} from '@/lib/auth/permissions'
import { getCurrentUser, type AuthUser } from '@/lib/auth/session'

export async function requireCmsUser(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user || !canAccessCms(user.matrix)) {
    redirect('/login?next=/cms')
  }

  return user
}

export async function requireInternalUser(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user || !canAccessInternal(user.matrix)) {
    redirect('/login?next=/internal')
  }

  return user
}

export function requireGrant(user: AuthUser, module: AccessModule, action: AccessAction): void {
  if (!can(user.matrix, module, action)) {
    redirect(redirectForModule(module))
  }
}

export function requireCashView(user: AuthUser): void {
  if (!canReadCashBook(user.matrix, 'operasional') && !canReadCashBook(user.matrix, 'tim')) {
    redirect('/internal')
  }
}

export function requireCashBookView(user: AuthUser, type: 'operasional' | 'tim'): void {
  if (!canReadCashBook(user.matrix, type)) {
    redirect('/internal')
  }
}
