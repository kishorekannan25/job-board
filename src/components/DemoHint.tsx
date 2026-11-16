import { useEffect, useRef, useState } from 'react'
import { Sparkles, X } from 'lucide-react'

const STORAGE_KEY = 'job-board:hint-dismissed'

/** Read the saved choice. Storage can be blocked (private mode), so fall back to showing the hint. */
function wasDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function saveDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // Storage blocked: the hint just comes back next visit.
  }
}

/** A friendly tip for first-time visitors. It hides after their first click, tap or drag, or when closed. */
export function DemoHint() {
  const [visible, setVisible] = useState(() => !wasDismissed())
  const hintRef = useRef<HTMLDivElement>(null)

  // Hide the hint after the visitor's first click, tap or drag anywhere else on the page.
  // "pointerup" fires when a mouse button or finger is lifted, which covers clicks, taps and drags.
  // A finger that scrolls the page doesn't fire it, so visitors can still scroll and read the hint.
  useEffect(() => {
    if (!visible) return
    function handleFirstMove(e: PointerEvent) {
      if (hintRef.current?.contains(e.target as Node)) return
      setVisible(false)
      saveDismissed()
    }
    // "true" (capture) hears the event before anything else on the page can stop it.
    document.addEventListener('pointerup', handleFirstMove, true)
    return () => document.removeEventListener('pointerup', handleFirstMove, true)
  }, [visible])

  function dismiss() {
    setVisible(false)
    saveDismissed()
  }

  if (!visible) return null

  return (
    <div
      ref={hintRef}
      className="mb-6 flex items-start gap-3 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900 ring-1 ring-indigo-200 motion-safe:animate-fade-in dark:bg-indigo-950/40 dark:text-indigo-100 dark:ring-indigo-900">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
      <p className="flex-1">
        <span className="font-semibold">Welcome! This is a live demo with sample data.</span>{' '}
        Drag cards between columns (press and hold on a phone) or click one to edit. Changes stay in your browser.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss tip"
        title="Dismiss tip"
        className="-m-1 rounded-md p-1 text-indigo-400 transition hover:bg-indigo-100 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/60 dark:hover:text-indigo-200"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
