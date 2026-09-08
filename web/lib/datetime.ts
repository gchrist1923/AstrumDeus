export function toDatetimeLocal(value: Date | string): string {
  const date = new Date(value)
  const wib = new Date(date.getTime() + 7 * 60 * 60 * 1000)
  return wib.toISOString().slice(0, 16)
}

export function fromDatetimeLocal(value: string): Date {
  return new Date(`${value}:00+07:00`)
}

export function toDateInput(value: Date | string): string {
  return toDatetimeLocal(value).slice(0, 10)
}

export function fromDateInput(value: string): Date {
  return new Date(`${value}T00:00:00+07:00`)
}
