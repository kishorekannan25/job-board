import { Plus, RotateCcw, Search, CalendarClock } from 'lucide-react'
import { Board } from './components/Board'
import { useState } from 'react'
import { Modal } from './components/Modal'
import { useApplications } from './hooks/useApplications'
import { ApplicationForm } from './components/ApplicationForm'
import type { Application } from './lib/types'
import { isUpcoming } from './lib/dates'


export default function App() {
  const { applications, setApplications, resetDemo, addApplication, updateApplication, deleteApplication } = useApplications()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [search, setSearch] = useState('')
  const [upcomingOnly, setUpcomingOnly] = useState(false)

  const query = search.trim().toLowerCase()
  const visibleApplications = applications.filter((a) => {
    const matchesSearch = a.company.toLowerCase().includes(query) || a.role.toLowerCase().includes(query)
    const matchesFilter = !upcomingOnly || isUpcoming(a.interviewAt)
    return matchesSearch && matchesFilter
  })
  const isFiltering = query !== '' || upcomingOnly

  const inProgress = applications.filter((a) => a.status === 'applied' || a.status === 'interview').length


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Job Board</h1>
          <p className="mt-1 text-sm text-slate-500">
            {applications.length} applications · {inProgress} in progress · drag a card to update its stage
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition hover:bg-white hover:text-slate-900"
          >
            <RotateCcw className="size-4" />
            Reset demo data
          </button>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
          >
            <Plus className="size-4" />
            Add application
          </button>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setUpcomingOnly(!upcomingOnly)}
          aria-pressed={upcomingOnly}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ring-1 transition ${upcomingOnly
              ? 'bg-amber-50 text-amber-800 ring-amber-300'
              : 'bg-white text-slate-600 ring-slate-200 hover:text-slate-900'
            }`}
        >
          <CalendarClock className="size-4" />
          Upcoming interviews
        </button>
        {isFiltering && (
          <p className="text-sm text-slate-500">
            Showing {visibleApplications.length} of {applications.length}
          </p>
        )}
      </div>

      <Board applications={visibleApplications} setApplications={setApplications} onCardClick={setEditing} />
      <Modal open={isFormOpen} title="Add Application" onClose={() => setIsFormOpen(false)}>
        <ApplicationForm
          onSubmit={(data) => {
            addApplication(data)
            setIsFormOpen(false)
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
      <Modal open={editing !== null} title="Edit application" onClose={() => setEditing(null)}>
        {editing && (
          <ApplicationForm
            initial={editing}
            onSubmit={(data) => {
              updateApplication({ ...data, id: editing.id })
              setEditing(null)
            }}
            onCancel={() => setEditing(null)}
            onDelete={() => {
              deleteApplication(editing.id)
              setEditing(null)
            }}
          />
        )}
      </Modal>
    </div>
  )
}
