import { useState, type Dispatch, type SetStateAction } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { STATUSES, isStatus, type Application } from '../lib/types'
import { ApplicationCard } from './ApplicationCard'
import { Column } from './Column'

interface Props {
  applications: Application[]
  setApplications: Dispatch<SetStateAction<Application[]>>
  onCardClick: (application: Application) => void
}

/**
 * The four columns and the drag-and-drop logic.
 * The order of `applications` is also the order of the cards within each column.
 */
export function Board({ applications, setApplications, onCardClick }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    // Mouse: a small movement threshold, so a plain click doesn't start a drag.
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // Touch: press and hold to pick a card up, so a normal swipe still scrolls the page.
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeApplication = applications.find((a) => a.id === activeId)

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id))
  }

  /** While dragging over another column, move the card into it so the column makes room. */
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return
    const draggedId = String(active.id)
    const overId = String(over.id)
    if (draggedId === overId) return

    setApplications((apps) => {
      const dragged = apps.find((a) => a.id === draggedId)
      const targetStatus = isStatus(overId) ? overId : apps.find((a) => a.id === overId)?.status
      if (!dragged || !targetStatus || dragged.status === targetStatus) return apps

      const moved = { ...dragged, status: targetStatus }
      const rest = apps.filter((a) => a.id !== draggedId)
      if (isStatus(overId)) return [...rest, moved]

      const overIndex = rest.findIndex((a) => a.id === overId)
      return [...rest.slice(0, overIndex), moved, ...rest.slice(overIndex)]
    })
  }

  /** On drop within the same column, reorder. */
  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return
    const draggedId = String(active.id)
    const overId = String(over.id)
    if (draggedId === overId || isStatus(overId)) return

    setApplications((apps) => {
      const from = apps.findIndex((a) => a.id === draggedId)
      const to = apps.findIndex((a) => a.id === overId)
      if (from === -1 || to === -1 || apps[from].status !== apps[to].status) return apps
      return arrayMove(apps, from, to)
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            applications={applications.filter((a) => a.status === status)}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication ? <ApplicationCard application={activeApplication} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
