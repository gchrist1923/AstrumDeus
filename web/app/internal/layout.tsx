import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { requireInternalUser } from '@/lib/auth/require'

export default async function InternalLayout({ children }: { children: ReactNode }) {
  const user = await requireInternalUser()

  return (
    <AdminShell title="Operasi tim" area="internal" matrix={user.matrix} name={user.name}>
      {children}
    </AdminShell>
  )
}
