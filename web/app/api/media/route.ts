import { NextResponse } from 'next/server'
import { canWriteContent } from '@/lib/auth/roles'
import { getCurrentUser } from '@/lib/auth/session'
import { saveImageBuffer } from '@/lib/media/store'
import { validateImageBuffer } from '@/lib/media/validate'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || !canWriteContent(user.roles)) {
    return NextResponse.json({ error: 'gagal' }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'jenis' }, { status: 400 })
    }
    const bytes = new Uint8Array(await file.arrayBuffer())
    const hasil = validateImageBuffer(bytes)
    if (!hasil.ok) {
      return NextResponse.json({ error: hasil.error }, { status: 400 })
    }
    const saved = await saveImageBuffer(bytes)
    return NextResponse.json({ path: saved.path }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'gagal' }, { status: 500 })
  }
}
