export const STATUSES = ['applied', 'interview', 'offer', 'rejected'] as const

export type Status = (typeof STATUSES)[number]

export interface Application {
  id: string
  company: string
  role: string
  status: Status
  /** Date applied, as YYYY-MM-DD. */
  appliedDate: string
  /** Interview date and time, as an ISO string. */
  interviewAt?: string
  salary?: string
  location?: string
  notes?: string
}

export function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value)
}

export const STATUS_META: Record<Status, { label: string; dot: string; badge: string }> = {
  applied: {
    label: 'Applied',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700',
  },
  interview: {
    label: 'Interview',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-800',
  },
  offer: {
    label: 'Offer',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  rejected: {
    label: 'Rejected',
    dot: 'bg-rose-400',
    badge: 'bg-rose-100 text-rose-800',
  },
}
