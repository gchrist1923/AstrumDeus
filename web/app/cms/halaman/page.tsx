import Link from 'next/link'
import { deleteCustomPage, toggleBuiltinEnabled } from '@/app/cms/halaman/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { KELAS_FOKUS } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { BUILTIN_PAGES } from '@/lib/pages/builtins'

export default async function CmsHalamanPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'view')
  const bisaToggle = can(user.matrix, 'menu', 'update')
  const bisaBuat = can(user.matrix, 'halaman', 'create')
  const bisaHapus = can(user.matrix, 'halaman', 'delete')

  const pages = await prisma.sitePage.findMany()
  const byMenuKey = new Map(pages.map((page) => [page.menuKey, page]))
  const builtins = BUILTIN_PAGES.flatMap((def) => {
    const row = byMenuKey.get(def.menuKey)
    return row ? [{ ...def, id: row.id, isEnabled: row.isEnabled, status: row.status }] : []
  })
  const custom = pages.filter((page) => page.kind === 'custom')

  return (
    <div className="flex flex-col gap-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-section uppercase">Halaman</h2>
          <p className="mt-3 max-w-2xl text-body text-content-secondary">
            Isi tujuh rute bawaan diubah lewat form CMS, bukan kanvas. Home, News, dan Contact wajib
            tetap nyala.
          </p>
        </div>
        {bisaBuat ? (
          <Link
            href="/cms/halaman/new"
            className={`inline-flex min-h-11 items-center bg-accent px-6 font-display text-label uppercase text-surface-raised ${KELAS_FOKUS}`}
          >
            Halaman baru
          </Link>
        ) : null}
      </header>

      <section className="flex flex-col gap-6">
        <h3 className="font-display text-card uppercase">Daftar halaman</h3>
        {builtins.length === 0 && custom.length === 0 ? (
          <p className="text-content-secondary">Belum ada halaman.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-border-strong text-left">
              <thead>
                <tr className="border-b-2 border-border-strong">
                  <th className="px-4 py-3 font-display text-label uppercase">Judul</th>
                  <th className="px-4 py-3 font-display text-label uppercase">Slug</th>
                  <th className="px-4 py-3 font-display text-label uppercase">Jenis</th>
                  <th className="px-4 py-3 font-display text-label uppercase">Status</th>
                  <th className="px-4 py-3 font-display text-label uppercase">Tampil</th>
                  <th className="px-4 py-3 font-display text-label uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {builtins.map((page) => (
                  <tr key={page.id} className="border-b border-border-strong">
                    <th scope="row" className="px-4 py-3 font-display text-body font-semibold">
                      {page.title}
                    </th>
                    <td className="px-4 py-3 text-small text-content-muted">{page.href}</td>
                    <td className="px-4 py-3 text-body">Bawaan</td>
                    <td className="px-4 py-3 text-body">
                      {page.status === 'published' ? 'Terbit' : 'Draf'}
                    </td>
                    <td className="px-4 py-3">
                      <form action={toggleBuiltinEnabled}>
                        <input type="hidden" name="menuKey" value={page.menuKey} />
                        <input type="hidden" name="enabled" value={page.isEnabled ? '0' : '1'} />
                        <Button
                          type="submit"
                          variant="secondary"
                          disabled={page.mandatory || !bisaToggle}
                          aria-label={
                            page.isEnabled ? `Matikan ${page.title}` : `Nyalakan ${page.title}`
                          }
                        >
                          {page.isEnabled ? 'Y' : 'N'}
                        </Button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={page.editHref}
                        className={`inline-flex min-h-11 items-center font-display text-label uppercase text-accent underline ${KELAS_FOKUS}`}
                      >
                        Ubah isi
                      </Link>
                    </td>
                  </tr>
                ))}
                {custom.map((page) => (
                  <tr key={page.id} className="border-b border-border-strong">
                    <th scope="row" className="px-4 py-3 font-display text-body font-semibold">
                      {page.title}
                    </th>
                    <td className="px-4 py-3 text-small text-content-muted">/{page.slug}</td>
                    <td className="px-4 py-3 text-body">
                      {page.kind === 'custom' ? 'Kustom' : 'Bawaan'}
                    </td>
                    <td className="px-4 py-3 text-body">
                      {page.status === 'published' ? 'Terbit' : 'Draf'}
                    </td>
                    <td className="px-4 py-3 font-display text-label uppercase">
                      {page.isEnabled ? 'Y' : 'N'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {page.kind === 'custom' ? (
                          <Link
                            href={`/cms/halaman/${page.id}`}
                            className={`inline-flex min-h-11 items-center font-display text-label uppercase text-accent underline ${KELAS_FOKUS}`}
                          >
                            Kanvas
                          </Link>
                        ) : null}
                        {page.kind === 'custom' && bisaHapus ? (
                          <form action={deleteCustomPage}>
                            <input type="hidden" name="id" value={page.id} />
                            <ConfirmSubmit message="Hapus halaman ini?" variant="destructive">
                              Hapus
                            </ConfirmSubmit>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
