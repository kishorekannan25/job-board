import { isStatus, type Application } from './types'
import { toDateInput } from './dates'

/** Downloads the applications as a JSON file, e.g. job-board-2026-11-15.json. */
export function downloadBackup(applications: Application[]) {
    const json = JSON.stringify(applications, null, 2)
    const file = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(file)

    const link = document.createElement('a')
    link.href = url
    link.download = `job-board-${toDateInput(new Date())}.json`
    link.click()

    URL.revokeObjectURL(url)
}

/** Reads a backup file's text. Returns the applications, or null if it is not a valid backup. */
export function parseBackup(text: string): Application[] | null {
    let data: unknown
    try {
        data = JSON.parse(text)
    } catch {
        return null
    }
    if (!Array.isArray(data)) return null

    const applications: Application[] = []
    for (const item of data) {
        if (
            typeof item !== 'object' ||
            item === null ||
            typeof item.company !== 'string' ||
            typeof item.role !== 'string' ||
            typeof item.appliedDate !== 'string' ||
            typeof item.status !== 'string' ||
            !isStatus(item.status)
        ) {
            return null
        }

        applications.push({
            id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
            company: item.company,
            role: item.role,
            status: item.status,
            appliedDate: item.appliedDate,
            interviewAt: typeof item.interviewAt === 'string' ? item.interviewAt : undefined,
            salary: typeof item.salary === 'string' ? item.salary : undefined,
            location: typeof item.location === 'string' ? item.location : undefined,
            notes: typeof item.notes === 'string' ? item.notes : undefined,
        })
    }
    return applications
}

