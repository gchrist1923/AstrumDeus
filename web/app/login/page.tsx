import { LoginForm } from '@/app/login/login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const params = await searchParams
  const next = Array.isArray(params.next) ? params.next[0] : params.next

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
      <p className="font-display text-label uppercase tracking-[0.16em] text-accent">Astrum Deus</p>
      <h1 className="mt-3 font-display text-page uppercase">Masuk</h1>
      <p className="mt-4 text-content-secondary">Masuk untuk mengelola konten atau catatan internal tim.</p>
      <div className="mt-10">
        <LoginForm next={next ?? '/cms'} />
      </div>
    </main>
  )
}
