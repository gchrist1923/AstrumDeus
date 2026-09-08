import { prisma } from '@/lib/db'
import { legacyRolesJsonFromSlugs } from '@/lib/auth/roles'

export async function rewriteLegacyRolesForUsers(userIds: string[]): Promise<void> {
  for (const userId of new Set(userIds)) {
    const remaining = await prisma.userAccessRole.findMany({
      where: { userId },
      include: { role: true },
    })
    await prisma.user.update({
      where: { id: userId },
      data: { roles: legacyRolesJsonFromSlugs(remaining.map((row) => row.role.slug)) },
    })
  }
}
