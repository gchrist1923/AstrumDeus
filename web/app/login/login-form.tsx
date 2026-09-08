'use client'

import { type FormEvent, useState } from 'react'
import { loginAction } from '@/app/login/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')

    const result = await loginAction(new FormData(event.currentTarget))
    setPending(false)

    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="next" value={next} />
      <Field id="email" label="Email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={KELAS_KONTROL}
        />
      </Field>
      <Field id="password" label="Kata sandi">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={KELAS_KONTROL}
        />
      </Field>
      {error ? (
        <p role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        Masuk
      </Button>
    </form>
  )
}
