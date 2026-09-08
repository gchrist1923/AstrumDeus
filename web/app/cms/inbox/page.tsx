import { updateInboxStatus } from '@/app/cms/inbox/actions'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'

export default async function InboxPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h2 className="mb-6 font-display text-section uppercase">Kotak masuk</h2>
      {messages.length === 0 ? (
        <p className="text-content-secondary">Belum ada pesan.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {messages.map((message) => (
            <li key={message.id} className="border-2 border-border-strong p-4">
              <p className="font-display text-label uppercase text-accent">{message.status}</p>
              <p className="mt-2 font-display text-body font-semibold">{message.subject}</p>
              <p className="text-small text-content-muted">
                {message.name} · {message.email}
              </p>
              <p className="mt-3 text-body text-pretty">{message.message}</p>
              <form action={updateInboxStatus} className="mt-4 flex flex-wrap gap-2">
                <input type="hidden" name="id" value={message.id} />
                <Button type="submit" name="status" value="dibaca" variant="secondary">
                  Dibaca
                </Button>
                <Button type="submit" name="status" value="selesai" variant="secondary">
                  Selesai
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
