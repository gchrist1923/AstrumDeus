import { KasBukuPage } from '@/app/internal/cash/kas-buku'

export default async function KasOperasionalPage({
  searchParams,
}: {
  searchParams: Promise<{ hal?: string }>
}) {
  return <KasBukuPage jenis="operasional" searchParams={searchParams} />
}
