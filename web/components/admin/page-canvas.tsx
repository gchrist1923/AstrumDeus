'use client'

import type { DragEvent } from 'react'
import { useState } from 'react'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { Field, KELAS_FOKUS, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { canPlaceBlock } from '@/lib/pages/grid'
import type { BlockColor, BlockType, PageBlock, PageRow } from '@/lib/pages/types'
import { youtubeCover } from '@/lib/pages/youtube'

const JENIS_PALET: { type: BlockType; label: string }[] = [
  { type: 'heading', label: 'Teks' },
  { type: 'text', label: 'Long text' },
  { type: 'button', label: 'Tombol' },
  { type: 'image', label: 'Gambar' },
  { type: 'video', label: 'Video' },
  { type: 'divider', label: 'Garis' },
]

const LEBAR: Array<4 | 6 | 8 | 12> = [4, 6, 8, 12]
const KUNCI_JENIS = 'application/x-astrum-block-type'
const KUNCI_ID = 'application/x-astrum-block-id'

const COL_SPAN: Record<4 | 6 | 8 | 12, string> = {
  4: 'col-span-4 max-md:col-span-12',
  6: 'col-span-6 max-md:col-span-12',
  8: 'col-span-8 max-md:col-span-12',
  12: 'col-span-12 max-md:col-span-12',
}

function payloadAwal(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'heading':
      return { text: '', level: 2, color: 'default' }
    case 'text':
      return { text: '', color: 'default' }
    case 'image':
      return { src: '', alt: '' }
    case 'button':
      return { label: '', href: '', color: 'default' }
    case 'list':
      return { items: [''] }
    case 'video':
      return { url: '' }
    case 'divider':
      return { color: 'default', thickness: 2 }
  }
}

function buatBlok(type: BlockType): PageBlock {
  return {
    id: crypto.randomUUID(),
    type,
    width: 4,
    payload: payloadAwal(type),
  }
}

function teks(payload: Record<string, unknown>, kunci: string): string {
  const nilai = payload[kunci]
  return typeof nilai === 'string' ? nilai : ''
}

