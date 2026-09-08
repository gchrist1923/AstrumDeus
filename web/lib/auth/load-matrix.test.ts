import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    userAccessRole: { findMany: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}))

import { prisma } from '@/lib/db'
import {
  adminTemplate,
  can,
  editorTemplate,
  emptyMatrix,
  financeTemplate,
  teamTemplate,
} from '@/lib/auth/grants'
import { getUserMatrix, matrixFromLegacyRoles } from '@/lib/auth/load-matrix'

describe('matrixFromLegacyRoles', () => {
  it('unions templates for included roles', () => {
    const matrix = matrixFromLegacyRoles(['editor', 'finance'])
    expect(can(matrix, 'news', 'update')).toBe(true)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
    expect(can(matrix, 'peran', 'view')).toBe(false)
  })

  it('maps each legacy role to its template', () => {
    expect(matrixFromLegacyRoles(['admin'])).toEqual(adminTemplate())
    expect(matrixFromLegacyRoles(['editor'])).toEqual(editorTemplate())
    expect(matrixFromLegacyRoles(['team'])).toEqual(teamTemplate())
    expect(matrixFromLegacyRoles(['finance'])).toEqual(financeTemplate())
  })

  it('empty roles returns emptyMatrix', () => {
    expect(matrixFromLegacyRoles([])).toEqual(emptyMatrix())
  })
})

describe('getUserMatrix', () => {
  beforeEach(() => {
    vi.mocked(prisma.userAccessRole.findMany).mockReset()
    vi.mocked(prisma.user.findUnique).mockReset()
  })

  it('unions two role JSON matrices', async () => {
    vi.mocked(prisma.userAccessRole.findMany).mockResolvedValue([
      {
        userId: 'u1',
        roleId: 'r1',
        role: { grants: JSON.stringify(editorTemplate()) },
      },
      {
        userId: 'u1',
        roleId: 'r2',
        role: { grants: JSON.stringify(financeTemplate()) },
      },
    ] as never)

    const matrix = await getUserMatrix('u1')
    expect(can(matrix, 'news', 'update')).toBe(true)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
    expect(can(matrix, 'peran', 'view')).toBe(false)
  })

  it('falls back to matrixFromLegacyRoles when no UserAccessRole', async () => {
    vi.mocked(prisma.userAccessRole.findMany).mockResolvedValue([])
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'u1',
      roles: JSON.stringify(['editor']),
    } as never)

    const matrix = await getUserMatrix('u1')
    expect(matrix).toEqual(editorTemplate())
  })

  it('empty roles and no rows returns empty matrix', async () => {
    vi.mocked(prisma.userAccessRole.findMany).mockResolvedValue([])
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'u1',
      roles: JSON.stringify([]),
    } as never)

    const matrix = await getUserMatrix('u1')
    expect(matrix).toEqual(emptyMatrix())
  })
})
