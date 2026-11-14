import { CalendarClock, MapPin, Wallet } from 'lucide-react'
import type { Application } from '../lib/types'
import { formatInterview, isUpcoming, relativeDay } from '../lib/dates'

const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-pink-500',
]

/** The same company always gets the same avatar colour. */
function avatarColor(company: string): string {
  const sum = [...company].reduce((total, char) => total + char.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

interface Props {
  application: Application
  /** Styles the floating copy that follows the cursor while dragging. */
  overlay?: boolean
}

export function ApplicationCard({ application, overlay = false }: Props) {
  const { company, role, appliedDate, interviewAt, salary, location } = application

  return (
    <div
      className={`rounded-xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 ${
        overlay ? 'rotate-2 cursor-grabbing shadow-xl ring-indigo-300 dark:ring-indigo-700' : 'shadow-sm hover:shadow-md hover:ring-slate-300 dark:hover:ring-slate-700'
      } transition-shadow`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white ${avatarColor(company)}`}
        >
          {company.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{company}</p>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">{role}</p>
        </div>
        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{relativeDay(appliedDate)}</span>
      </div>

      {(location || salary) && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          {location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {location}
            </span>
          )}
          {salary && (
            <span className="inline-flex items-center gap-1">
              <Wallet className="size-3.5" /> {salary}
            </span>
          )}
        </div>
      )}

            {interviewAt && (
        <div
          className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ${
            isUpcoming(interviewAt)
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 ring-amber-200 dark:ring-amber-800'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ring-slate-200 dark:ring-slate-800'
          }`}
        >
          <CalendarClock className="size-3.5" />
          {formatInterview(interviewAt)}
        </div>
      )}

    </div>
  )
}
