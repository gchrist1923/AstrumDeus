import Link from 'next/link'
import { prisma } from '@/lib/db'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default async function CmsNewsPage() {
  const posts = await prisma.newsPost.findMany({
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-section uppercase">Berita</h2>
        <Link
          href="/cms/news/new"
          className={`inline-flex min-h-11 items-center bg-accent px-6 font-display text-label uppercase text-surface-raised ${KELAS_FOKUS}`}
        >
          Tulis berita
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {posts.map((post) => (
          <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3">
            <div>
              <p className="font-display text-body font-semibold">{post.title}</p>
              <p className="text-small text-content-muted">
                {post.status} · {post.category.name}
              </p>
            </div>
            <Link href={`/cms/news/${post.id}`} className={`inline-flex min-h-11 items-center text-accent underline ${KELAS_FOKUS}`}>
              Ubah
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
