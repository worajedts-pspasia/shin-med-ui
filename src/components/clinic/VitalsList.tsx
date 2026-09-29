import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

// VitalsList — label / value / date, most recent (04, Layer 3; the
// Vitals-Analysis left column). Clicking a row plots it into TrendChart.
// The trend arrow is an addition; it stays gray — direction is not severity.

const TREND_ICON: Record<string, { icon: LucideIcon; cls: string }> = {
  up: { icon: ArrowUpRight, cls: "text-things-gray-3" },
  down: { icon: ArrowDownRight, cls: "text-things-gray-3" },
  flat: { icon: Minus, cls: "text-things-gray-3" },
}

export function VitalsList({
  items,
  onSelect,
  className,
}: {
  items: Array<{ id?: string; label: string; value?: string; unit?: string; at?: string; trend?: "up" | "down" | "flat" }>
  onSelect?: (id: string) => void
  className?: string
}) {
  return (
    <ul data-slot="vitals-list" className={cn("flex flex-col", className)}>
      {items.map((it, i) => {
        const Trend = it.trend ? TREND_ICON[it.trend] : undefined
        const key = it.id ?? String(i)
        const row = (
          <>
            <span className="min-w-0 flex-1 truncate text-xs text-things-gray-3">{it.label}</span>
            <span className="clinic-num flex items-baseline gap-1 text-sm text-things-title">
              {it.value ?? "—"}
              {it.unit && <span className="text-[11px] font-normal text-things-gray-3">{it.unit}</span>}
            </span>
            {Trend && <Trend.icon className={cn("size-3.5 shrink-0", Trend.cls)} aria-hidden="true" />}
            {it.at && <span className="clinic-num w-20 shrink-0 text-right text-[11px] text-things-gray-3">{it.at}</span>}
          </>
        )
        return (
          <li key={key}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(key)}
                className="flex w-full items-baseline gap-2 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-things-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-things-blue"
              >
                {row}
              </button>
            ) : (
              <div className="flex w-full items-baseline gap-2 px-2 py-1.5">{row}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
