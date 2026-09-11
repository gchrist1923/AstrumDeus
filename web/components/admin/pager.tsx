export function Pager({
  page,
  pageCount,
  hrefFor,
}: {
  page: number
  pageCount: number
  hrefFor: (hal: number) => string
}) {
  if (pageCount <= 1) return null

  const kelasTautan =
    'inline-flex min-h-11 min-w-11 items-center justify-center px-4 font-display text-label uppercase'

  if (pageCount > 10) {
    return (
      <nav aria-label="Halaman" className="mt-6 flex flex-wrap items-center gap-2">
        {page > 1 ? (
          <a href={hrefFor(page - 1)} className={`${kelasTautan} border-2 border-border-strong`}>
            Sebelum
          </a>
        ) : null}
        <p className="font-display text-label uppercase text-content-secondary">
          Hal {page} dari {pageCount}
        </p>
        {page < pageCount ? (
          <a href={hrefFor(page + 1)} className={`${kelasTautan} border-2 border-border-strong`}>
            Berikut
          </a>
        ) : null}
      </nav>
    )
  }

  return (
    <nav aria-label="Halaman" className="mt-6 flex flex-wrap gap-2">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((hal) => (
        <a
          key={hal}
          href={hrefFor(hal)}
          aria-current={hal === page ? 'page' : undefined}
          className={`${kelasTautan} ${
            hal === page ? 'bg-accent text-surface-raised' : 'border-2 border-border-strong'
          }`}
        >
          {String(hal)}
        </a>
      ))}
    </nav>
  )
}
