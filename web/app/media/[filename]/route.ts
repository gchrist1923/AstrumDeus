import { NextResponse } from 'next/server'
import { readMediaFile } from '@/lib/media/store'

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params
  const file = await readMediaFile(filename)
  if (!file) {
    return new NextResponse(null, { status: 404 })
  }
  return new NextResponse(Buffer.from(file.bytes), {
    status: 200,
    headers: {
      'Content-Type': file.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
