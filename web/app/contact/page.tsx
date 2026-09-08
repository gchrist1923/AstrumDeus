import { ContactForm } from '@/components/public/contact-form'
import { getSiteContact } from '@/lib/content/dummy'
import { requirePage } from '@/lib/content/require-page'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default function ContactPage() {
  requirePage('contact')
  const kontak = getSiteContact()

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">Contact</h1>
        <p className="mt-6 max-w-[40rem] text-content-secondary text-pretty">{kontak.note}</p>
        <p className="mt-4">
          <a href={`mailto:${kontak.email}`} className={`text-accent underline underline-offset-4 ${KELAS_FOKUS}`}>
            {kontak.email}
          </a>
        </p>
        <div className="mt-12 max-w-[40rem]">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
