import { KasBukuPage } from '@/app/internal/cash/kas-buku'

export default async function KasTimPage({
  searchParams,
}: {
  searchParams: Promise<{ hal?: string }>
}) {
  return <KasBukuPage jenis="tim" searchParams={searchParams} />
}
