import { cn } from "@/lib/utils"

// TimelinePill — a labelled event bar (04, Layer 5; an open-source EMR bars, WinForms EMR
// appointment blocks). Extracted because EventTimeline, MedicationTimeline
// and ScheduleGrid all draw the same primitive: soft category-tinted fill +
// 3px left bar, tabular time, muted meta. Fill and bar come from one CSS-var
// colour via color-mix — no template-built Tailwind classes.

export function TimelinePill({
  label,
  color,
  meta,
  time,
  selected,
  truncate = true,
  className,
  style,
  ...props
}: {
  label: string
  /** CSS var, e.g. "var(--color-things-teal)". */
  color: string
  meta?: string
  time?: string
  selected?: boolean
  truncate?: boolean
} & Omit<React.ComponentProps<"div">, "style"> & { style?: React.CSSProperties }) {
  return (
    <div
      data-slot="timeline-pill"
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex h-6 items-center gap-1.5 rounded border-l-[3px] px-1.5 text-xs transition-shadow",
        truncate && "min-w-0",
        selected && "ring-2 ring-things-blue/40",
        className,
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
        borderLeftColor: color,
        ...style,
      }}
      {...props}
    >
      {time && <span className="clinic-num shrink-0 text-[11px] text-things-gray-2">{time}</span>}
      <span className={cn("truncate font-medium text-things-title", truncate && "min-w-0")}>{label}</span>
      {meta && <span className="hidden shrink-0 text-[11px] text-things-gray-3 sm:inline">{meta}</span>}
    </div>
  )
}
