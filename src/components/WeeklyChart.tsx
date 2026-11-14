import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Application } from '../lib/types'
import { startOfWeek, toDateInput } from '../lib/dates'

const WEEKS = 8

export function WeeklyChart({ applications }: { applications: Application[] }) {
    const thisWeek = startOfWeek(new Date())

    const data = Array.from({ length: WEEKS }, (_, i) => {
        const start = new Date(thisWeek)
        start.setDate(start.getDate() - (WEEKS - 1 - i) * 7)
        const end = new Date(start)
        end.setDate(end.getDate() + 7)

        const from = toDateInput(start)
        const to = toDateInput(end)

        return {
            week: start.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
            count: applications.filter((a) => a.appliedDate >= from && a.appliedDate < to).length,
        }
    })

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 ring-1 ring-slate-200 dark:ring-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Applications per week</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last {WEEKS} weeks</p>
            <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
                        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="week" tick={{ fill: 'var(--chart-axis)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: 'var(--chart-axis)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'var(--chart-cursor)' }}
                            labelFormatter={(label) => `Week of ${label}`}
                            formatter={(value) => [value, 'Applications']}
                            contentStyle={{ borderRadius: 8, borderColor: 'var(--chart-grid)', backgroundColor: 'var(--chart-tooltip-bg)', fontSize: 13 }}
                            itemStyle={{ color: 'var(--chart-label)' }}
                        />
                        <Bar dataKey="count" fill="var(--chart-bar)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
