import Link from 'next/link'
import { notFound } from 'next/navigation'
import { deleteCustomPage, saveLayout, updateCustomPage } from '@/app/cms/halaman/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { Field, KELAS_FOKUS, KELAS_KONTROL } from '@/components/admin/form-field'
import { PageCanvas } from '@/components/admin/page-canvas'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { BUILTIN_PAGES } from '@/lib/pages/builtins'
import { shouldEditOnCanvas } from '@/lib/pages/should-edit-on-canvas'
import type { PageRow } from '@/lib/pages/types'

function parseLayout(raw: string): PageRow[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PageRow[]) : []
  } catch {
    return []
  }
}

export default async function HalamanKanvasPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'view')
  const bisaHapus = can(user.matrix, 'halaman', 'delete')
  const { id } = await params
  const page = await prisma.sitePage.findUnique({ where: { id } })
  if (!page) {
    notFound()
  }

  if (!shouldEditOnCanvas(page.kind)) {
    const builtin = BUILTIN_PAGES.find((item) => item.menuKey === page.menuKey)
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header>
          <h2 className="font-display text-section uppercase">{page.title}</h2>
          <p className="mt-3 text-body text-content-secondary">
            Isi halaman ini diubah lewat form CMS, bukan kanvas.
          </p>
        </header>
        {builtin ? (
          <Link
            href={builtin.editHref}
            className={`inline-flex min-h-11 items-center font-display text-label uppercase text-accent underline ${KELAS_FOKUS}`}
          >
            Ubah isi
          </Link>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-16">
      <header>
        <h2 className="font-display text-section uppercase">{page.title}</h2>
        <p className="mt-3 text-body text-content-secondary">
          Kisi 12 kolom. Di layar sempit tiap blok turun penuh.
        </p>
      </header>

      <form action={updateCustomPage} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <input type="hidden" name="id" value={page.id} />
        <Field id="title" label="Judul">
          <input
            id="title"
            name="title"
            required
            defaultValue={page.title}
            className={KELAS_KONTROL}
          />
        </Field>
        <Field id="status" label="Status">
          <select id="status" name="status" defaultValue={page.status} className={KELAS_KONTROL}>
            <option value="draft">Draf</option>
            <option value="published">Terbit</option>
          </select>
        </Field>
        <input type="hidden" name="showInNav" value="0" />
        <label className="flex min-h-11 items-center gap-3">
          <input
            id="showInNav"
            name="showInNav"
            type="checkbox"
            value="on"
            defaultChecked={page.showInNav}
            className="size-5 accent-accent"
          />
          <span className="font-display text-label uppercase">Tampil di navigasi</span>
        </label>
        <input type="hidden" name="isEnabled" value="0" />
        <label className="flex min-h-11 items-center gap-3">
          <input
            id="isEnabled"
            name="isEnabled"
            type="checkbox"
            value="on"
            defaultChecked={page.isEnabled}
            className="size-5 accent-accent"
          />
          <span className="font-display text-label uppercase">Halaman nyala</span>
        </label>
        <Button type="submit">Simpan status</Button>
      </form>

      {bisaHapus ? (
        <form action={deleteCustomPage} className="mx-auto w-full max-w-2xl">
          <input type="hidden" name="id" value={page.id} />
          <ConfirmSubmit message="Hapus halaman ini?" variant="destructive">
            Hapus
          </ConfirmSubmit>
        </form>
      ) : null}

      <section className="flex flex-col gap-6">
        <h3 className="font-display text-card uppercase">Kanvas</h3>
        <PageCanvas pageId={page.id} initialRows={parseLayout(page.layout)} action={saveLayout} />
      </section>
    </div>
  )
}
