/** The app's logo mark: three Kanban columns on an indigo tile (the same shape as the favicon). */
export function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logo-bg)" />
      <rect x="7" y="8" width="5" height="16" rx="1.5" fill="white" />
      <rect x="13.5" y="8" width="5" height="11" rx="1.5" fill="white" opacity="0.85" />
      <rect x="20" y="8" width="5" height="7" rx="1.5" fill="white" opacity="0.7" />
    </svg>
  )
}
