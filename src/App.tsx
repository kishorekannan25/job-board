import { CalendarClock, ChartColumn, LayoutGrid, Moon, Plus, RotateCcw, Search, Sun } from 'lucide-react'
import { useTheme } from './hooks/useTheme'
import { Board } from './components/Board'
import { useState } from 'react'
import { Modal } from './components/Modal'
import { useApplications } from './hooks/useApplications'
import { ApplicationForm } from './components/ApplicationForm'
import type { Application } from './lib/types'
import { isUpcoming } from './lib/dates'
import { StatsView } from './components/StatsView'

function tabClass(active: boolean) {
  return `inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
    }`
}

export default function App() {
  const { applications, setApplications, resetDemo, addApplication, updateApplication, deleteApplication } = useApplications()
  const { theme, toggleTheme } = useTheme()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [search, setSearch] = useState('')
  const [upcomingOnly, setUpcomingOnly] = useState(false)
  const [view, setView] = useState<'board' | 'stats'>('board')

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Job Board</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {applications.length} applications · {inProgress} in progress · drag a card to update its stage
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800 transition hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800 transition hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
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

      <div className="mb-6 inline-flex rounded-lg bg-slate-200/70 dark:bg-slate-800 p-1">
        <button type="button" onClick={() => setView('board')} className={tabClass(view === 'board')}>
          <LayoutGrid className="size-4" />
          Board
        </button>
        <button type="button" onClick={() => setView('stats')} className={tabClass(view === 'stats')}>
          <ChartColumn className="size-4" />
          Stats
        </button>
      </div>

      {view === 'board' ? (
        <>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company or role"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pr-3 pl-9 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button
              type="button"
              onClick={() => setUpcomingOnly(!upcomingOnly)}
              aria-pressed={upcomingOnly}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ring-1 transition ${upcomingOnly
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 ring-amber-300 dark:ring-amber-700'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 ring-slate-200 dark:ring-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <CalendarClock className="size-4" />
              Upcoming interviews
            </button>
            {isFiltering && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {visibleApplications.length} of {applications.length}
              </p>
            )}
          </div>

          <Board applications={visibleApplications} setApplications={setApplications} onCardClick={setEditing} />
        </>
      ) : (
        <StatsView applications={applications} />
      )}

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
