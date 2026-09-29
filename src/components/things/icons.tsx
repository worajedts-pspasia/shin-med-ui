// Sidebar and content icons, drawn to match the reference product look.

export function InboxGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="3.4" fill="#4a7cf5" />
      <path
        d="M7.6 11.6h2.1l1.2 2.5h2.2l1.2-2.5h2.1"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StarGlyph({ className, filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
        fill={filled ? "#f7ce45" : "none"}
        stroke={filled ? "#e0b93a" : "#3b82ec"}
        strokeWidth={filled ? 0.8 : 1.6}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CalendarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3.5" y="4.8" width="17" height="15.7" rx="3" fill="#fff" stroke="#e8453c" strokeWidth="1.7" />
      <path d="M3.5 9.6h17" stroke="#e8453c" strokeWidth="1.7" />
      <path d="M8 2.9v3.4M16 2.9v3.4" stroke="#e8453c" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function LayersGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="14.2" width="16" height="5.2" rx="1.7" fill="none" stroke="#2db8a6" strokeWidth="1.6" />
      <rect x="4" y="8.9" width="16" height="5.2" rx="1.7" fill="none" stroke="#2db8a6" strokeWidth="1.6" />
      <rect x="4" y="3.6" width="16" height="5.2" rx="1.7" fill="none" stroke="#2db8a6" strokeWidth="1.6" />
    </svg>
  )
}

export function BoxGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3.7" y="9.4" width="16.6" height="10.9" rx="2.2" fill="none" stroke="#c9b458" strokeWidth="1.6" />
      <path d="M9.2 14.1h5.6" stroke="#c9b458" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.6 5.4h10.8" stroke="#c9b458" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function LogbookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="3.8" width="16" height="16.4" rx="3.2" fill="#3fbf6e" />
      <path d="M9.3 12l2.1 2.2 4-4.4" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M5.5 12.6l4.2 4.4 8.8-9.9"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Things' project progress pie: gray ring, blue wedge for the completed fraction. */
export function ProgressPie({
  fraction,
  size = 20,
  className,
}: {
  fraction: number
  size?: number
  className?: string
}) {
  const c = 12
  const r = 8.4
  const clamped = Math.min(1, Math.max(0, fraction))
  const angle = 2 * Math.PI * clamped
  const x = c + r * Math.sin(angle)
  const y = c - r * Math.cos(angle)
  const largeArc = clamped > 0.5 ? 1 : 0
  const wedge =
    clamped <= 0 ? null : clamped >= 1 ? (
      <circle cx={c} cy={c} r={r} fill="#3b82ec" />
    ) : (
      <path d={`M${c} ${c} L${c} ${c - r} A${r} ${r} 0 ${largeArc} 1 ${x} ${y} Z`} fill="#3b82ec" />
    )
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {wedge}
      <circle cx={c} cy={c} r={r - 0.4} fill="none" stroke="#3b82ec" strokeWidth="1.5" />
    </svg>
  )
}

/** The small list-icon squares shown next to projects in the sidebar. */
export function ListGlyph({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.2" fill={color} />
      <path d="M8.4 9.4h7.2M8.4 12.6h7.2M8.4 15.8h4.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
