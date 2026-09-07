import { AssetCard } from '@/components/public/asset-card'
import { SectionHeading } from '@/components/public/section-heading'
import { getMediaAssets } from '@/lib/content/dummy'
import { requirePage } from '@/lib/content/require-page'
import type { MediaAsset } from '@/lib/content/types'

const URUTAN_GRUP: MediaAsset['group'][] = ['logo', 'warna', 'foto', 'tipografi']

const LABEL_GRUP: Record<MediaAsset['group'], string> = {
  logo: 'Logo',
  warna: 'Warna',
  foto: 'Foto',
  tipografi: 'Tipografi',
}

function kelompokkanAset(aset: MediaAsset[]): { group: MediaAsset['group']; items: MediaAsset[] }[] {
  return URUTAN_GRUP.map((group) => ({
    group,
    items: aset.filter((item) => item.group === group),
  })).filter((bagian) => bagian.items.length > 0)
}

export default function MediaKitPage() {
  requirePage('media-kit')

  const kelompok = kelompokkanAset(getMediaAssets())

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">Media Kit</h1>
        <p className="mt-6 max-w-[68ch] text-body text-content-secondary">
          Logo Astrum Deus tidak boleh diwarnai emas. Gunakan file resmi dari halaman ini tanpa mengubah warna logo.
        </p>
        <div className="mt-16 space-y-24">
          {kelompok.map(({ group, items }) => (
            <section key={group}>
              <SectionHeading title={LABEL_GRUP[group]} />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {items.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
