import type { MediaAsset } from '@/lib/content/types'

const LABEL_GRUP: Record<MediaAsset['group'], string> = {
  logo: 'Logo',
  warna: 'Warna',
  foto: 'Foto',
  tipografi: 'Tipografi',
}

export function AssetCard({ asset }: { asset: MediaAsset }) {
  return (
    <article className="bg-surface-raised p-6">
      <p className="font-display text-label uppercase text-content-muted">{LABEL_GRUP[asset.group]}</p>
      <h3 className="mt-3 font-display text-card">{asset.name}</h3>
      <p className="mt-2 text-small text-content-secondary">{asset.description}</p>
      <p className="mt-4 text-small text-content-muted">
        <span>{asset.fileType}</span>
        <span aria-hidden="true"> · </span>
        <span>{asset.fileSize}</span>
      </p>
      <a
        href={asset.href}
        className="mt-6 inline-flex min-h-11 items-center font-display text-label uppercase text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Unduh
      </a>
    </article>
  )
}
