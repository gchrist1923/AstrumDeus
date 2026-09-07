'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { NavItem } from '@/lib/nav'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function MobileMenu({ items, pathname }: { items: NavItem[]; pathname: string }) {
  const [terbuka, setTerbuka] = useState(false)
  const tombolRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const pernahTerbuka = useRef(false)

  useEffect(() => {
    if (!terbuka) {
      return
    }

    const panel = panelRef.current
    const ditandaiInert = Array.from(document.body.children).filter(
      (elemen): elemen is HTMLElement => elemen !== panel && !elemen.hasAttribute('inert'),
    )

    ditandaiInert.forEach((elemen) => elemen.setAttribute('inert', ''))
    panel?.querySelector<HTMLElement>('a[href], button')?.focus()

    function saatTekanTombol(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setTerbuka(false)
        return
      }

      if (event.key !== 'Tab' || !panel) {
        return
      }

      const bisaFokus = panel.querySelectorAll<HTMLElement>('a[href], button')

      if (bisaFokus.length === 0) {
        return
      }

      const pertama = bisaFokus[0]
      const terakhir = bisaFokus[bisaFokus.length - 1]

      if (event.shiftKey && document.activeElement === pertama) {
        event.preventDefault()
        terakhir.focus()
      } else if (!event.shiftKey && document.activeElement === terakhir) {
        event.preventDefault()
        pertama.focus()
      }
    }

    document.addEventListener('keydown', saatTekanTombol)

    return () => {
      document.removeEventListener('keydown', saatTekanTombol)
      ditandaiInert.forEach((elemen) => elemen.removeAttribute('inert'))
    }
  }, [terbuka])

  useEffect(() => {
    if (pernahTerbuka.current && !terbuka) {
      tombolRef.current?.focus()
    }

    pernahTerbuka.current = terbuka
  }, [terbuka])

  useEffect(() => {
    if (!terbuka || typeof window.matchMedia !== 'function') {
      return
    }

    const breakpointMd = getComputedStyle(document.documentElement)
      .getPropertyValue('--breakpoint-md')
      .trim()

    if (!breakpointMd) {
      return
    }

    const mediaDesktop = window.matchMedia(`(min-width: ${breakpointMd})`)

    function saatBreakpointBerubah(event: MediaQueryListEvent) {
      if (event.matches) {
        setTerbuka(false)
      }
    }

    mediaDesktop.addEventListener('change', saatBreakpointBerubah)

    return () => mediaDesktop.removeEventListener('change', saatBreakpointBerubah)
  }, [terbuka])

  return (
    <>
      <button
        ref={tombolRef}
        type="button"
        onClick={() => setTerbuka(true)}
        aria-expanded={terbuka}
        aria-controls="menu-utama"
        className={`inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-border-strong px-4 font-display text-label uppercase ${KELAS_FOKUS}`}
      >
        Menu
      </button>

      {terbuka
        ? createPortal(
            <div
              id="menu-utama"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu utama"
              className="fixed inset-0 z-50 flex flex-col gap-10 bg-surface-base px-5 py-6 md:hidden"
            >
              <button
                type="button"
                onClick={() => setTerbuka(false)}
                className={`ml-auto inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-border-strong px-4 font-display text-label uppercase ${KELAS_FOKUS}`}
              >
                Tutup{' '}
                <span className="sr-only">menu</span>
              </button>

              <nav aria-label="Navigasi utama">
                <ul className="flex flex-col gap-6">
                  {items.map((item) => {
                    const aktif = item.href === pathname

                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          aria-current={aktif ? 'page' : undefined}
                          onClick={() => setTerbuka(false)}
                          className={`inline-flex min-h-11 items-center border-l-4 pl-4 font-display text-section uppercase ${KELAS_FOKUS} ${
                            aktif
                              ? 'border-accent text-accent'
                              : 'border-transparent text-content-primary'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