function warnaOf(payload: Record<string, unknown>): BlockColor {
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

function namaBlok(block: PageBlock): string {
  return (
    teks(block.payload, 'text') ||
    teks(block.payload, 'label') ||
    teks(block.payload, 'alt') ||
    teks(block.payload, 'url') ||
    block.type
  )
}

function parseJenis(nilai: string): BlockType | null {
  return JENIS_PALET.some((item) => item.type === nilai) ? (nilai as BlockType) : null
}

function tukar<T>(items: T[], i: number, j: number): T[] {
  if (j < 0 || j >= items.length) return items
  const next = [...items]
  const a = next[i]
  const b = next[j]
  if (a === undefined || b === undefined) return items
  next[i] = b
  next[j] = a
  return next
}

function cariBlok(rows: PageRow[], blockId: string | null) {
  if (!blockId) return null
  for (const row of rows) {
    const index = row.blocks.findIndex((block) => block.id === blockId)
    if (index >= 0) {
      const block = row.blocks[index]
      if (block) return { row, block, index }
    }
  }
  return null
}

export function PageCanvas({
  pageId,
  initialRows,
  action,
}: {
  pageId: string
  initialRows: PageRow[]
  action?: (formData: FormData) => void | Promise<void>
}) {
  const [rows, setRows] = useState<PageRow[]>(initialRows)
  const [selectedId, setSelectedId] = useState<string | null>(initialRows[0]?.blocks[0]?.id ?? null)
  const terpilih = cariBlok(rows, selectedId)

  function onDragOver(event: DragEvent) {
    event.preventDefault()
  }

  function taruhDiBaris(rowId: string, event: DragEvent) {
    event.preventDefault()
    const jenis = parseJenis(event.dataTransfer.getData(KUNCI_JENIS))
    const blockId = event.dataTransfer.getData(KUNCI_ID)

    if (jenis) {
      const tujuan = rows.find((row) => row.id === rowId)
      if (!tujuan || !canPlaceBlock(tujuan.blocks, 4)) return
      const blok = buatBlok(jenis)
      setRows((sekarang) =>
        sekarang.map((row) => (row.id === rowId ? { ...row, blocks: [...row.blocks, blok] } : row)),
      )
      setSelectedId(blok.id)
      return
    }

    if (!blockId) return

    setRows((sekarang) => {
      const asal = sekarang.find((row) => row.blocks.some((block) => block.id === blockId))
      const blok = asal?.blocks.find((block) => block.id === blockId)
      const tujuan = sekarang.find((row) => row.id === rowId)
      if (!asal || !blok || !tujuan || asal.id === tujuan.id) return sekarang
      if (!canPlaceBlock(tujuan.blocks, blok.width)) return sekarang
      return sekarang.map((row) => {
        if (row.id === asal.id) {
          return { ...row, blocks: row.blocks.filter((block) => block.id !== blockId) }
        }
        if (row.id === tujuan.id) {
          return { ...row, blocks: [...row.blocks, blok] }
        }
        return row
      })
    })
  }

  function tambahJenisDiBarisBaru(jenis: BlockType) {
    const blok = buatBlok(jenis)
    setRows((sekarang) => [...sekarang, { id: crypto.randomUUID(), blocks: [blok] }])
    setSelectedId(blok.id)
  }

  function taruhBarisBaru(event: DragEvent) {
    event.preventDefault()
    const jenis = parseJenis(event.dataTransfer.getData(KUNCI_JENIS))
    const blockId = event.dataTransfer.getData(KUNCI_ID)

    if (jenis) {
      tambahJenisDiBarisBaru(jenis)
      return
    }

    if (!blockId) return

    setRows((sekarang) => {
      const asal = sekarang.find((row) => row.blocks.some((block) => block.id === blockId))
      const blok = asal?.blocks.find((block) => block.id === blockId)
      if (!asal || !blok) return sekarang
      return [
        ...sekarang.map((row) =>
          row.id === asal.id ? { ...row, blocks: row.blocks.filter((block) => block.id !== blockId) } : row,
        ),
        { id: crypto.randomUUID(), blocks: [blok] },
      ]
    })
  }

  function setLebar(rowId: string, blockId: string, width: 4 | 6 | 8 | 12) {
    setRows((sekarang) =>
      sekarang.map((row) => {
        if (row.id !== rowId) return row
        const blok = row.blocks.find((item) => item.id === blockId)
        if (!blok) return row
        const lainnya = row.blocks.filter((item) => item.id !== blockId)
        if (!canPlaceBlock(lainnya, width)) return row
        return {
          ...row,
          blocks: row.blocks.map((item) => (item.id === blockId ? { ...item, width } : item)),
        }
      }),
    )
  }

  function pindahBlok(rowId: string, index: number, arah: -1 | 1) {
    setRows((sekarang) =>
      sekarang.map((row) => (row.id === rowId ? { ...row, blocks: tukar(row.blocks, index, index + arah) } : row)),
    )
  }

  function pindahBaris(index: number, arah: -1 | 1) {
    setRows((sekarang) => tukar(sekarang, index, index + arah))
  }

  function setPayload(rowId: string, blockId: string, payload: Record<string, unknown>) {
    setRows((sekarang) =>
      sekarang.map((row) =>
        row.id === rowId
          ? {
              ...row,
              blocks: row.blocks.map((block) => (block.id === blockId ? { ...block, payload } : block)),
            }
          : row,
      ),
    )
  }

  function hapusBlok(rowId: string, blockId: string) {
    setRows((sekarang) =>
      sekarang
        .map((row) =>
          row.id === rowId ? { ...row, blocks: row.blocks.filter((block) => block.id !== blockId) } : row,
        )
        .filter((row) => row.blocks.length > 0),
    )
    setSelectedId((sekarang) => (sekarang === blockId ? null : sekarang))
  }

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[12rem_minmax(0,1fr)_20rem] lg:items-start">
      <input type="hidden" name="id" value={pageId} />
      <input type="hidden" name="layout" value={JSON.stringify(rows)} />

      <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-4">
        <h3 className="font-display text-card uppercase">Palet</h3>
        <ul className="flex flex-col gap-2">
          {JENIS_PALET.map((item) => (
            <li key={item.type}>
              <button
                type="button"
                draggable
                data-block-type={item.type}
                className={`inline-flex min-h-11 w-full items-center border-2 border-border-strong px-4 text-left font-display text-label uppercase ${KELAS_FOKUS}`}
                onDragStart={(event) => {
                  event.dataTransfer.setData(KUNCI_JENIS, item.type)
                  event.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => tambahJenisDiBarisBaru(item.type)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-small text-content-muted">
          Seret ke baris atau ke Baris baru. Lebar hanya 4, 6, 8, atau 12.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {rows.map((row, rowIndex) => (
          <section
            key={row.id}
            aria-label={`Baris ${rowIndex + 1}`}
            className="grid grid-cols-12 gap-6 border-2 border-border-strong p-4"
            onDragOver={onDragOver}
            onDrop={(event) => taruhDiBaris(row.id, event)}
          >
            <div className="col-span-12 flex flex-wrap items-center gap-2">
              <h4 className="font-display text-label uppercase">Baris {rowIndex + 1}</h4>
              <Button type="button" variant="secondary" onClick={() => pindahBaris(rowIndex, -1)}>
                Naik
              </Button>
              <Button type="button" variant="secondary" onClick={() => pindahBaris(rowIndex, 1)}>
                Turun
              </Button>
            </div>
            {row.blocks.map((block) => {
              const nama = namaBlok(block)
              const aktif = selectedId === block.id
              return (
                <article
                  key={block.id}
                  draggable
                  aria-label={`Blok ${nama}`}
                  aria-current={aktif ? 'true' : undefined}
                  className={`${COL_SPAN[block.width]} min-h-11 border-2 p-4 ${
                    aktif ? 'border-accent' : 'border-border-strong'
                  }`}
                  onClick={() => setSelectedId(block.id)}
                  onDragStart={(event) => {
                    event.dataTransfer.setData(KUNCI_ID, block.id)
                    event.dataTransfer.effectAllowed = 'move'
                  }}
                >
                  <CanvasBlock
                    block={block}
                    onPayload={(payload) => setPayload(row.id, block.id, payload)}
                  />
                </article>
              )
            })}
          </section>
        ))}

        <div
          aria-label="Baris baru"
          className="flex min-h-11 items-center border-2 border-border-strong px-4 font-display text-label uppercase text-content-secondary"
          onDragOver={onDragOver}
          onDrop={taruhBarisBaru}
        >
          Baris baru
        </div>

        <Button type="submit">Simpan tata letak</Button>
      </div>

      <aside className="flex w-full flex-col gap-4">
        <h3 className="font-display text-card uppercase">Blok dipilih</h3>
        {terpilih ? (
          <>
            <InspectorFields
              block={terpilih.block}
              onPayload={(payload) => setPayload(terpilih.row.id, terpilih.block.id, payload)}
            />
            <div className="flex flex-wrap gap-2">
              {LEBAR.map((lebar) => {
                const aktif = terpilih.block.width === lebar
                return (
                  <Button
                    key={lebar}
                    type="button"
                    variant={aktif ? 'primary' : 'secondary'}
                    aria-label={`Lebar ${lebar}`}
                    aria-pressed={aktif}
                    onClick={() => setLebar(terpilih.row.id, terpilih.block.id, lebar)}
                  >
                    {lebar}
                  </Button>
                )
              })}
              <Button
                type="button"
                variant="secondary"
                disabled={terpilih.index === 0}
                onClick={() => pindahBlok(terpilih.row.id, terpilih.index, -1)}
              >
                Pindah kiri
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={terpilih.index === terpilih.row.blocks.length - 1}
                onClick={() => pindahBlok(terpilih.row.id, terpilih.index, 1)}
              >
                Pindah kanan
              </Button>
            </div>
            <ConfirmSubmit
              message="Hapus blok ini?"
              variant="destructive"
              onConfirm={() => hapusBlok(terpilih.row.id, terpilih.block.id)}
            >
              Hapus
            </ConfirmSubmit>
          </>
        ) : (
          <p className="text-content-secondary">Pilih blok di tampilan.</p>
        )}
      </aside>
    </form>
  )
}

function CanvasBlock({
  block,
  onPayload,
}: {
  block: PageBlock
  onPayload: (payload: Record<string, unknown>) => void
}) {
  const warna = warnaOf(block.payload)
  const idAlt = `${block.id}-alt`
  const idUrl = `${block.id}-url`
  const idLabel = `${block.id}-label`
  const idHref = `${block.id}-href`
  const idItems = `${block.id}-items`

  if (block.type === 'heading') {
    const level = block.payload.level === 3 ? 3 : 2
    return (
      <input
        aria-label="Judul blok"
        value={teks(block.payload, 'text')}
        className={`w-full bg-transparent font-display uppercase outline-none ${
          level === 3 ? 'text-card' : 'text-section'
        } ${kelasWarnaTeks(warna)} ${KELAS_FOKUS}`}
        onChange={(event) => onPayload({ ...block.payload, text: event.target.value })}
      />
    )
  }

  if (block.type === 'text') {
    return (
      <textarea
        aria-label="Isi paragraf"
        rows={4}
        value={teks(block.payload, 'text')}
        className={`w-full bg-transparent text-article outline-none ${kelasWarnaTeks(warna)} ${KELAS_FOKUS}`}
        onChange={(event) => onPayload({ ...block.payload, text: event.target.value })}
      />
    )
  }

  if (block.type === 'image') {
    const src = teks(block.payload, 'src')
    const alt = teks(block.payload, 'alt')
    return (
      <div className="flex flex-col gap-3">
        {src ? (
          <img
            src={src}
            alt={alt || 'Gambar'}
            className="w-full object-cover outline outline-1 outline-content-primary/10"
          />
        ) : null}
        <ImageUpload
          key={block.id}
          name={`image-${block.id}`}
          label="Gambar"
          defaultValue={src}
          hidePreview
          onPathChange={(path) => onPayload({ ...block.payload, src: path })}
        />
        <label htmlFor={idAlt} className="font-display text-label uppercase text-content-muted">
          Teks alternatif
        </label>
        <input
          id={idAlt}
          value={alt}
          className={KELAS_KONTROL}
          onChange={(event) => onPayload({ ...block.payload, alt: event.target.value })}
        />
      </div>
    )
  }

  if (block.type === 'button') {
    const color = warna
    const kelasIsi =
      color === 'muted'
        ? 'border-2 border-border-strong text-content-muted'
        : color === 'accent'
          ? 'border-2 border-accent text-accent'
          : 'bg-accent text-surface-raised'
    return (
      <div className="flex flex-col gap-3">
        <input
          id={idLabel}
          aria-label="Label tombol"
          value={teks(block.payload, 'label')}
          placeholder="Label"
          className={`min-h-11 px-6 font-display text-label uppercase ${kelasIsi} ${KELAS_FOKUS}`}
          onChange={(event) => onPayload({ ...block.payload, label: event.target.value })}
        />
        <input
          id={idHref}
          aria-label="Tautan tombol"
          value={teks(block.payload, 'href')}
          placeholder="Tautan"
          className={KELAS_KONTROL}
          onChange={(event) => onPayload({ ...block.payload, href: event.target.value })}
        />
      </div>
    )
  }

  if (block.type === 'video') {
    const url = teks(block.payload, 'url')
    const cover = youtubeCover(url)
    return (
      <div className="flex flex-col gap-3">
        {cover ? (
          <img src={cover} alt="Cover video" className="w-full object-cover outline outline-1 outline-content-primary/10" />
        ) : (
          <p className="text-small text-content-muted">Tampal tautan YouTube.</p>
        )}
        <label htmlFor={idUrl} className="font-display text-label uppercase text-content-muted">
          Tautan video
        </label>
        <input
          id={idUrl}
          value={url}
          className={KELAS_KONTROL}
          onChange={(event) => onPayload({ ...block.payload, url: event.target.value })}
        />
      </div>
    )
  }

  if (block.type === 'divider') {
    const t = block.payload.thickness === 1 || block.payload.thickness === 4 ? block.payload.thickness : 2
    return (
      <hr
        role="separator"
        className={`w-full border-0 border-solid ${kelasWarnaGaris(warna)}`}
        style={{ borderTopWidth: t }}
      />
    )
  }

  const items = Array.isArray(block.payload.items)
    ? block.payload.items.filter((item): item is string => typeof item === 'string')
    : []

  return (
    <div className="flex flex-col gap-3">
      <ul className="list-disc space-y-2 ps-6 text-article">
        {items.filter((item) => item.length > 0).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <textarea
        id={idItems}
        aria-label="Butir daftar"
        rows={4}
        value={items.join('\n')}
        className={KELAS_KONTROL}
        onChange={(event) =>
          onPayload({
            ...block.payload,
            items: event.target.value.split('\n'),
          })
        }
      />
    </div>
  )
}

function InspectorFields({
  block,
  onPayload,
}: {
  block: PageBlock
  onPayload: (payload: Record<string, unknown>) => void
}) {
  const idLevel = `${block.id}-level`
  const idWarna = `${block.id}-warna`
  const idTebal = `${block.id}-tebal`
  const warna = warnaOf(block.payload)
  const pakaiWarna =
    block.type === 'heading' || block.type === 'text' || block.type === 'button' || block.type === 'divider'

  return (
    <div className="flex flex-col gap-4">
      {block.type === 'heading' ? (
        <Field id={idLevel} label="Level">
          <select
            id={idLevel}
            value={block.payload.level === 3 ? 3 : 2}
            className={KELAS_KONTROL}
            onChange={(event) => onPayload({ ...block.payload, level: Number(event.target.value) })}
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </Field>
      ) : null}
      {pakaiWarna ? (
        <Field id={idWarna} label="Warna">
          <select
            id={idWarna}
            value={warna}
            className={KELAS_KONTROL}
            onChange={(event) => onPayload({ ...block.payload, color: event.target.value })}
          >
            <option value="default">Bawaan</option>
            <option value="accent">Aksen</option>
            <option value="muted">Redup</option>
          </select>
        </Field>
      ) : null}
      {block.type === 'divider' ? (
        <Field id={idTebal} label="Ketebalan">
          <select
            id={idTebal}
            value={block.payload.thickness === 1 || block.payload.thickness === 4 ? Number(block.payload.thickness) : 2}
            className={KELAS_KONTROL}
            onChange={(event) => onPayload({ ...block.payload, thickness: Number(event.target.value) })}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={4}>4</option>
          </select>
        </Field>
      ) : null}
    </div>
  )
}
