import Link from 'next/link'
import { formatNewsDate } from '@/lib/content/format'
import type { NewsPost } from '@/lib/content/types'

export function ArticleCard({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="block min-h-11 bg-surface-raised p-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <time
        className="font-display text-label uppercase text-accent"
        dateTime={post.publishedAt}
      >
        {formatNewsDate(post.publishedAt)}
      </time>
      <h3 className="mt-3 font-display text-card">{post.title}</h3>
      <p className="mt-2 text-body text-content-secondary">{post.excerpt}</p>
    </Link>
  )
}
