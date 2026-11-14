import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { STATUS_META, type Application, type Status } from '../lib/types'
import { SortableCard } from './SortableCard'

interface Props {
  status: Status
  applications: Application[]
  onCardClick: (application: Application) => void
}

/** One stage of the board. The column itself is a drop target, so empty columns accept cards too. */
export function Column({ status, applications, onCardClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const meta = STATUS_META[status]

  return (
    <section className="flex w-72 shrink-0 flex-col sm:w-auto sm:flex-1">
      <header className="mb-3 flex items-center gap-2 px-1">
        <span className={`size-2.5 rounded-full ${meta.dot}`} />
        <h2 className="text-sm font-semibold text-slate-700">{meta.label}</h2>
        <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-xs font-medium text-slate-600">
          {applications.length}
        </span>
      </header>

      <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex min-h-40 flex-1 flex-col gap-3 rounded-2xl p-2 transition-colors ${
            isOver ? 'bg-indigo-50 ring-2 ring-indigo-200' : 'bg-slate-100/80'
          }`}
        >
          {applications.map((application) => (
            <SortableCard 
            key={application.id} 
            application={application} 
            onClick={() => onCardClick(application)}
            />
          ))}

          {applications.length === 0 && (
            <p className="m-auto py-8 text-center text-sm text-slate-400">Drop a card here</p>
          )}
        </div>
      </SortableContext>
    </section>
  )
}
