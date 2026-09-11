import Link from 'next/link'
import { KELAS_FOKUS } from '@/components/admin/form-field'

export function KategoriJudul({ children }: { children: string }) {
  return (
    <header className="flex items-center gap-2">
      <Link
        href="/cms/kategori"
        aria-label="Kembali ke kategori"
        className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-section text-accent ${KELAS_FOKUS}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-[0.72em] w-[0.72em] rtl:-scale-x-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <path d="M15 5 8 12l7 7" />
        </svg>
      </Link>
      <h2 className="font-display text-section uppercase">{children}</h2>
    </header>
  )
}
