import {
  adminTemplate,
  editorTemplate,
  emptyMatrix,
  financeTemplate,
  teamTemplate,
  unionMatrices,
  type GrantMatrix,
} from '@/lib/auth/grants'
import { parseRoles, type Role } from '@/lib/auth/roles'
import { prisma } from '@/lib/db'

export function matrixFromLegacyRoles(roles: Role[]): GrantMatrix {
  const parts: GrantMatrix[] = []
  if (roles.includes('admin')) {
    parts.push(adminTemplate())
  }
  if (roles.includes('editor')) {
    parts.push(editorTemplate())
  }
  if (roles.includes('team')) {
    parts.push(teamTemplate())
  }
  if (roles.includes('finance')) {
    parts.push(financeTemplate())
  }
  return unionMatrices(parts)
}

export async function getUserMatrix(userId: string): Promise<GrantMatrix> {
  const rows = await prisma.userAccessRole.findMany({
    where: { userId },
    include: { role: true },
  })

  if (rows.length > 0) {
    return unionMatrices(rows.map((row) => JSON.parse(row.role.grants) as GrantMatrix))
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return emptyMatrix()
  }

  return matrixFromLegacyRoles(parseRoles(user.roles))
}
