# Admin mobile nav Implementation Plan

> Implement in this session. TDD. Do not commit unless Grace asks.

**Goal:** Menu HP untuk CMS/Internal plus judul pada form yang kosong.

**Architecture:** Generalize `MobileMenu` slightly. `AdminNav` client: tombol Menu di header, sidebar `hidden md:flex`. Helper `adminPathAktif` untuk aria-current.

**Tech Stack:** Next.js, React 19, Vitest.
