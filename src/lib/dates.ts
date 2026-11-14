const DAY = 24 * 60 * 60 * 1000

/** A YYYY-MM-DD date `days` before today. */
export function daysAgo(days: number): string {
  const date = new Date(Date.now() - days * DAY)
  return toDateInput(date)
}

/** An ISO date-time `days` from today at the given hour and minute. */
export function daysFromNow(days: number, hour: number, minute = 0): string {
  const date = new Date(Date.now() + days * DAY)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

export function toDateInput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** "Today", "Yesterday", "3d ago", "2w ago", or a short date for older ones. */
export function relativeDay(dateInput: string): string {
  const today = new Date(toDateInput(new Date()))
  const days = Math.round((today.getTime() - new Date(dateInput).getTime()) / DAY)

  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 14) return `${days}d ago`
  if (days < 60) return `${Math.floor(days / 7)}w ago`
  return new Date(dateInput).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function isUpcoming(iso?: string): boolean {
  return !!iso && new Date(iso).getTime() > Date.now()
}

/** "Tue, 3 Nov · 2:00 PM" */
export function formatInterview(iso: string): string {
  const date = new Date(iso)
  const day = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${day} · ${time}`
}

/** An ISO date-time as "YYYY-MM-DDTHH:mm" in local time, for a datetime-local input. */
export function toDateTimeInput(iso: string): string {
  const date = new Date(iso)
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${toDateInput(date)}T${h}:${min}`   
}
