import { PartnerPlate } from '@/components/public/partner-plate'
import { SectionHeading } from '@/components/public/section-heading'
import { getPartners } from '@/lib/content/cms'
import { getMenuFlags } from '@/lib/content/flags'
import { requirePage } from '@/lib/content/require-page'
import type { Partner } from '@/lib/content/types'

function kelompokkanMitra(mitra: Partner[]): { tier: string; items: Partner[] }[] {
  const tierUnik = [...new Set(mitra.map((item) => item.tier))]

  return tierUnik.map((tier) => ({
    tier,
    items: mitra.filter((item) => item.tier === tier),
  }))
}

export default async function PartnersPage() {
  requirePage('partners', await getMenuFlags())

  const kelompok = kelompokkanMitra(await getPartners())

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">Partners</h1>
        <div className="mt-16 space-y-24">
          {kelompok.map(({ tier, items }) => (
            <section key={tier}>
              <SectionHeading title={tier} />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {items.map((partner) => (
                  <PartnerPlate key={partner.slug} partner={partner} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
