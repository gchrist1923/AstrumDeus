import { deleteNews, saveNews } from '@/app/cms/news/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { toDatetimeLocal } from '@/lib/datetime'

interface NewsFormValues {
  id?: string
  title: string
  slug: string
  excerpt: string
  body: string
  cover: string
  category: string
  author: string
  publishedAt: Date
  status: string
}

export function NewsForm({ post }: { post?: NewsFormValues }) {
  return (
    <form action={saveNews} className="flex max-w-2xl flex-col gap-6">
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}
      <Field id="title" label="Judul">
        <input id="title" name="title" required defaultValue={post?.title} className={KELAS_KONTROL} />
      </Field>
      <Field id="slug" label="Slug" hint="Kosongkan saat membuat baru supaya diisi dari judul.">
        <input id="slug" name="slug" defaultValue={post?.slug} className={KELAS_KONTROL} />
      </Field>
      <Field id="excerpt" label="Ringkasan">
        <textarea id="excerpt" name="excerpt" rows={3} defaultValue={post?.excerpt} className={KELAS_KONTROL} />
      </Field>
      <Field id="body" label="Isi" hint="Pisahkan paragraf dengan baris kosong.">
        <textarea id="body" name="body" rows={10} required defaultValue={post?.body} className={KELAS_KONTROL} />
      </Field>
      <ImageUpload name="cover" label="Cover" defaultValue={post?.cover} />
      <Field id="category" label="Kategori">
        <input id="category" name="category" required defaultValue={post?.category ?? 'Turnamen'} className={KELAS_KONTROL} />
      </Field>
      <Field id="author" label="Penulis">
        <input id="author" name="author" defaultValue={post?.author} className={KELAS_KONTROL} />
      </Field>
      <Field id="publishedAt" label="Jadwal terbit">
        <input
          id="publishedAt"
          name="publishedAt"
          type="datetime-local"
          required
          defaultValue={toDatetimeLocal(post?.publishedAt ?? new Date())}
          className={KELAS_KONTROL}
        />
      </Field>
      <Field id="status" label="Status">
        <select id="status" name="status" defaultValue={post?.status ?? 'published'} className={KELAS_KONTROL}>
          <option value="published">Terbit</option>
          <option value="draft">Draft</option>
        </select>
      </Field>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Simpan</Button>
        {post?.id ? (
          <Button formAction={deleteNews} variant="destructive" type="submit">
            Hapus
          </Button>
        ) : null}
      </div>
    </form>
  )
}
