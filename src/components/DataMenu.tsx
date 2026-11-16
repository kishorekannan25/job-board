import { useEffect, useRef, useState } from 'react'
import { Download, Ellipsis, RotateCcw, Trash2, Upload } from 'lucide-react'

interface Props {
  onExport: () => void
  onImport: () => void
  onClear: () => void
  onReset: () => void
}

/** The "⋯" button that holds the data actions (export, import, clear, reset). */
export function DataMenu({ onExport, onImport, onClear, onReset }: Props) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close when clicking anywhere outside the menu, or when pressing Escape.
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  // Each item closes the menu, then runs its action.
  const items = [
    { label: 'Export backup', icon: Download, action: onExport },
    { label: 'Import backup', icon: Upload, action: onImport },
    { label: 'Reset demo data', icon: RotateCcw, action: onReset },
    { label: 'Clear all', icon: Trash2, action: onClear, danger: true },
  ]

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Data options"
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-lg p-2 text-slate-600 ring-1 ring-slate-200 transition hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <Ellipsis className="size-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200 motion-safe:animate-pop-in dark:bg-slate-900 dark:ring-slate-800"
        >
          {items.map(({ label, icon: Icon, action, danger }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                action()
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                danger
                  ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
