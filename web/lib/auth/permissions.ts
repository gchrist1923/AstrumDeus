import { can, type AccessModule, type GrantMatrix } from '@/lib/auth/grants'

export const CMS_MODULES: AccessModule[] = [
  'news',
  'roster',
  'matches',
  'media-kit',
  'partners',
  'inbox',
  'menu',
  'situs',
  'users',
  'kategori',
  'peran',
  'halaman',
]

export const INTERNAL_MODULES: AccessModule[] = ['jadwal', 'kas-operasional', 'kas-tim', 'laporan']

const MEDIA_WRITE_MODULES: AccessModule[] = ['news', 'roster', 'media-kit', 'partners', 'situs', 'halaman']

export function canAccessCms(matrix: GrantMatrix): boolean {
  return CMS_MODULES.some((module) => can(matrix, module, 'view'))
}

export function canAccessInternal(matrix: GrantMatrix): boolean {
  return INTERNAL_MODULES.some((module) => can(matrix, module, 'view'))
}

export function canToggleMenu(matrix: GrantMatrix): boolean {
  return can(matrix, 'menu', 'view')
}

export function canWriteSchedule(matrix: GrantMatrix, ownerId: string, actorId: string): boolean {
  if (can(matrix, 'jadwal', 'delete')) {
    return true
  }

  return can(matrix, 'jadwal', 'update') && ownerId === actorId
}

function cashModule(bookType: 'operasional' | 'tim'): AccessModule {
  return bookType === 'operasional' ? 'kas-operasional' : 'kas-tim'
}

export function canReadCashBook(matrix: GrantMatrix, bookType: 'operasional' | 'tim'): boolean {
  return can(matrix, cashModule(bookType), 'view')
}

export function canWriteCashBook(
  matrix: GrantMatrix,
  bookType: 'operasional' | 'tim',
  recordedById: string,
  actorId: string,
): boolean {
  const module = cashModule(bookType)
  if (!can(matrix, module, 'view')) {
    return false
  }

  if (can(matrix, module, 'delete')) {
    return true
  }

  if (bookType === 'operasional') {
    return can(matrix, 'kas-operasional', 'create') || can(matrix, 'kas-operasional', 'update')
  }

  if (can(matrix, 'kas-operasional', 'update')) {
    return true
  }

  return (can(matrix, 'kas-tim', 'create') || can(matrix, 'kas-tim', 'update')) && recordedById === actorId
}

export function canReverseCashEntry(
  matrix: GrantMatrix,
  bookType: 'operasional' | 'tim',
  recordedById: string,
  actorId: string,
  isCorrected: boolean,
): boolean {
  if (isCorrected) {
    return false
  }

  return canWriteCashBook(matrix, bookType, recordedById, actorId)
}

export function postLoginPath(matrix: GrantMatrix, next: string): string {
  const tujuan = next.startsWith('/') && !next.startsWith('//') ? next : '/cms'

  if (tujuan.startsWith('/internal')) {
    if (canAccessInternal(matrix)) return tujuan
    if (canAccessCms(matrix)) return '/cms'
    return '/login'
  }

  if (tujuan.startsWith('/cms')) {
    if (canAccessCms(matrix)) return tujuan
    if (canAccessInternal(matrix)) return '/internal'
    return '/login'
  }

  if (canAccessCms(matrix)) return '/cms'
  if (canAccessInternal(matrix)) return '/internal'
  return '/login'
}

export function canUploadMedia(matrix: GrantMatrix): boolean {
  return MEDIA_WRITE_MODULES.some((module) => can(matrix, module, 'create') || can(matrix, module, 'update'))
}

export function redirectForModule(module: AccessModule): '/cms' | '/internal' {
  return INTERNAL_MODULES.includes(module) ? '/internal' : '/cms'
}
