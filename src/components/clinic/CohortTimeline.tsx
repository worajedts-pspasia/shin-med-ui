import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { CATEGORY_COLORS } from "./tokens"
import type { CategoryId } from "./tokens"

// CohortTimeline — multi-patient swimlanes (04, Layer 9, a timeline tool):
// population-health view with align (calendar dates vs first event), rank
// (name vs first event) and category filtering. Events are category-coloured
// dots — the category palette, never severity. Dots that land close together
// (or on the same day) de-stack into rows inside the lane so every event
// stays individually countable. Desktop-only (lg+).

export interface CohortEvent {
  at: string
  category: CategoryId
  label: string
}

export interface CohortPatient {
  id: string
  name: string
  events: CohortEvent[]
}

export function CohortTimeline({
  patients,
  align = "dates",
  rank = "name",
  visibleCategories,
  className,
}: {
  patients: CohortPatient[]
  align?: "dates" | "first-event"
  rank?: "name" | "first-event"
  /** Category ids still shown; defaults to all. */
  visibleCategories?: string[]
  className?: string
}) {
  const { t } = useTranslation()
  const trackRef = useRef<HTMLSpanElement | null>(null)
  const [trackPx, setTrackPx] = useState(0)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setTrackPx(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const allCategories = Array.from(new Set(patients.flatMap((p) => p.events.map((e) => e.category))))
  const visible = visibleCategories ?? allCategories

  const lanes = patients
    .map((p) => ({ ...p, shown: p.events.filter((e) => visible.includes(e.category)) }))
    .filter((p) => p.shown.length > 0)

  const times = lanes.flatMap((p) => p.shown.map((e) => Date.parse(e.at)))
  const origin = align === "first-event" ? Math.min(...lanes.map((p) => Math.min(...p.shown.map((e) => Date.parse(e.at))))) : Math.min(...times)
  const end = Math.max(...times, origin + 1)
  const span = end - origin || 1
  const pct = (at: string) => ((Date.parse(at) - origin) / span) * 100

  // De-stack: px positions from the measured track; each dot claims the lowest
  // row whose last dot is far enough away, so same-day events stack visibly.
  const DOT = 12
  const ROW = 14
  const MIN_SEP = DOT + 4
  const W = trackPx || 560
  const stacked = (events: CohortEvent[]) => {
    const sorted = [...events].sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    const rowLast: number[] = []
    return sorted.map((ev) => {
      const left = (pct(ev.at) / 100) * W
      let row = rowLast.findIndex((last) => left - last >= MIN_SEP)
      if (row === -1) {
        rowLast.push(left)
        row = rowLast.length - 1
      } else {
        rowLast[row] = left
      }
      return { ev, left, row }
    })
  }
  const rowsIn = (events: CohortEvent[]) => Math.max(1, ...stacked(events).map((d) => d.row + 1))

  const ordered =
    rank === "first-event"
      ? [...lanes].sort((a, b) => Math.min(...a.shown.map((e) => Date.parse(e.at))) - Math.min(...b.shown.map((e) => Date.parse(e.at))))
      : [...lanes].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div
      data-slot="cohort-timeline"
      data-align={align}
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="hidden lg:block">
        <div className="border-b border-things-hairline px-3 py-1.5">
          <div className="flex items-center justify-between text-xs text-things-gray-2">
            <span className="clinic-num">{new Date(origin).toISOString().slice(0, 10)}</span>
            <span>{t("clinic.cohort.alignLabel")}: {t(`clinic.cohort.align.${align}`)}</span>
            <span className="clinic-num">{new Date(end).toISOString().slice(0, 10)}</span>
          </div>
        </div>
        <ul className="divide-y divide-things-hairline/60">
          {ordered.map((p, laneIdx) => (
            <li key={p.id} data-lane={p.id} className="flex items-center gap-3 px-3 py-2">
              <span className="w-36 shrink-0 truncate text-sm text-things-title" title={p.name}>
                {p.name}
              </span>
              <span
                ref={laneIdx === 0 ? trackRef : undefined}
                data-track
                className="relative min-w-0 flex-1 rounded-sm bg-things-sidebar/40"
                style={{ height: rowsIn(p.shown) * ROW + 2 }}
              >
                {/* quarter gridlines */}
                {[25, 50, 75].map((x) => (
                  <span key={x} className="absolute inset-y-0 w-px bg-things-hairline/60" style={{ left: `${x}%` }} aria-hidden="true" />
                ))}
                {stacked(p.shown).map(({ ev, left, row }) => (
                  <span
                    key={`${ev.at}-${ev.category}`}
                    data-event={ev.category}
                    title={`${ev.at} — ${ev.label}`}
                    className={cn("absolute size-3 rounded-full border border-white", CATEGORY_COLORS[ev.category].dot)}
                    style={{ left: Math.max(0, left - DOT / 2), top: row * ROW + 1 }}
                  />
                ))}
              </span>
              <span className="clinic-num w-8 shrink-0 text-right text-xs text-things-gray-2">{p.shown.length}</span>
            </li>
          ))}
        </ul>
        {lanes.length === 0 && (
          <p className="p-6 text-center text-sm text-things-gray-3">{t("clinic.cohort.empty")}</p>
        )}
      </div>
      <div className="space-y-2 p-3 lg:hidden">
        <p className="text-xs text-things-gray-3">{t("clinic.cohort.desktopOnly")}</p>
        <p className="clinic-num text-sm text-things-title">
          {lanes.length} {t("clinic.cohort.patients")}
        </p>
      </div>
    </div>
  )
}
