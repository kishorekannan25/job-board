import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {children}
            </div>
        </div>
    )
}