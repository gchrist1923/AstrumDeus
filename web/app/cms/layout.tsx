import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { requireCmsUser } from '@/lib/auth/require'

export default async function CmsLayout({ children }: { children: ReactNode }) {
  const user = await requireCmsUser()

  return (
    <AdminShell title="Konten publik" area="cms" roles={user.roles} name={user.name}>
      {children}
    </AdminShell>
  )
}
