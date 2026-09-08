export interface CashCsvRow {
  date: string
  direction: string
  amount: number
  category: string
  description: string
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

export function cashEntriesToCsv(rows: CashCsvRow[]): string {
  const header = 'tanggal,arah,jumlah,kategori,uraian'
  const lines = rows.map((row) =>
    [row.date, row.direction, String(row.amount), escapeCsv(row.category), escapeCsv(row.description)].join(','),
  )

  return [header, ...lines].join('\n')
}
