import { useEffect, useMemo, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { AppointmentCard, STATUS_GLYPH, type ApptStatus } from "./AppointmentCard"
import { TimelinePill } from "./TimelinePill"
import { APPT_TYPE_COLOR } from "./tokens"

// ScheduleGrid — day / week resource calendar (04, Layer 3). Blocks are
// coloured by appointment TYPE from the category palette; status is a glyph —
// otherwise type and status compete for the same channel (the source's flaw).
// Overlaps split the column width. ≥lg: week × resource columns; md: single
// day with resources as columns; <md: an agenda list of AppointmentCards — a
// 5-day grid at 390px is unreadable, so we do not attempt it. Blocks render
// via TimelinePill; right-click gives the source's Completed/Not
// Completed/Discharged/Edit menu wholesale.

export interface ScheduleResource {
  id: string
  label: string
  /** CSS var — the column accent. */
  color: string
}

export interface ScheduleSlotAppt {
  id: string
  patient: Parameters<typeof AppointmentCard>[0]["appt"]["patient"]
  start: string // "09:00"
  end?: string
  type: string
  reason?: string
  location?: string
  status: ApptStatus
  day?: string // ISO, required in week view
}

export interface ScheduleSlot {
  start: string
  end?: string
  resourceId: string
  appt: ScheduleSlotAppt
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

function useBreakpoint() {
  // agenda <768; day grid 768–1023; week grid ≥1024
  const [kind, setKind] = useState<"agenda" | "day" | "week">("week")
  useEffect(() => {
    const sm = window.matchMedia("(min-width: 768px)")
    const lg = window.matchMedia("(min-width: 1024px)")
    const apply = () => setKind(!sm.matches ? "agenda" : lg.matches ? "week" : "day")
    apply()
    sm.addEventListener("change", apply)
    lg.addEventListener("change", apply)
    return () => {
      sm.removeEventListener("change", apply)
      lg.removeEventListener("change", apply)
    }
  }, [])
  return kind
}

export function ScheduleGrid({
  view = "day",
  resources,
  slots,
  interval = 30,
  businessHours = ["08:00", "18:00"],
  rangeLabel,
  onNavigate,
  onCreate,
  onMove,
  className,
}: {
  view?: "day" | "week"
  resources: ScheduleResource[]
  slots: ScheduleSlot[]
  interval?: 5 | 10 | 15 | 30
  businessHours?: [string, string]
  rangeLabel: string
  onNavigate?(dir: -1 | 1): void
  onCreate?(slot: { start: string; resourceId: string }): void
  onMove?(id: string, slot: { start: string; resourceId: string }): void
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const bp = useBreakpoint()
  const effective = bp === "agenda" ? "agenda" : view === "week" && bp === "week" ? "week" : "day"

  const days = useMemo(() => {
    if (effective !== "week") return [undefined]
    const set = new Set(slots.map((s) => s.appt.day).filter(Boolean) as string[])
    return [...set].sort().map((d) => d)
  }, [effective, slots])

  const header = (
    <div className="mb-2 flex items-center justify-between gap-2">
      <span className="clinic-num truncate text-sm font-medium text-things-title">{rangeLabel}</span>
      <span className="flex shrink-0 items-center gap-1">
        <Button variant="outline" size="icon-xs" aria-label={t("clinic.sched.prev")} onClick={() => onNavigate?.(-1)}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="xs" className="text-xs" onClick={() => onNavigate?.(0 as unknown as -1 | 1)}>
          {t("clinic.sched.today")}
        </Button>
        <Button variant="outline" size="icon-xs" aria-label={t("clinic.sched.next")} onClick={() => onNavigate?.(1)}>
          <ChevronRight aria-hidden="true" />
        </Button>
      </span>
    </div>
  )

  if (effective === "agenda") {
    // <md: agenda of AppointmentCards grouped by day, then hour — never a grid
    const byDay = new Map<string, ScheduleSlot[]>()
    for (const s of slots) {
      const key = s.appt.day ?? ""
      byDay.set(key, [...(byDay.get(key) ?? []), s])
    }
    return (
      <div data-slot="schedule-grid" data-view="agenda" className={cn("flex flex-col gap-3", className)}>
        {header}
        {[...byDay.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([day, list]) => (
            <section key={day}>
              <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-things-gray-3">
                {day ? new Intl.DateTimeFormat(i18n.language, { weekday: "short", month: "short", day: "2-digit", timeZone: "UTC" }).format(new Date(day)) : t("clinic.sched.today")}
              </h4>
              <div className="flex flex-col gap-2">
                {list
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map((s) => <AppointmentCard key={s.appt.id} appt={{ ...s.appt, start: s.start, end: s.end }} />)}
              </div>
            </section>
          ))}
      </div>
    )
  }

  // day / week grid
  const [from, to] = [toMin(businessHours[0]), toMin(businessHours[1])]
  const rows: number[] = []
  for (let m = from; m < to; m += interval) rows.push(m)
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`

  const rowH = Math.max(24, interval * 1.6)
  const offHours = (m: number) => m < from + 60 || m >= to - 60
  const columns: Array<{ key: string; label: string; color: string; day?: string }> =
    effective === "week"
      ? days.flatMap((day) => resources.map((r) => ({ key: `${day}:${r.id}`, label: r.label, color: r.color, day })))
      : resources.map((r) => ({ key: r.id, label: r.label, color: r.color }))

  // one column of blocks: absolute pills positioned against the full
  // column height; overlaps split the column width, as the source does
  const columnBlocks = (day: string | undefined, rId: string) => {
    const col = slots.filter((s) => s.resourceId === rId && (effective === "day" || s.appt.day === day))
    return col.map((s) => {
      const startM = toMin(s.start)
      const endM = s.end ? toMin(s.end) : startM + interval
      const cluster = col.filter(
        (o) => o !== s && toMin(o.start) < endM && (o.end ? toMin(o.end) : toMin(o.start) + interval) > startM,
      )
      const width = 100 / (cluster.length + 1)
      // lane = position within the overlap cluster (deterministic by id);
      // a filter-based index can hand every member the same lane, stacking
      // them on one offset instead of side-by-side
      const lanePeers = [s, ...cluster].sort((x, y) => x.appt.id.localeCompare(y.appt.id))
      const idx = lanePeers.indexOf(s)
      const color = APPT_TYPE_COLOR[s.appt.type] ?? "var(--color-things-gold)"
      const Glyph = STATUS_GLYPH[s.appt.status].icon
      const pctTop = ((startM - from) / (to - from)) * 100
      const pctH = Math.max(5, ((endM - startM) / (to - from)) * 100)
      return (
        <ContextMenu key={s.appt.id}>
          <ContextMenuTrigger asChild>
            <div
              data-slot="schedule-block"
              data-appt-id={s.appt.id}
              className="absolute px-0.5"
              style={{ top: `${pctTop}%`, height: `${pctH}%`, left: `${idx * width}%`, width: `${width}%` }}
              title={`${s.start}${s.end ? `–${s.end}` : ""} ${s.appt.type}`}
            >
              <TimelinePill
                label={shortName(s.appt.patient.name)}
                color={color}
                time={s.start}
                truncate
                className="h-full min-h-6 w-full cursor-pointer"
              >
                <Glyph className="ml-auto size-3 shrink-0 text-things-gray-2" aria-hidden="true" />
              </TimelinePill>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => onMove?.(s.appt.id, { start: s.start, resourceId: rId })}>{t("clinic.appt.action.edit")}</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => onMove?.(s.appt.id, { start: s.start, resourceId: rId })}>{t("clinic.appt.action.completed")}</ContextMenuItem>
            <ContextMenuItem onSelect={() => onMove?.(s.appt.id, { start: s.start, resourceId: rId })}>{t("clinic.appt.action.notCompleted")}</ContextMenuItem>
            <ContextMenuItem onSelect={() => onMove?.(s.appt.id, { start: s.start, resourceId: rId })}>{t("clinic.appt.action.discharged")}</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
    })
  }

  return (
    <div data-slot="schedule-grid" data-view={effective} className={cn("flex flex-col", className)}>
      {header}
      <div className="overflow-auto rounded-md border border-things-hairline bg-card">
        {/* header row */}
        <div className="sticky top-0 z-20 flex border-b border-clinic-grid-line bg-clinic-grid-header">
          <div className="w-14 shrink-0" />
          {columns.map((c) => (
            <div key={c.key} className="min-w-28 flex-1 border-l border-clinic-grid-line px-1.5 py-1 text-[11px] font-semibold text-things-gray-2">
              <span className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: c.color }} aria-hidden="true" />
                <span className="truncate">{c.label}</span>
                {c.day && (
                  <span className="clinic-num ml-auto shrink-0 font-normal text-things-gray-3">
                    {new Intl.DateTimeFormat(i18n.language, { weekday: "short", timeZone: "UTC" }).format(new Date(c.day))}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* body: time gutter + one relative container per column */}
        <div className="flex">
          <div className="w-14 shrink-0">
            {rows.map((m) => (
              <div
                key={m}
                className={cn("border-b border-clinic-grid-line pr-1 pt-0.5 text-right text-[10px] text-things-gray-3", offHours(m) && "bg-clinic-lane")}
                style={{ height: `${rowH}px` }}
              >
                <span className="clinic-num">{fmt(m)}</span>
              </div>
            ))}
          </div>
          {columns.map((c) => {
            const rId = effective === "week" ? c.key.split(":")[1] : c.key
            return (
              <div key={c.key} className="relative min-w-28 flex-1 border-l border-clinic-grid-line">
                {rows.map((m) => (
                  <div
                    key={m}
                    className={cn("border-b border-clinic-grid-line", offHours(m) ? "bg-clinic-lane" : "hover:bg-things-hover/40")}
                    style={{ height: `${rowH}px` }}
                    onClick={() => onCreate?.({ start: fmt(m), resourceId: rId })}
                  />
                ))}
                {columnBlocks(effective === "week" ? c.day : undefined, rId)}
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-1 flex items-center gap-1 text-[10px] text-things-gray-3">
        <CalendarDays className="size-3" aria-hidden="true" />
        {t("clinic.sched.hint")}
      </p>
    </div>
  )
}

function shortName(n: { title?: string; given: string; family: string }) {
  return `${n.given} ${n.family}`
}
