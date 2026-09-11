import { splitBody } from '@/lib/content/map'
import type { BlockColor, PageBlock, PageRow } from '@/lib/pages/types'
import { YoutubePlayer } from '@/components/public/youtube-player'

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

function warnaPayload(payload: Record<string, unknown>): BlockColor {
  const nilai = payload.color
  if (nilai === 'accent' || nilai === 'muted') return nilai
  return 'default'
}

function kelasWarnaTeks(color: BlockColor): string {
  if (color === 'accent') return 'text-accent'
  if (color === 'muted') return 'text-content-muted'
  return 'text-content-primary'
}

function kelasWarnaGaris(color: BlockColor): string {
  if (color === 'accent') return 'border-accent'
  if (color === 'muted') return 'border-content-muted'
  return 'border-content-primary'
}

function ketebalan(payload: Record<string, unknown>): 1 | 2 | 4 {
  return payload.thickness === 1 || payload.thickness === 4 ? payload.thickness : 2
}

function colSpan(width: PageBlock['width']): string {
  return COL_SPAN[width] ?? COL_SPAN[12]
}

function BlockContent({ block }: { block: PageBlock }) {
  if (block.type === 'heading') {
    const text = teksPayload(block.payload, 'text')
    const level = block.payload.level === 3 ? 3 : 2
    const warna = kelasWarnaTeks(warnaPayload(block.payload))
    const kelas = level === 3 ? 'font-display text-card uppercase' : 'font-display text-section uppercase'
    if (!text) return null
    if (level === 3) {
      return <h3 className={`${kelas} ${warna}`}>{text}</h3>
    }
    return <h2 className={`${kelas} ${warna}`}>{text}</h2>
  }

  if (block.type === 'text') {
    const paragraf = splitBody(teksPayload(block.payload, 'text'))
    if (paragraf.length === 0) return null
    const warna = kelasWarnaTeks(warnaPayload(block.payload))
    return (
      <div className={`max-w-[68ch] space-y-6 text-article text-pretty ${warna}`}>
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
    const color = warnaPayload(block.payload)
    const kelasIsi =
      color === 'muted'
        ? 'border-2 border-border-strong text-content-muted'
        : color === 'accent'
          ? 'border-2 border-accent text-accent'
          : 'bg-accent text-surface-raised'
    return (
      <a
        href={href}
        className={`inline-flex min-h-11 items-center px-6 font-display text-label uppercase ${kelasIsi} ${KELAS_FOKUS}`}
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

  if (block.type === 'video') {
    return <YoutubePlayer url={teksPayload(block.payload, 'url')} />
  }

  if (block.type === 'divider') {
    const t = ketebalan(block.payload)
    return (
      <hr
        role="separator"
        className={`w-full border-0 border-solid ${kelasWarnaGaris(warnaPayload(block.payload))}`}
        style={{ borderTopWidth: t }}
      />
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
