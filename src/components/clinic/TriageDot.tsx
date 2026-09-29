import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import type { Urgency } from "./types"

// Static class maps — Tailwind JIT cannot see template-built classes.
const RING: Record<Urgency, string> = {
  routine: "border-clinic-ok",
  rush: "border-clinic-warn",
  urgent: "border-clinic-critical",
}
const HALF: Record<Urgency, string> = { routine: "", rush: "bg-clinic-warn", urgent: "" }
const FILLED: Record<Urgency, string> = {
  routine: "bg-clinic-ok",
  rush: "bg-clinic-warn",
  urgent: "bg-clinic-critical",
}

/** Clinical urgency (ปกติ · รีบ · ด่วน) — severity scale WITH a shape channel:
 * routine = hollow ring, rush = half-filled, urgent = filled with centre dot.
 * Colour is never the only channel (02 §4.1). Do not reuse for processing
 * status — that is StatusDot. */
export function TriageDot({
  level,
  showLabel = false,
  size = "md",
  className,
}: {
  level: Urgency
  showLabel?: boolean
  size?: "sm" | "md"
  className?: string
}) {
  const { t } = useTranslation()
  const px = size === "sm" ? "size-3" : "size-4"
  return (
    <span data-triage={level} className={cn("inline-flex items-center gap-1.5", className)} aria-label={t(`clinic.urgency.${level}`)}>
      {level === "routine" && <span className={cn("inline-block rounded-full border-2", px, RING[level])} aria-hidden="true" />}
      {level === "rush" && (
        <span className={cn("relative inline-block overflow-hidden rounded-full border-2", px, RING[level])} aria-hidden="true">
          <span className={cn("absolute inset-y-0 left-0 w-1/2", HALF[level])} />
        </span>
      )}
      {level === "urgent" && (
        <span className={cn("relative inline-block rounded-full", px, FILLED[level])} aria-hidden="true">
          <span className="absolute inset-0 m-auto size-1/3 rounded-full bg-card" />
        </span>
      )}
      {showLabel && <span className="text-xs font-medium text-things-gray-3">{t(`clinic.urgency.${level}`)}</span>}
    </span>
  )
}

/** Inline legend; with `counts` it doubles as a workload summary. */
export function TriageLegend({
  levels = ["routine", "rush", "urgent"],
  counts,
  className,
}: {
  levels?: Urgency[]
  counts?: Partial<Record<Urgency, number>>
  className?: string
}) {
  return (
    <div data-triage-legend className={cn("flex items-center gap-4", className)}>
      {levels.map((l) => (
        <span key={l} className="inline-flex items-center gap-1.5">
          <TriageDot level={l} showLabel />
          {counts && <span className="clinic-num text-xs text-things-gray-3">{counts[l] ?? 0}</span>}
        </span>
      ))}
    </div>
  )
}
