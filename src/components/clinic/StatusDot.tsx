import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { statusColor } from "./tokens"
import type { VisitStatus } from "./types"

/** Semantic dot for visit/processing status (สถานะ axis — flow tones,
 * deliberately not severity; 00-corrections §1). */
export function StatusDot({
  tone,
  label,
  size = "md",
  className,
}: {
  tone: VisitStatus
  label?: string
  size?: "sm" | "md"
  className?: string
}) {
  const { t } = useTranslation()
  const text = label ?? t(`clinic.queue.${tone}`)
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        data-status-dot={tone}
        className={cn("inline-block shrink-0 rounded-full", statusColor[tone], size === "sm" ? "size-1.5" : "size-2")}
        aria-hidden="true"
      />
      {text !== "" ? (
        <span className="text-xs text-things-gray-3">{text}</span>
      ) : (
        <span className="sr-only">{t(`clinic.queue.${tone}`)}</span>
      )}
    </span>
  )
}

/** Inline legend row; with `onChange` it doubles as a filter, with `counts`
 * a workload summary. */
export function StatusLegend({
  items,
  counts,
  value,
  onChange,
  className,
}: {
  items: { tone: VisitStatus; label: string }[]
  counts?: Partial<Record<VisitStatus, number>>
  value?: VisitStatus[]
  onChange?: (v: VisitStatus[]) => void
  className?: string
}) {
  const toggle = (tone: VisitStatus) => {
    if (!onChange || !value) return
    onChange(value.includes(tone) ? value.filter((t) => t !== tone) : [...value, tone])
  }
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)} role={onChange ? "group" : undefined}>
      {items.map(({ tone, label }) => {
        const active = !value || value.includes(tone)
        return (
          <button
            key={tone}
            type="button"
            disabled={!onChange}
            onClick={() => toggle(tone)}
            className={cn("inline-flex items-center gap-1.5 text-xs", onChange && "cursor-pointer", !active && "opacity-40")}
            aria-pressed={onChange ? active : undefined}
          >
            <span className={cn("inline-block size-2 rounded-full", statusColor[tone])} aria-hidden="true" />
            <span className="text-things-gray-3">{label}</span>
            {counts?.[tone] !== undefined && <span className="clinic-num text-things-gray">{counts[tone]}</span>}
          </button>
        )
      })}
    </div>
  )
}
