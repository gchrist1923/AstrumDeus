import Link from 'next/link'
import { ArticleCard } from '@/components/public/article-card'
import { getPublishedNews } from '@/lib/content/dummy'
import { requirePage } from '@/lib/content/require-page'

const PER_HALAMAN = 9
const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function nomorHalaman(nilai: string | string[] | undefined): number {
  const mentah = Array.isArray(nilai) ? nilai[0] : nilai
  const angka = Number.parseInt(mentah ?? '1', 10)
  return Number.isFinite(angka) && angka >= 1 ? angka : 1
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string | string[] }>
}) {
  requirePage('news')

  const { halaman } = await searchParams
  const semua = getPublishedNews()
  const totalHalaman = Math.max(1, Math.ceil(semua.length / PER_HALAMAN))
  const aktif = Math.min(nomorHalaman(halaman), totalHalaman)
  const mulai = (aktif - 1) * PER_HALAMAN
  const potongan = semua.slice(mulai, mulai + PER_HALAMAN)

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">News</h1>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {potongan.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
        {totalHalaman > 1 ? (
          <nav aria-label="Halaman arsip" className="mt-16 flex flex-wrap gap-3">
            {Array.from({ length: totalHalaman }, (_, indeks) => indeks + 1).map((nomor) => (
              <Link
                key={nomor}
                href={nomor === 1 ? '/news' : `/news?halaman=${nomor}`}
                aria-current={nomor === aktif ? 'page' : undefined}
                aria-label={`Halaman ${nomor}`}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center px-4 font-display text-label uppercase ${KELAS_FOKUS} ${
                  nomor === aktif ? 'bg-accent text-surface-raised' : 'border-2 border-border-strong'
                }`}
              >
                {nomor}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </main>
  )
}
