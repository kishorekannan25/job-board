import { useState, type FormEvent } from 'react'
import { STATUSES, STATUS_META, isStatus, type Application } from '../lib/types'
import { toDateInput, toDateTimeInput } from '../lib/dates'
import { Trash2 } from 'lucide-react'

interface ApplicationFormProps {
  initial?: Application
  onSubmit: (data: Omit<Application, 'id'>) => void
  onCancel: () => void
  onDelete?: () => void
}

const labelClass = 'block text-sm font-medium text-slate-700'
const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

export function ApplicationForm({ initial, onSubmit, onCancel, onDelete }: ApplicationFormProps) {
  const [form, setForm] = useState({
    company: initial?.company ?? '',
    role: initial?.role ?? '',
    status: initial?.status ?? 'applied',
    appliedDate: initial?.appliedDate ?? toDateInput(new Date()),
    interviewAt: initial?.interviewAt ? toDateTimeInput(initial.interviewAt) : '',
    salary: initial?.salary ?? '',
    location: initial?.location ?? '',
    notes: initial?.notes ?? '',
  })


  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      company: form.company.trim(),
      role: form.role.trim(),
      status: isStatus(form.status) ? form.status : 'applied',
      appliedDate: form.appliedDate,
      interviewAt: form.interviewAt ? new Date(form.interviewAt).toISOString() : undefined,
      salary: form.salary.trim() || undefined,
      location: form.location.trim() || undefined,
      notes: form.notes.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Company *
          <input
            className={inputClass}
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
            required
            autoFocus
          />
        </label>
        <label className={labelClass}>
          Role *
          <input
            className={inputClass}
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            required
          />
        </label>
        <label className={labelClass}>
          Status
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Applied date
          <input
            type="date"
            className={inputClass}
            value={form.appliedDate}
            onChange={(e) => update('appliedDate', e.target.value)}
            required
          />
        </label>
        <label className={labelClass}>
          Interview (optional)
          <input
            type="datetime-local"
            className={inputClass}
            value={form.interviewAt}
            onChange={(e) => update('interviewAt', e.target.value)}
          />
          <span className="mt-1 block text-xs font-normal text-slate-400">Pick both a date and a time</span>
        </label>
        <label className={labelClass}>
          Salary
          <input
            className={inputClass}
            value={form.salary}
            onChange={(e) => update('salary', e.target.value)}
            placeholder="RM 5,000 – 6,500"
          />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Location
          <input
            className={inputClass}
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="Kuala Lumpur · Hybrid"
          />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Notes
          <textarea
            rows={3}
            className={inputClass}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </label>
      </div>

      <div className="flex items-center gap-2 pt-2">
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Delete this application?')) onDelete()
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        )}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>

    </form>
  )
}
