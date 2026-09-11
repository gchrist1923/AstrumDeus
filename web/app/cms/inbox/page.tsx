import { deleteInboxMessage } from '@/app/cms/inbox/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { Field, KELAS_FOKUS, KELAS_KONTROL } from '@/components/admin/form-field'
import { Pager } from '@/components/admin/pager'
import { Button } from '@/components/ui/button'
import { pageFromQuery, paginate } from '@/lib/admin/paginate'
import { ringkasPesan } from '@/lib/admin/ringkas-pesan'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { toDateInput } from '@/lib/datetime'

const KELAS_SEL_INBOX =
  'border-b border-border-strong px-4 py-3 max-md:block max-md:border-b-0 max-md:px-3 max-md:py-2 max-md:before:mb-1 max-md:before:block max-md:before:font-display max-md:before:text-label max-md:before:uppercase max-md:before:text-content-muted max-md:before:content-[attr(data-label)]'

function hrefInbox(q: string, hal: number): string {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (hal > 1) params.set('hal', String(hal))
  const qs = params.toString()
  return qs ? `/cms/inbox?${qs}` : '/cms/inbox'
}

function hrefPesan(id: string, q: string, hal: number): string {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (hal > 1) params.set('hal', String(hal))
  const qs = params.toString()
  return qs ? `/cms/inbox/${id}?${qs}` : `/cms/inbox/${id}`
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hal?: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'inbox', 'view')
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const bisaHapus = can(user.matrix, 'inbox', 'delete')

  const where = q
    ? {
        OR: [
          { subject: { contains: q } },
          { email: { contains: q } },
          { name: { contains: q } },
        ],
      }
    : {}

  const total = await prisma.contactMessage.count({ where })
  const paging = paginate({ total, page: pageFromQuery(params.hal) })
  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: paging.skip,
    take: paging.take,
  })

  return (
    <div>
      <h2 className="mb-6 font-display text-section uppercase">Kotak masuk</h2>
      <form method="get" action="/cms/inbox" className="mb-6 max-w-xl">
        <Field id="q" label="Cari">
          <input id="q" name="q" defaultValue={q} className={KELAS_KONTROL} />
        </Field>
        <Button type="submit" className="mt-4">
          Cari
        </Button>
      </form>
      {messages.length === 0 ? (
        <p className="text-content-secondary">{q ? 'Tidak ada pesan yang cocok.' : 'Belum ada pesan.'}</p>
      ) : (
        <div>
          <table className="w-full border-2 border-border-strong text-left max-md:block max-md:border-0">
            <thead className="max-md:sr-only">
              <tr className="font-display text-label uppercase text-content-muted">
                <th className="border-b-2 border-border-strong px-4 py-3">Status</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Subjek</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Pengirim</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Tanggal</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Pesan</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="max-md:block">
              {messages.map((message) => (
                <tr
                  key={message.id}
                  className="relative align-top max-md:mb-4 max-md:block max-md:border-2 max-md:border-border-strong"
                >
                  <td data-label="Status" className={`${KELAS_SEL_INBOX} font-display text-label uppercase text-accent`}>
                    {message.status}
                  </td>
                  <td data-label="Subjek" className={`${KELAS_SEL_INBOX} font-display text-body font-semibold`}>
                    <a href={hrefPesan(message.id, q, paging.page)} className={`after:absolute after:inset-0 ${KELAS_FOKUS}`}>
                      {message.subject}
                    </a>
                  </td>
                  <td data-label="Pengirim" className={`${KELAS_SEL_INBOX} text-small text-content-muted`}>
                    {message.name} · {message.email}
                  </td>
                  <td data-label="Tanggal" className={`${KELAS_SEL_INBOX} text-small text-content-muted`}>
                    {toDateInput(message.createdAt)}
                  </td>
                  <td data-label="Pesan" className={`${KELAS_SEL_INBOX} text-body text-pretty`}>
                    {ringkasPesan(message.message)}
                  </td>
                  <td data-label="Aksi" className={`${KELAS_SEL_INBOX} relative z-10`}>
                    {bisaHapus ? (
                      <form action={deleteInboxMessage}>
                        <input type="hidden" name="id" value={message.id} />
                        <input type="hidden" name="q" value={q} />
                        <input type="hidden" name="hal" value={String(paging.page)} />
                        <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
                          Hapus
                        </ConfirmSubmit>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager page={paging.page} pageCount={paging.pageCount} hrefFor={(hal) => hrefInbox(q, hal)} />
    </div>
  )
}
