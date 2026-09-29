import type { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// TaskCountList — worklist with live counts (04, Layer 1; WinForms EMR "My Tasks").
// Zero counts render muted, not hidden — Health Exchange (0); absence is
// information. Counts are tabular. `variant="chips"` is the top-bar skin.

export interface TaskCountItem {
  id: string
  label: string
  icon?: LucideIcon
  count: number
  href?: string
}

export function TaskCountList({
  items,
  activeId,
  onSelect,
  variant = "list",
  className,
}: {
  items: TaskCountItem[]
  activeId?: string
  onSelect?: (id: string) => void
  variant?: "list" | "chips"
  className?: string
}) {
  const { t } = useTranslation()

  if (variant === "chips") {
    return (
      <div data-slot="task-count-list" data-variant="chips" className={cn("flex flex-wrap items-center gap-1.5", className)}>
        {items.map((it) => {
          const Icon = it.icon
          const active = it.id === activeId
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onSelect?.(it.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                active
                  ? "border-things-blue bg-things-blue-soft text-things-blue"
                  : "border-things-tag-border bg-things-chip text-things-gray-2 hover:bg-things-hover",
              )}
            >
              {Icon && <Icon className="size-3" aria-hidden="true" />}
              {it.label}
              <Count count={it.count} />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <ul data-slot="task-count-list" data-variant="list" className={cn("flex flex-col", className)} aria-label={t("clinic.tasks.label")}>
      {items.map((it) => {
        const Icon = it.icon
        const active = it.id === activeId
        const rowCls = cn(
          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
          active ? "bg-things-select text-things-blue" : "text-things-gray-2 hover:bg-things-hover",
        )
        const inner = (
          <>
            {Icon && <Icon className={cn("size-4 shrink-0", active ? "text-things-blue" : "text-things-gray-3")} aria-hidden="true" />}
            <span className={cn("min-w-0 flex-1 truncate", active && "font-medium")}>{it.label}</span>
            <Count count={it.count} />
          </>
        )
        return (
          <li key={it.id}>
            {it.href ? (
              <a href={it.href} aria-current={active ? "page" : undefined} className={rowCls}>
                {inner}
              </a>
            ) : (
              <button type="button" onClick={() => onSelect?.(it.id)} aria-current={active ? "true" : undefined} className={rowCls}>
                {inner}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Count({ count }: { count: number }) {
  return (
    <span
      className={cn(
        "clinic-num rounded-full px-1.5 py-px text-[11px] leading-4",
        count === 0 ? "text-things-gray-3" : "bg-things-badge/10 text-things-title",
      )}
      title={count === 0 ? undefined : String(count)}
    >
      {count}
    </span>
  )
}
