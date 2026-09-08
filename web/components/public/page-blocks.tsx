import { splitBody } from '@/lib/content/map'
import type { PageBlock, PageRow } from '@/lib/pages/types'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const COL_SPAN: Record<4 | 6 | 8 | 12, string> = {
  4: 'col-span-4 max-md:col-span-12',
  6: 'col-span-6 max-md:col-span-12',
  8: 'col-span-8 max-md:col-span-12',
  12: 'col-span-12 max-md:col-span-12',
}

function asRows(rows: PageRow[] | unknown): PageRow[] {
  return Array.isArray(rows) ? (rows as PageRow[]) : []
}

function teksPayload(payload: Record<string, unknown>, kunci: string): string {
  const nilai = payload[kunci]
  return typeof nilai === 'string' ? nilai : ''
}

function colSpan(width: PageBlock['width']): string {
  return COL_SPAN[width] ?? COL_SPAN[12]
}

function BlockContent({ block }: { block: PageBlock }) {
  if (block.type === 'heading') {
    const text = teksPayload(block.payload, 'text')
    const level = block.payload.level === 3 ? 3 : 2
    const kelas = level === 3 ? 'font-display text-card uppercase' : 'font-display text-section uppercase'
    if (!text) return null
    if (level === 3) {
      return <h3 className={kelas}>{text}</h3>
    }
    return <h2 className={kelas}>{text}</h2>
  }

  if (block.type === 'text') {
    const paragraf = splitBody(teksPayload(block.payload, 'text'))
    if (paragraf.length === 0) return null
    return (
      <div className="max-w-[68ch] space-y-6 text-article text-pretty">
        {paragraf.map((isi) => (
          <p key={isi}>{isi}</p>
        ))}
      </div>
    )
  }

  if (block.type === 'image') {
    const src = teksPayload(block.payload, 'src')
    if (!src) return null
    return (
      <img
        src={src}
        alt={teksPayload(block.payload, 'alt')}
        className="w-full object-cover outline outline-1 outline-content-primary/10"
      />
    )
  }

  if (block.type === 'button') {
    const label = teksPayload(block.payload, 'label')
    const href = teksPayload(block.payload, 'href')
    if (!label || !href) return null
    return (
      <a
        href={href}
        className={`inline-flex min-h-11 items-center bg-accent px-6 font-display text-label uppercase text-surface-raised ${KELAS_FOKUS}`}
      >
        {label}
      </a>
    )
  }

  if (block.type === 'list') {
    const items = block.payload.items
    if (!Array.isArray(items)) return null
    const teksItems = items.filter((item): item is string => typeof item === 'string' && item.length > 0)
    if (teksItems.length === 0) return null
    return (
      <ul className="list-disc space-y-2 ps-6 text-article">
        {teksItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  return null
}

export function PageBlocks({
  rows,
  title,
}: {
  rows: PageRow[] | unknown
  title: string
}) {
  return (
    <main>
      <article className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page text-balance">{title}</h1>
        <div className="mt-12 flex flex-col gap-10">
          {asRows(rows).map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-6">
              {row.blocks.map((block) => (
                <div key={block.id} className={colSpan(block.width)}>
                  <BlockContent block={block} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </article>
    </main>
  )
}
