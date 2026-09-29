import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// ChartTabNav — vertical section nav for the chart (04, Layer 1; WinForms EMR
// "Chart Tabs"). Active uses things-blue — the source's amber is reserved for
// clinic-warn. Below md the same API renders a horizontally scrolling tab
// strip.

export function ChartTabNav({
  sections,
  activeId,
  onSelect,
  orientation = "vertical",
  className,
}: {
  sections: Array<{ id: string; label: string; badge?: string | number }>
  activeId: string
  onSelect: (id: string) => void
  /** `auto` = vertical at ≥md, horizontal strip below. */
  orientation?: "vertical" | "horizontal" | "auto"
  className?: string
}) {
  const { t } = useTranslation()
  const horizCls = orientation === "horizontal" || orientation === "auto"
  return (
    <nav
      data-slot="chart-tab-nav"
      aria-label={t("clinic.chartnav.label")}
      className={cn(
        "flex",
        horizCls ? "flex-row items-center gap-1 overflow-x-auto border-b border-things-hairline pb-px md:hidden" : "",
        orientation === "vertical" ? "flex-col gap-0.5" : "",
        orientation === "auto" ? "flex-col gap-0.5 max-md:hidden" : "",
        className,
      )}
    >
      {sections.map((s) => {
        const active = s.id === activeId
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(s.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-sm text-sm transition-colors",
              horizCls ? "border-b-2 px-2.5 py-1.5" : "min-h-8 w-full px-2.5 py-1.5",
              active
                ? cn("font-medium text-things-blue", horizCls ? "border-things-blue" : "bg-things-select")
                : cn("text-things-gray-2 hover:text-things-title", horizCls ? "border-transparent" : "hover:bg-things-hover"),
            )}
          >
            <span className="min-w-0 truncate">{s.label}</span>
            {s.badge !== undefined && (
              <span className="clinic-num shrink-0 rounded-full bg-things-badge/15 px-1.5 text-[11px] leading-4 text-things-title">{s.badge}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
