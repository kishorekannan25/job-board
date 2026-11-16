import { Inbox, Plus, RotateCcw } from 'lucide-react'

interface EmptyBoardProps {
    onAdd: () => void
    onReset: () => void
}

/** Shown instead of the board when there are no applications at all. */
export function EmptyBoard({ onAdd, onReset }: EmptyBoardProps) {
    return (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-16 text-center dark:border-slate-800">
            <div className="flex size-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                <Inbox className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Your board is empty</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Add your first application, or bring back the demo data to explore the board.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                >
                    <Plus className="size-4" />
                    Add application
                </button>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                    <RotateCcw className="size-4" />
                    Load demo data
                </button>
            </div>
        </div>
    )
}
