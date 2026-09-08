import Link from 'next/link'

export function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="font-display text-section uppercase">{title}</h2>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      {href && linkLabel ? (
        <Link
          href={href}
          className="min-h-11 font-display text-label uppercase text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  )
}
