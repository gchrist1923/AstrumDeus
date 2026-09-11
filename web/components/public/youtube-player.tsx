'use client'

import { useState } from 'react'
import { youtubeCover, youtubeId } from '@/lib/pages/youtube'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function YoutubePlayer({ url }: { url: string }) {
  const [putar, setPutar] = useState(false)
  const id = youtubeId(url)
  const cover = youtubeCover(url)

  if (!id || !cover) {
    if (!url) return null
    return (
      <a href={url} className={`text-body text-accent underline ${KELAS_FOKUS}`}>
        {url}
      </a>
    )
  }

  if (putar) {
    return (
      <iframe
        title="Video YouTube"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full border-0"
      />
    )
  }

  return (
    <button
      type="button"
      aria-label="Putar video"
      className={`relative block w-full ${KELAS_FOKUS}`}
      onClick={() => setPutar(true)}
    >
      <img src={cover} alt="" className="w-full object-cover outline outline-1 outline-content-primary/10" />
    </button>
  )
}
