import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { STATUSES, STATUS_META, type Application } from '../lib/types'

export function StatusChart({ applications }: { applications: Application[] }) {
    const data = STATUSES.map((status) => ({
        name: STATUS_META[status].label,
        count: applications.filter((a) => a.status === status).length,
    }))

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 ring-1 ring-slate-200 dark:ring-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Applications by stage</h3>
            <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
                        <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
                        <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={80}
                            tick={{ fill: 'var(--chart-label)', fontSize: 13 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--chart-cursor)' }}
                            formatter={(value) => [value, 'Applications']}
                            contentStyle={{ borderRadius: 8, borderColor: 'var(--chart-grid)', backgroundColor: 'var(--chart-tooltip-bg)', fontSize: 13 }}
                            itemStyle={{ color: 'var(--chart-label)' }}
                        />
                        <Bar dataKey="count" fill="var(--chart-bar)" radius={[0, 4, 4, 0]} maxBarSize={24}>
                            <LabelList dataKey="count" position="right" fill="var(--chart-label)" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
