import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    userAccessRole: { findMany: vi.fn() },
    user: { update: vi.fn() },
  },
}))

import { prisma } from '@/lib/db'
import { rewriteLegacyRolesForUsers } from '@/lib/auth/rewrite-legacy-roles'

describe('rewriteLegacyRolesForUsers', () => {
  beforeEach(() => {
    vi.mocked(prisma.userAccessRole.findMany).mockReset()
    vi.mocked(prisma.user.update).mockReset()
    vi.mocked(prisma.user.update).mockResolvedValue({} as never)
  })

  it('menulis ulang JSON dari slug UserAccessRole yang tersisa', async () => {
    vi.mocked(prisma.userAccessRole.findMany).mockResolvedValue([
      { userId: 'u1', roleId: 'r-team', role: { slug: 'team' } },
    ] as never)

    await rewriteLegacyRolesForUsers(['u1'])

    expect(prisma.userAccessRole.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      include: { role: true },
    })
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { roles: JSON.stringify(['team']) },
    })
  })

  it('mengosongkan JSON jika join tersisa tidak ada', async () => {
    vi.mocked(prisma.userAccessRole.findMany).mockResolvedValue([])

    await rewriteLegacyRolesForUsers(['u1'])

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { roles: '[]' },
    })
  })

  it('membuang slug kustom saat menulis ulang leftover JSON', async () => {
    vi.mocked(prisma.userAccessRole.findMany).mockResolvedValue([
      { userId: 'u1', roleId: 'r-editor', role: { slug: 'editor' } },
      { userId: 'u1', roleId: 'r-ops', role: { slug: 'custom-ops' } },
    ] as never)

    await rewriteLegacyRolesForUsers(['u1'])

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { roles: JSON.stringify(['editor']) },
    })
  })
})
