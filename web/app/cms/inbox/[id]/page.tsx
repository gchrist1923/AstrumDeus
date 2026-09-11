import { notFound } from 'next/navigation'
import { deleteInboxMessage, tandaiInboxDibaca } from '@/app/cms/inbox/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { toDateInput } from '@/lib/datetime'
import { prisma } from '@/lib/db'

export default async function InboxDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string; hal?: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'inbox', 'view')
  const { id } = await params
  const query = await searchParams
  const q = (query.q ?? '').trim()
  const hal = query.hal ?? ''

  const message = await prisma.contactMessage.findUnique({ where: { id } })
  if (!message) {
    notFound()
  }

  await tandaiInboxDibaca(id, user.id)
  const status = message.status === 'baru' ? 'dibaca' : message.status
  const bisaHapus = can(user.matrix, 'inbox', 'delete')

  return (
    <div className="max-w-xl">
      <p className="font-display text-label uppercase text-accent">{status}</p>
      <h2 className="mt-3 font-display text-section uppercase">{message.subject}</h2>
      <p className="mt-4 text-small text-content-muted">
        {message.name} · {message.email}
      </p>
      <p className="mt-1 text-small text-content-muted">{toDateInput(message.createdAt)}</p>
      <p className="mt-8 whitespace-pre-wrap text-body text-pretty">{message.message}</p>
      {bisaHapus ? (
        <form action={deleteInboxMessage} className="mt-8">
          <input type="hidden" name="id" value={message.id} />
          <input type="hidden" name="q" value={q} />
          <input type="hidden" name="hal" value={hal} />
          <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
            Hapus
          </ConfirmSubmit>
        </form>
      ) : null}
    </div>
  )
}
