import { useMemo, useState } from "react"
import { ChevronRight, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// MedicationTimeline — therapy Gantt (04, Layer 5; the Vitals-Analysis bottom
// strip). Round cap = start, arrow cap = ongoing, ✕ cap + grey bar =
// discontinued — the source's encoding, kept because it is genuinely good.
// x-axis aligns with TrendChart (same pxPerDay and range math) so "BP dropped
// when lisinopril started" is visible; keep the two in one container.

const DAY_MS = 86400_000
const PAD_DAYS = 5

const STATUS_BAR: Record<string, string> = {
  active: "var(--color-things-blue)",
  held: "var(--color-things-gold)",
  stopped: "var(--color-things-gray-3)",
}

export type TimelineZoom = "day" | "week" | "month"

/** Zoom level → px/day + tick density. Day zooms in (28px/day, daily ticks);
 *  month zooms out to the whole window at a glance. */
const ZOOM_PX: Record<TimelineZoom, number> = { day: 28, week: 6, month: 1.5 }

export interface MedSpan {
  id: string
  label: string
  start: string
  end?: string
  status: "active" | "stopped" | "held"
  dose?: string
}

export function MedicationTimeline({
  meds,
  range,
  pxPerDay = 28,
  lookbackDays = 550,
  show = "all",
  onShowChange,
  zoom: zoomProp,
  onZoomChange,
  today,
  maxHeight = 240,
  className,
}: {
  meds: MedSpan[]
  /** Optional [startISO, endISO] window — pass TrendChart's for alignment. */
  range?: [string, string]
  pxPerDay?: number
  /** Default window when no `range` is given (days back from the latest
   *  activity). Bars older than this clamp to the left edge. */
  lookbackDays?: number
  show?: "current" | "all"
  onShowChange?: (s: "current" | "all") => void
  /** Zoom level: sets the px/day scale and tick density. Overrides pxPerDay;
   *  omitted → adaptive scale (auto windows) or pxPerDay (ranges). */
  zoom?: TimelineZoom
  onZoomChange?(z: TimelineZoom): void
  /** ISO date for the today marker; defaults to the real clock. */
  today?: string
  maxHeight?: number | string
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const [zoomState, setZoomState] = useState<TimelineZoom | undefined>(undefined)
  const zoom = zoomProp ?? zoomState
  const setZoom = (z: TimelineZoom) => {
    setZoomState(z)
    onZoomChange?.(z)
  }

  const rows = useMemo(
    () => (show === "current" ? meds.filter((m) => m.status !== "stopped") : meds),
    [meds, show],
  )

  const [startMs, totalDays] = useMemo(() => {
    if (range) {
      const s = Date.parse(range[0])
      return [s, Math.ceil((Date.parse(range[1]) - s) / DAY_MS)]
    }
    // no explicit range: bound the window to a lookback (default ~18 months).
    // Without this, one ancient med (Aspirin 2019–) stretches the axis to
    // ~75,000px and the recent therapy becomes an invisible sliver.
    const starts = rows.map((m) => Date.parse(m.start))
    const ends = rows.map((m) => Date.parse(m.end ?? m.start))
    const windowEnd = Math.max(...ends, Date.parse(today ?? new Date().toISOString()))
    const oldest = Math.min(...starts) - PAD_DAYS * DAY_MS
    // zooming in also tightens the auto window — Day over 18 months would be
    // mostly empty scroll; recent therapy is what day-level detail is for
    const lookback = zoom === "day" ? Math.min(lookbackDays, 90) : zoom === "week" ? Math.min(lookbackDays, 270) : lookbackDays
    const s = Math.max(oldest, windowEnd - lookback * DAY_MS)
    return [s, Math.ceil((windowEnd - s) / DAY_MS) + PAD_DAYS]
  }, [rows, range, today, lookbackDays, zoom])

  // bars that begin before the window clamp to the left edge; a flat left
  // edge (no round cap) reads as "cut off", matching the clamped start
  const clamped = (iso: string) => Date.parse(iso) < startMs

  // scale precedence: explicit zoom > caller pxPerDay with a range (TrendChart
  // alignment) > adaptive (~700px fit) for auto windows
  const px = zoom ? ZOOM_PX[zoom] : range ? pxPerDay : Math.max(1.5, Math.min(pxPerDay, 700 / totalDays))
  const xOf = (iso: string) => Math.max(0, ((Date.parse(iso) - startMs) / DAY_MS) * px)
  const trackWidth = totalDays * px
  const todayX = ((Date.parse(today ?? new Date().toISOString()) - startMs) / DAY_MS) * px

  const ticks = useMemo(() => {
    const out: Array<{ x: number; label: string; strong?: boolean }> = []
    const end = startMs + totalDays * DAY_MS
    const push = (ms: number, label: string, strong?: boolean) => {
      if (ms >= startMs && ms <= end) out.push({ x: ((ms - startMs) / DAY_MS) * px, label, strong })
    }
    if (!zoom || zoom === "month") {
      const dt = new Date(startMs)
      dt.setUTCDate(1)
      while (dt.getTime() < end) {
        push(dt.getTime(), new Intl.DateTimeFormat(i18n.language, { month: "short", year: "2-digit", timeZone: "UTC" }).format(dt))
        dt.setUTCMonth(dt.getUTCMonth() + 1)
      }
    } else if (zoom === "week") {
      for (let d = 0; d <= totalDays; d += 7) {
        const dt = new Date(startMs + d * DAY_MS)
        push(startMs + d * DAY_MS, new Intl.DateTimeFormat(i18n.language, { month: "short", day: "2-digit", timeZone: "UTC" }).format(dt))
      }
    } else {
      for (let d = 0; d <= totalDays; d++) {
        const dt = new Date(startMs + d * DAY_MS)
        const monthStart = d === 0 || dt.getUTCDate() === 1
        push(startMs + d * DAY_MS, monthStart ? new Intl.DateTimeFormat(i18n.language, { month: "short", day: "numeric", timeZone: "UTC" }).format(dt) : String(dt.getUTCDate()), monthStart)
      }
    }
    return out
  }, [startMs, totalDays, px, zoom, i18n.language])

  return (
    <div data-slot="medication-timeline" className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {onShowChange && (
          <ToggleGroup
            type="single"
            value={show}
            onValueChange={(v) => v && onShowChange(v as "current" | "all")}
            variant="outline"
            size="sm"
            aria-label={t("clinic.med.show")}
          >
            <ToggleGroupItem value="current" className="px-2.5 py-0.5 text-xs">
              {t("clinic.med.current")}
            </ToggleGroupItem>
            <ToggleGroupItem value="all" className="px-2.5 py-0.5 text-xs">
              {t("clinic.med.all")}
            </ToggleGroupItem>
          </ToggleGroup>
        )}
        {/* auto windows get the zoom group by default; range-aligned callers
            (TrendChart x-axis) opt in via zoom/onZoomChange */}
        {(onZoomChange || zoomProp || !range) && (
          <ToggleGroup
            type="single"
            value={zoom ?? "month"}
            onValueChange={(v) => v && setZoom(v as TimelineZoom)}
            variant="outline"
            size="sm"
            aria-label={t("clinic.zoom.label")}
          >
            {(["day", "week", "month"] as const).map((z) => (
              <ToggleGroupItem key={z} value={z} className="px-2.5 py-0.5 text-xs">
                {t(`clinic.zoom.${z}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>

      <div className="overflow-auto rounded-md border border-things-hairline bg-card" style={{ maxHeight }}>
        <div style={{ width: 148 + trackWidth }} className="min-w-full">
          <div className="sticky top-0 z-10 flex border-b border-clinic-grid-line bg-clinic-grid-header">
            <div className="w-[148px] shrink-0 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-things-gray-3">
              {t("clinic.med.label")}
            </div>
            <div className="relative h-6 flex-1">
              {ticks.map((tk, i) => (
                <span
                  key={i}
                  className={cn(
                    "clinic-num absolute top-1 -translate-x-1/2 whitespace-nowrap text-[10px]",
                    tk.strong ? "font-semibold text-things-gray-2" : "text-things-gray-3",
                  )}
                  style={{ left: tk.x }}
                >
                  {tk.label}
                </span>
              ))}
            </div>
          </div>

          {rows.map((m) => {
            const color = STATUS_BAR[m.status]
            const startX = xOf(m.start)
            const ongoing = !m.end
            const endX = Math.min(trackWidth, xOf(m.end ?? today ?? new Date().toISOString()))
            const width = Math.max(10, endX - startX)
            return (
              <div key={m.id} className="flex border-b border-clinic-grid-line last:border-b-0">
                <div className="w-[148px] shrink-0 px-2 py-1">
                  <p className="truncate text-xs font-medium text-things-title">{m.label}</p>
                  <p className="clinic-num truncate text-[10px] text-things-gray-3">
                    {m.dose} · {t(`clinic.med.status.${m.status}`)}
                  </p>
                </div>
                <div className="relative h-8 flex-1">
                  <div
                    data-med-id={m.id}
                    data-med-status={m.status}
                    data-clamped={clamped(m.start) ? "" : undefined}
                    className={cn(
                      "absolute top-1/2 flex h-3.5 -translate-y-1/2 items-center",
                      clamped(m.start) ? "" : "rounded-l-full",
                      m.status === "stopped" ? "rounded-r-full" : "",
                    )}
                    style={{ left: startX, width, backgroundColor: `color-mix(in srgb, ${color} ${m.status === "stopped" ? "35%" : "80%"}, transparent)` }}
                    title={`${m.label}${m.dose ? ` — ${m.dose}` : ""}`}
                  >
                    {/* caps: arrow = ongoing, ✕ = discontinued */}
                    {ongoing && m.status !== "stopped" && (
                      <ChevronRight className="ml-auto size-3.5 shrink-0 text-things-title" aria-hidden="true" />
                    )}
                    {m.status === "stopped" && (
                      <X className="mx-auto size-3 shrink-0 text-things-gray-2" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {todayX >= 0 && todayX <= trackWidth && (
        <p className="clinic-num text-right text-[10px] text-things-gray-3">{t("clinic.timeline.today")}</p>
      )}
    </div>
  )
}
