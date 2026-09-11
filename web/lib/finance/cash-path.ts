export function cashBookPath(type: string): '/internal/cash/operasional' | '/internal/cash/tim' {
  return type === 'tim' ? '/internal/cash/tim' : '/internal/cash/operasional'
}
