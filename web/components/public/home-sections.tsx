import Link from 'next/link'
import { ArticleCard } from '@/components/public/article-card'
import { LiveBar } from '@/components/public/live-bar'
import { MatchRow } from '@/components/public/match-row'
import { PartnerPlate } from '@/components/public/partner-plate'
import { PlayerCard } from '@/components/public/player-card'
import { SectionHeading } from '@/components/public/section-heading'
import { StatTrio } from '@/components/public/stat-trio'
import {
  getActivePlayers,
  getCompletedMatches,
  getLiveEvent,
  getPartners,
  getPublishedNews,
  getSiteStats,
} from '@/lib/content/dummy'
import { isMenuEnabled, type MenuFlags } from '@/lib/nav'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const KELAS_CTA =
  'inline-flex min-h-11 min-w-11 items-center justify-center px-6 py-3 font-display text-label uppercase tracking-[0.12em]'

export function HomeSections({ flags }: { flags: MenuFlags }) {
  const rosterNyala = isMenuEnabled('roster', flags)
  const pertandinganNyala = isMenuEnabled('matches', flags)
  const partnerNyala = isMenuEnabled('partners', flags)
  const beritaNyala = isMenuEnabled('news', flags)

  return (
    <>
      <LiveBar event={getLiveEvent()} />
      <main>
        <section className="relative flex min-h-[min(80vh,700px)] items-center overflow-hidden [clip-path:polygon(0_0,100%_0,100%_94%,0_100%)]">
          <img
            src="/hero.jpg"
            alt="Lima pemain Astrum Deus berdiri berjajar memegang ponsel"
            className="absolute inset-0 size-full object-cover object-[18%_26%] grayscale contrast-[1.08] brightness-[.7]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-surface-base/80 via-surface-base/50 to-surface-base/80"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto w-full max-w-page px-5 py-20 md:px-8">
            <p className="mb-5 flex items-center gap-3 font-display text-label uppercase tracking-[0.2em] text-accent">
              <span className="inline-block h-0.5 w-8 bg-accent" aria-hidden="true" />
              PUBG Mobile · Indonesia
            </p>
            <h1 className="font-display text-display uppercase tracking-[-0.015em] text-balance">
              Astrum
              <br />
              Deus
            </h1>
            <p className="mt-6 max-w-[44ch] text-[1.25rem] text-content-secondary text-pretty">
              Tim PUBG Mobile yang berlatih terjadwal dan membuka hasilnya, dari klasemen sampai catatan scrim.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {rosterNyala ? (
                <Link href="/roster" className={`${KELAS_CTA} bg-accent text-surface-raised ${KELAS_FOKUS}`}>
                  Lihat roster
                </Link>
              ) : null}
              {pertandinganNyala ? (
                <Link
                  href="/matches"
                  className={`${KELAS_CTA} border-2 border-border-strong text-content-primary ${KELAS_FOKUS}`}
                >
                  Jadwal pertandingan
                </Link>
              ) : null}
            </div>
            <StatTrio stats={getSiteStats()} />
          </div>
        </section>

        <div className="mx-auto max-w-page px-5 md:px-8">
          {pertandinganNyala ? (
            <section className="py-24">
              <SectionHeading title="Hasil" href="/matches" linkLabel="Semua pertandingan" />
              <div className="grid gap-3">
                {getCompletedMatches()
                  .slice(0, 3)
                  .map((match) => (
                    <MatchRow
                      key={match.id}
                      match={match}
                      recapHref={beritaNyala && match.recapSlug ? `/news/${match.recapSlug}` : null}
                    />
                  ))}
              </div>
            </section>
          ) : null}

          {rosterNyala ? (
            <section className="py-24">
              <SectionHeading title="Roster" href="/roster" linkLabel="Profil lengkap" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {getActivePlayers().map((player) => (
                  <PlayerCard key={player.slug} player={player} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="py-24">
            <SectionHeading title="Berita" href="/news" linkLabel="Arsip" />
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {getPublishedNews()
                .slice(0, 3)
                .map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
            </div>
          </section>

          {partnerNyala ? (
            <section className="py-24">
              <SectionHeading title="Partner" href="/partners" linkLabel="Kerja sama" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {getPartners().map((partner) => (
                  <PartnerPlate key={partner.slug} partner={partner} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  )
}
