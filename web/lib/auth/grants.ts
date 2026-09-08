import { ACCESS_MODULES } from '@/lib/auth/modules'

export type AccessModule =
  | 'news'
  | 'roster'
  | 'matches'
  | 'media-kit'
  | 'partners'
  | 'inbox'
  | 'menu'
  | 'situs'
  | 'users'
  | 'kategori'
  | 'peran'
  | 'halaman'
  | 'jadwal'
  | 'kas-operasional'
  | 'kas-tim'
  | 'laporan'

export type AccessAction = 'view' | 'create' | 'update' | 'delete'

export type Grant = Record<AccessAction, boolean>
export type GrantMatrix = Record<AccessModule, Grant>

export const EMPTY_GRANT: Grant = { view: false, create: false, update: false, delete: false }

const FULL_GRANT: Grant = { view: true, create: true, update: true, delete: true }

const EDITOR_MODULES: AccessModule[] = [
  'news',
  'roster',
  'matches',
  'media-kit',
  'partners',
  'inbox',
  'kategori',
  'halaman',
]

function grantForModule(module: AccessModule, grant: Grant): GrantMatrix {
  const matrix = emptyMatrix()
  matrix[module] = clampGrant(grant)
  return matrix
}

export function emptyMatrix(): GrantMatrix {
  const matrix = {} as GrantMatrix
  for (const { id } of ACCESS_MODULES) {
    matrix[id] = { ...EMPTY_GRANT }
  }
  return matrix
}

export function clampGrant(g: Grant): Grant {
  if (!g.view) {
    return { ...EMPTY_GRANT }
  }

  return {
    view: true,
    create: g.create,
    update: g.update,
    delete: g.delete,
  }
}

export function unionMatrices(matrices: GrantMatrix[]): GrantMatrix {
  if (matrices.length === 0) {
    return emptyMatrix()
  }

  const result = emptyMatrix()

  for (const matrix of matrices) {
    for (const { id } of ACCESS_MODULES) {
      const grant = matrix[id]
      result[id] = {
        view: result[id].view || grant.view,
        create: result[id].create || grant.create,
        update: result[id].update || grant.update,
        delete: result[id].delete || grant.delete,
      }
    }
  }

  return result
}

export function can(matrix: GrantMatrix, module: AccessModule, action: AccessAction): boolean {
  return matrix[module][action]
}

export function editorTemplate(): GrantMatrix {
  const matrix = emptyMatrix()
  for (const module of EDITOR_MODULES) {
    matrix[module] = { ...FULL_GRANT }
  }
  return matrix
}

export function teamTemplate(): GrantMatrix {
  return unionMatrices([
    grantForModule('jadwal', { view: true, create: false, update: true, delete: false }),
    grantForModule('kas-tim', { view: true, create: true, update: true, delete: false }),
  ])
}

export function financeTemplate(): GrantMatrix {
  return unionMatrices([
    grantForModule('kas-operasional', { view: true, create: true, update: true, delete: false }),
    grantForModule('kas-tim', { view: true, create: true, update: true, delete: false }),
    grantForModule('laporan', { view: true, create: false, update: false, delete: false }),
    grantForModule('jadwal', { view: true, create: false, update: false, delete: false }),
  ])
}

export function adminTemplate(): GrantMatrix {
  const matrix = emptyMatrix()
  for (const { id } of ACCESS_MODULES) {
    matrix[id] = { ...FULL_GRANT }
  }
  return matrix
}

export function isAdminMatrixReduced(next: GrantMatrix): boolean {
  for (const { id } of ACCESS_MODULES) {
    for (const action of ['view', 'create', 'update', 'delete'] as const) {
      if (!next[id][action]) {
        return true
      }
    }
  }

  return false
}
