import type { PageRow } from '@/lib/pages/types'

export function PageBlocks({
  rows,
  title,
}: {
  rows: PageRow[] | unknown
  title: string
}) {
  void rows

  return (
    <main>
      <article className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page text-balance">{title}</h1>
      </article>
    </main>
  )
}
