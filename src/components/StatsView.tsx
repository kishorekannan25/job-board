import type { Application } from '../lib/types'
import { isUpcoming } from '../lib/dates'
import { StatusChart } from './StatusChart'
import { WeeklyChart } from './WeeklyChart'


function percent(part: number, total: number): string {
    return total === 0 ? '0%' : `${Math.round((part / total) * 100)}%`
}

export function StatsView({ applications }: { applications: Application[] }) {
    const total = applications.length
    const heardBack = applications.filter((a) => a.status !== 'applied').length
    const upcoming = applications.filter((a) => isUpcoming(a.interviewAt)).length
    const offers = applications.filter((a) => a.status === 'offer').length

    const tiles = [
        { label: 'Applications', value: String(total), detail: 'tracked in total' },
        { label: 'Response rate', value: percent(heardBack, total), detail: `${heardBack} of ${total} heard back` },
        { label: 'Upcoming interviews', value: String(upcoming), detail: 'scheduled ahead' },
        { label: 'Offers', value: String(offers), detail: `${percent(offers, total)} of applications` },
    ]

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {tiles.map((tile) => (
                    <div key={tile.label} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">{tile.label}</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{tile.value}</p>
                        <p className="mt-1 text-sm text-slate-500">{tile.detail}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <StatusChart applications={applications} />
                <WeeklyChart applications={applications} />
            </div>

        </div>
    )
}
