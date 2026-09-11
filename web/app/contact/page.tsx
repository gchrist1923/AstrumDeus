import { ContactForm } from '@/components/public/contact-form'
import { ContactDetails } from '@/components/public/contact-details'
import { getPublicSiteSettings } from '@/lib/content/public-site'
import { requirePage } from '@/lib/content/require-page'

export default async function ContactPage() {
  requirePage('contact')
  const situs = await getPublicSiteSettings()

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">Contact</h1>
        <p className="mt-6 max-w-[40rem] text-content-secondary text-pretty">
          Pilih tujuan di form supaya pesan sponsor tidak tercampur dengan tryout.
        </p>
        <ContactDetails
          email={situs.contactEmail}
          address={situs.contactAddress}
          phone={situs.contactPhone}
        />
        <div className="mt-12 max-w-[40rem]">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
