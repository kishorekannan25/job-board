import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { STATUSES, STATUS_META, type Application } from '../lib/types'

export function StatusChart({ applications }: { applications: Application[] }) {
    const data = STATUSES.map((status) => ({
        name: STATUS_META[status].label,
        count: applications.filter((a) => a.status === status).length,
    }))

    return (
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Applications by stage</h3>
            <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
                        <CartesianGrid horizontal={false} stroke="#e2e8f0" />
                        <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={80}
                            tick={{ fill: '#334155', fontSize: 13 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            formatter={(value) => [value, 'Applications']}
                            contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }}
                            itemStyle={{ color: '#334155' }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={24}>
                            <LabelList dataKey="count" position="right" fill="#334155" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
