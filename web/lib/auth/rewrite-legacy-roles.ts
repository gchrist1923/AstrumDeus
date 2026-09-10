import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { legacyRolesJsonFromSlugs } from '@/lib/auth/roles'

type RoleStore = Prisma.TransactionClient | typeof prisma

export async function rewriteLegacyRolesForUsers(
  userIds: string[],
  db: RoleStore = prisma,
): Promise<void> {
  for (const userId of new Set(userIds)) {
    const remaining = await db.userAccessRole.findMany({
      where: { userId },
      include: { role: true },
    })
    await db.user.update({
      where: { id: userId },
      data: { roles: legacyRolesJsonFromSlugs(remaining.map((row) => row.role.slug)) },
    })
  }
}
