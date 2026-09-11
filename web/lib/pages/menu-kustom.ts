export function customFieldName(id: string): string {
  return `custom:${id}`
}

export function customPagesForMenu(
  pages: {
    id: string
    title: string
    kind: string
    status: string
    isEnabled: boolean
  }[],
): { id: string; title: string; isEnabled: boolean; fieldName: string }[] {
  return pages
    .filter((page) => page.kind === 'custom' && page.status === 'published')
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, 'id'))
    .map((page) => ({
      id: page.id,
      title: page.title,
      isEnabled: page.isEnabled,
      fieldName: customFieldName(page.id),
    }))
}
