const KELAS_FOKUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function ContactDetails({
  email,
  address,
  phone,
}: {
  email: string
  address: string
  phone: string
}) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <p>
        <a href={`mailto:${email}`} className={`text-accent underline underline-offset-4 ${KELAS_FOKUS}`}>
          {email}
        </a>
      </p>
      {address ? <p className="text-content-secondary">{address}</p> : null}
      {phone ? (
        <p>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className={`text-accent underline underline-offset-4 ${KELAS_FOKUS}`}
          >
            {phone}
          </a>
        </p>
      ) : null}
    </div>
  )
}
