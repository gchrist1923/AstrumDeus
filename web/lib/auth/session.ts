import { cookies } from 'next/headers'
import type { GrantMatrix } from '@/lib/auth/grants'
import { getUserMatrix } from '@/lib/auth/load-matrix'
import { parseRoles, type Role } from '@/lib/auth/roles'
import { prisma } from '@/lib/db'

export const SESSION_COOKIE = 'ad_session'
const MAX_AGE = 60 * 60 * 24 * 14

export interface AuthUser {
  id: string
  email: string
  name: string
  roles: Role[]
  matrix: GrantMatrix
}

export async function createSession(userId: string): Promise<void> {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + MAX_AGE * 1000),
    },
  })

  const jar = await cookies()
  jar.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  const id = jar.get(SESSION_COOKIE)?.value

  if (id) {
    await prisma.session.deleteMany({ where: { id } })
    jar.delete(SESSION_COOKIE)
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const jar = await cookies()
  const id = jar.get(SESSION_COOKIE)?.value

  if (!id) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!session || session.expiresAt.getTime() < Date.now() || !session.user.isActive) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    roles: parseRoles(session.user.roles),
    matrix: await getUserMatrix(session.user.id),
  }
}
