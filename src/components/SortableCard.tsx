import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Application } from '../lib/types'
import { ApplicationCard } from './ApplicationCard'

/** A card that can be picked up and dropped in another position or column. */
export function SortableCard({ application, onClick }: { application: Application; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`cursor-grab touch-manipulation select-none ${isDragging ? 'opacity-40' : ''}`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <ApplicationCard application={application} />
    </div>
  )
}
