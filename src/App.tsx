import { CalendarClock, ChartColumn, Github, LayoutGrid, Moon, Plus, Search, Sun, SearchX } from 'lucide-react'
import { downloadBackup, parseBackup } from './lib/backup'
import { useTheme } from './hooks/useTheme'
import { Board } from './components/Board'
import { lazy, Suspense, useRef, useState, type ChangeEvent } from 'react'
import { Modal } from './components/Modal'
import { useApplications } from './hooks/useApplications'
import { ApplicationForm } from './components/ApplicationForm'
import type { Application } from './lib/types'
import { isUpcoming } from './lib/dates'
import { EmptyBoard } from './components/EmptyBoard'
import { DataMenu } from './components/DataMenu'
import { Logo } from './components/Logo'
import { DemoHint } from './components/DemoHint'

const REPO_URL = 'https://github.com/kishorekannan25/job-board'

// The stats view (and the chart library it uses) is only downloaded the first time someone opens Stats.
const StatsView = lazy(() => import('./components/StatsView').then((m) => ({ default: m.StatsView })))

function tabClass(active: boolean) {
  return `inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
    }`
}

const iconButtonClass =
  'rounded-lg p-2 text-slate-600 ring-1 ring-slate-200 transition hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white'

export default function App() {
  const { applications, setApplications, resetDemo, addApplication, updateApplication, deleteApplication, clearAll } = useApplications()
  const { theme, toggleTheme } = useTheme()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [search, setSearch] = useState('')
  const [upcomingOnly, setUpcomingOnly] = useState(false)
  const [view, setView] = useState<'board' | 'stats'>('board')

  const fileInput = useRef<HTMLInputElement>(null)

  async function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const imported = parseBackup(await file.text())
    if (!imported) {
      window.alert('That file is not a Job Board backup.')
      return
    }
    if (window.confirm(`Replace your board with ${imported.length} applications from this file?`)) {
      setApplications(imported)
    }
  }

  const query = search.trim().toLowerCase()

  const visibleApplications = applications.filter((a) => {
    const matchesSearch = a.company.toLowerCase().includes(query) || a.role.toLowerCase().includes(query)
    const matchesFilter = !upcomingOnly || isUpcoming(a.interviewAt)
    return matchesSearch && matchesFilter
  })

  const isFiltering = query !== '' || upcomingOnly
  function clearFilters() {
    setSearch('')
    setUpcomingOnly(false)
  }

  const inProgress = applications.filter((a) => a.status === 'applied' || a.status === 'interview').length


  return (
    <div className="relative isolate flex min-h-screen flex-col">
      {/* A soft indigo glow behind the top of the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(99,102,241,0.14),transparent)] dark:bg-[radial-gradient(55%_60%_at_50%_0%,rgba(99,102,241,0.22),transparent)]"
      />

      {/* Top bar: stays at the top while the page scrolls. */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Job Board</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Source code on GitHub"
              title="Source code on GitHub"
              className={iconButtonClass}
            >
              <Github className="size-4" />
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={iconButtonClass}
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              aria-label="Add application"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.98]"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add application</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Your applications</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {applications.length} applications · {inProgress} in progress
              <span className="hidden sm:inline"> · drag a card to update its stage</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-slate-200/70 p-1 dark:bg-slate-800">
              <button type="button" onClick={() => setView('board')} className={tabClass(view === 'board')}>
                <LayoutGrid className="size-4" />
                Board
              </button>
              <button type="button" onClick={() => setView('stats')} className={tabClass(view === 'stats')}>
                <ChartColumn className="size-4" />
                Stats
              </button>
            </div>
            <DataMenu
              onExport={() => downloadBackup(applications)}
              onImport={() => fileInput.current?.click()}
              onReset={resetDemo}
              onClear={() => {
                if (window.confirm('Delete all applications? Export first if you want a backup.')) clearAll()
              }}
            />
            <input ref={fileInput} type="file" accept=".json,application/json" onChange={handleImport} className="hidden" />
          </div>
        </div>

        {/* key={view} makes the content fade in again each time you switch between Board and Stats. */}
        <div key={view} className="motion-safe:animate-fade-in">
      {view === 'board' ? (
        <>
          {applications.length > 0 && <DemoHint />}

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

          {applications.length === 0 ? (
            <EmptyBoard onAdd={() => setIsFormOpen(true)} onReset={resetDemo} />
          ) : visibleApplications.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-16 text-center dark:border-slate-800">
              <SearchX className="size-8 text-slate-400 dark:text-slate-500" />
              <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">No applications match</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try another search, or clear the filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <Board applications={visibleApplications} setApplications={setApplications} onCardClick={setEditing} />
          )}

        </>
      ) : (
        <Suspense fallback={<p className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">Loading stats…</p>}>
          <StatsView applications={applications} />
        </Suspense>
      )}
        </div>
      </main>

      <footer className="border-t border-slate-200/70 dark:border-slate-800/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-slate-400">
          <p>Built by Kishore with React, TypeScript and Tailwind CSS. Your data stays in your browser.</p>
        </div>
      </footer>

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
