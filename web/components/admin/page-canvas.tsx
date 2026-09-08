'use client'

import type { DragEvent } from 'react'
import { useState } from 'react'
import { Field, KELAS_FOKUS, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { canPlaceBlock } from '@/lib/pages/grid'
import type { BlockType, PageBlock, PageRow } from '@/lib/pages/types'

const JENIS_PALET: { type: BlockType; label: string }[] = [
  { type: 'heading', label: 'Judul' },
  { type: 'text', label: 'Teks' },
  { type: 'image', label: 'Gambar' },
  { type: 'button', label: 'Tombol' },
  { type: 'list', label: 'Daftar' },
]

const LEBAR: Array<4 | 6 | 8 | 12> = [4, 6, 8, 12]
const KUNCI_JENIS = 'application/x-astrum-block-type'
const KUNCI_ID = 'application/x-astrum-block-id'

function payloadAwal(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'heading':
      return { text: '', level: 2 }
    case 'text':
      return { text: '' }
    case 'image':
      return { src: '', alt: '' }
    case 'button':
      return { label: '', href: '' }
    case 'list':
      return { items: [''] }
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

function namaBlok(block: PageBlock): string {
  return teks(block.payload, 'text') || teks(block.payload, 'label') || teks(block.payload, 'alt') || block.type
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

  function onDragOver(event: DragEvent) {
    event.preventDefault()
  }

  function taruhDiBaris(rowId: string, event: DragEvent) {
    event.preventDefault()
    const jenis = parseJenis(event.dataTransfer.getData(KUNCI_JENIS))
    const blockId = event.dataTransfer.getData(KUNCI_ID)

    if (jenis) {
      setRows((sekarang) =>
        sekarang.map((row) => {
          if (row.id !== rowId) return row
          if (!canPlaceBlock(row.blocks, 4)) return row
          return { ...row, blocks: [...row.blocks, buatBlok(jenis)] }
        }),
      )
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
    setRows((sekarang) => [...sekarang, { id: crypto.randomUUID(), blocks: [buatBlok(jenis)] }])
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

  return (
    <form action={action} className="flex flex-col gap-10 lg:flex-row">
      <input type="hidden" name="id" value={pageId} />
      <input type="hidden" name="layout" value={JSON.stringify(rows)} />

      <aside className="flex w-full flex-col gap-4 lg:max-w-xs">
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
            className="flex flex-col gap-4 border-2 border-border-strong p-4"
            onDragOver={onDragOver}
            onDrop={(event) => taruhDiBaris(row.id, event)}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display text-label uppercase">Baris {rowIndex + 1}</h4>
              <Button type="button" variant="secondary" onClick={() => pindahBaris(rowIndex, -1)}>
                Naik
              </Button>
              <Button type="button" variant="secondary" onClick={() => pindahBaris(rowIndex, 1)}>
                Turun
              </Button>
            </div>
            {row.blocks.map((block, blockIndex) => (
              <article
                key={block.id}
                draggable
                aria-label={`Blok ${namaBlok(block)}`}
                className="flex flex-col gap-4 border-2 border-border-strong p-4"
                onDragStart={(event) => {
                  event.dataTransfer.setData(KUNCI_ID, block.id)
                  event.dataTransfer.effectAllowed = 'move'
                }}
              >
                <BlockFields
                  block={block}
                  onPayload={(payload) => setPayload(row.id, block.id, payload)}
                />
                <div className="flex flex-wrap gap-2">
                  {LEBAR.map((lebar) => (
                    <Button
                      key={lebar}
                      type="button"
                      variant="secondary"
                      aria-label={`Lebar ${lebar}`}
                      onClick={() => setLebar(row.id, block.id, lebar)}
                    >
                      {lebar}
                    </Button>
                  ))}
                  <Button type="button" variant="secondary" onClick={() => pindahBlok(row.id, blockIndex, -1)}>
                    Pindah kiri
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => pindahBlok(row.id, blockIndex, 1)}>
                    Pindah kanan
                  </Button>
                </div>
              </article>
            ))}
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
    </form>
  )
}

function BlockFields({
  block,
  onPayload,
}: {
  block: PageBlock
  onPayload: (payload: Record<string, unknown>) => void
}) {
  const idTeks = `${block.id}-teks`
  const idLevel = `${block.id}-level`
  const idAlt = `${block.id}-alt`
  const idLabel = `${block.id}-label`
  const idHref = `${block.id}-href`
  const idItems = `${block.id}-items`

  if (block.type === 'heading') {
    return (
      <div className="flex flex-col gap-4">
        <Field id={idTeks} label="Teks">
          <input
            id={idTeks}
            value={teks(block.payload, 'text')}
            className={KELAS_KONTROL}
            onChange={(event) => onPayload({ ...block.payload, text: event.target.value })}
          />
        </Field>
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
      </div>
    )
  }

  if (block.type === 'text') {
    return (
      <Field id={idTeks} label="Teks">
        <textarea
          id={idTeks}
          rows={4}
          value={teks(block.payload, 'text')}
          className={KELAS_KONTROL}
          onChange={(event) => onPayload({ ...block.payload, text: event.target.value })}
        />
      </Field>
    )
  }

  if (block.type === 'image') {
    return (
      <div className="flex flex-col gap-4">
        <ImageUpload
          name={`image-${block.id}`}
          label="Gambar"
          defaultValue={teks(block.payload, 'src')}
          onPathChange={(path) => onPayload({ ...block.payload, src: path })}
        />
        <Field id={idAlt} label="Teks alternatif">
          <input
            id={idAlt}
            value={teks(block.payload, 'alt')}
            className={KELAS_KONTROL}
            onChange={(event) => onPayload({ ...block.payload, alt: event.target.value })}
          />
        </Field>
      </div>
    )
  }

  if (block.type === 'button') {
    return (
      <div className="flex flex-col gap-4">
        <Field id={idLabel} label="Label">
          <input
            id={idLabel}
            value={teks(block.payload, 'label')}
            className={KELAS_KONTROL}
            onChange={(event) => onPayload({ ...block.payload, label: event.target.value })}
          />
        </Field>
        <Field id={idHref} label="Tautan">
          <input
            id={idHref}
            value={teks(block.payload, 'href')}
            className={KELAS_KONTROL}
            onChange={(event) => onPayload({ ...block.payload, href: event.target.value })}
          />
        </Field>
      </div>
    )
  }

  const items = Array.isArray(block.payload.items)
    ? block.payload.items.filter((item): item is string => typeof item === 'string')
    : []

  return (
    <Field id={idItems} label="Butir" hint="Satu butir per baris.">
      <textarea
        id={idItems}
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
    </Field>
  )
}
