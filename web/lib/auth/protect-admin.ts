import { isAdminMatrixReduced, type GrantMatrix } from '@/lib/auth/grants'

export function assertAdminRoleMutation(
  role: { isAdmin: boolean },
  next?: GrantMatrix,
): 'ok' | 'hapus' | 'kurangi' {
  if (role.isAdmin && next === undefined) {
    return 'hapus'
  }

  if (role.isAdmin && next && isAdminMatrixReduced(next)) {
    return 'kurangi'
  }

  return 'ok'
}
