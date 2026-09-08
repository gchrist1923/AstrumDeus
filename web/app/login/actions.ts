'use server'

import { redirect } from 'next/navigation'
import { verifyPassword } from '@/lib/auth/password'
import { canAccessCms, canAccessInternal, parseRoles } from '@/lib/auth/roles'
import { createSession, destroySession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'

function teks(formData: FormData, kunci: string): string {
  const nilai = formData.get(kunci)
  return typeof nilai === 'string' ? nilai.trim() : ''
}

function safeNext(raw: string): string {
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return raw
  }

  return '/cms'
}

export async function loginAction(formData: FormData): Promise<{ error: string }> {
  const email = teks(formData, 'email').toLowerCase()
  const password = typeof formData.get('password') === 'string' ? String(formData.get('password')) : ''
  const next = safeNext(teks(formData, 'next') || '/cms')

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    return { error: 'Email atau kata sandi salah.' }
  }

  await createSession(user.id)

  const roles = parseRoles(user.roles)

  if (next.startsWith('/internal')) {
    redirect(canAccessInternal(roles) ? next : canAccessCms(roles) ? '/cms' : '/login')
  }

  if (next.startsWith('/cms')) {
    redirect(canAccessCms(roles) ? next : canAccessInternal(roles) ? '/internal' : '/login')
  }

  redirect(canAccessCms(roles) ? '/cms' : '/internal')
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/login')
}
