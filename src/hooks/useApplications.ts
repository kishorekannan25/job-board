import { useEffect, useState } from 'react'
import type { Application } from '../lib/types'
import { createSampleApplications } from '../lib/sampleData'

const STORAGE_KEY = 'job-board:applications'

/** Saved applications, or the demo data on a first visit. */
function loadApplications(): Application[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return JSON.parse(saved) as Application[]
  } catch {
    // Storage blocked or data corrupted: fall back to the demo data.
  }
  return createSampleApplications()
}

/**
 * All application data lives here, in React state, and is copied to
 * localStorage after every change, so it survives a refresh.
 */
export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(loadApplications)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
    } catch {
      // Storage full or blocked: the board still works for this visit.
    }
  }, [applications])

  function resetDemo() {
    setApplications(createSampleApplications())
  }

  function addApplication(data: Omit<Application, 'id'>) {
    const newApp: Application = { ...data, id: crypto.randomUUID() }
    setApplications((prev) => [newApp, ...prev])
  }

  function updateApplication(updated: Application) {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  function deleteApplication(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  function clearAll() {
    setApplications([])
  }

  return { applications, setApplications, resetDemo, addApplication, updateApplication, deleteApplication, clearAll }
}
