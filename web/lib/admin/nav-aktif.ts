export function adminPathAktif(href: string, pathname: string): boolean {
  if (href === '/cms' || href === '/internal') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
