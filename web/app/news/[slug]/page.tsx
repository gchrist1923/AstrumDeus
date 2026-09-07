import { notFound } from 'next/navigation'
import { getNewsBySlug, getPublishedNews } from '@/lib/content/dummy'
import { formatNewsDate } from '@/lib/content/format'
import { requirePage } from '@/lib/content/require-page'

export function generateStaticParams() {
  return getPublishedNews().map((post) => ({ slug: post.slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  requirePage('news')

  const { slug } = await params
  const post = getNewsBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main>
      <article className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <p className="font-display text-label uppercase tracking-[0.2em] text-accent">{post.category}</p>
        <h1 className="mt-4 font-display text-page text-balance">{post.title}</h1>
        <p className="mt-6 text-body text-content-secondary">
          <span>{post.author}</span>
          <span className="text-content-muted" aria-hidden="true">
            {' '}
            ·{' '}
          </span>
          <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time>
        </p>
        {post.cover ? (
          <img
            src={post.cover}
            alt=""
            className="mt-12 w-full object-cover outline outline-1 outline-content-primary/10"
          />
        ) : null}
        <div className="mt-12 max-w-[68ch] space-y-6 text-article text-pretty">
          {post.body.map((paragraf) => (
            <p key={paragraf}>{paragraf}</p>
          ))}
        </div>
      </article>
    </main>
  )
}
