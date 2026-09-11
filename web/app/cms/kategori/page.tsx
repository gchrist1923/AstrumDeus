import Link from 'next/link'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'

const JENIS = [
  { href: '/cms/kategori/turnamen', label: 'Turnamen' },
  { href: '/cms/kategori/kas', label: 'Kategori kas' },
  { href: '/cms/kategori/berita', label: 'Kategori berita' },
] as const

export default async function CmsKategoriPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'kategori', 'view')
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="font-display text-section uppercase">Kategori</h2>
        <p className="mt-3 max-w-2xl text-body text-content-secondary">
          Pilih jenis kategori. Nonaktif hilang dari form baru. Hapus hanya jika belum dipakai data.
        </p>
      </header>
      <ul className="flex w-full max-w-xl flex-col gap-3">
        {JENIS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex min-h-11 items-center border-2 border-border-strong px-4 font-display text-label uppercase"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
