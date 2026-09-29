import { useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { FileText, FlaskConical, MessageSquare, Pill, ReceiptText, Stethoscope } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { CATEGORY_COLORS } from "./tokens"
import { EventDetailPopover } from "./EventDetailPopover"
import { TimelinePill } from "./TimelinePill"

// EventTimeline — swimlanes × dates, the longitudinal backbone (04, Layer 5).
// Sticky lane labels (120px) + sticky date header; events absolutely
// positioned; same-coordinate events stack into a +N cluster with a HoverCard
// (the source overlaps them and loses information). Three variants: dot
// (WinForms EMR), pill (an open-source EMR), thumbnail (PSP). Click opens EventDetailPopover —
// Popover above sm, bottom Sheet below. Finger-scroll friendly: no separate
// mobile variant, lanes just shrink.

export type LaneId =
  | "medications" | "notes" | "orders" | "labs" | "communications"
  | "documents" | "vitals" | "immunizations" | "problems" | "appointments"

const LANE_ICON: Record<LaneId, LucideIcon> = {
  medications: Pill,
  notes: ReceiptText,
  orders: FileText,
  labs: FlaskConical,
  communications: MessageSquare,
  documents: FileText,
  vitals: Stethoscope,
  immunizations: Pill,
  problems: ReceiptText,
  appointments: FileText,
}

export interface TimelineEventDef {
  id: string
  laneId: LaneId
  at: string
  kind: string
  label?: string
  detail?: Array<{ label: string; value: string }>
  thumbnailUrl?: string
}

export interface EventTimelineProps {
  lanes: Array<{ id: LaneId; label: string }>
  events: TimelineEventDef[]
  columns?: "day" | "week" | "month"
  variant?: "dot" | "pill" | "thumbnail"
  hiddenLanes?: LaneId[]
  todayColumn?: boolean
  /** ISO date used for the today column; defaults to the real clock. */
  today?: string
  pxPerDay?: number
  onSelect?: (eventId: string) => void
  maxHeight?: number | string
  className?: string
}

const DAY_MS = 86400_000
const PAD_DAYS = 3

export function EventTimeline({
  lanes,
  events,
  columns = "week",
  variant = "dot",
  hiddenLanes = [],
  todayColumn = false,
  today,
  pxPerDay = 28,
  onSelect,
  maxHeight = 320,
  className,
}: EventTimelineProps) {
  const { t, i18n } = useTranslation()
  const isMobile = useIsMobile()
  const [openEvent, setOpenEvent] = useState<TimelineEventDef | null>(null)

  const hidden = new Set(hiddenLanes)
  const visibleLanes = lanes.filter((l) => !hidden.has(l.id))
  const visibleEvents = events.filter((e) => !hidden.has(e.laneId))

  const { startMs, totalDays } = useMemo(() => {
    const times = visibleEvents.map((e) => Date.parse(e.at))
    const min = times.length ? Math.min(...times) : Date.now()
    const max = times.length ? Math.max(...times) : Date.now()
    const s = min - PAD_DAYS * DAY_MS
    return { startMs: s, totalDays: Math.ceil((max - s) / DAY_MS) + PAD_DAYS }
  }, [visibleEvents])

  const xOf = (iso: string) => ((Date.parse(iso) - startMs) / DAY_MS) * pxPerDay
  const trackWidth = totalDays * pxPerDay
  const todayMs = Date.parse(today ?? new Date().toISOString())
  const todayX = todayColumn ? ((todayMs - startMs) / DAY_MS) * pxPerDay : null

  const ticks = useMemo(() => {
    const out: Array<{ x: number; label: string }> = []
    const start = new Date(startMs)
    if (columns === "day") {
      for (let d = 0; d <= totalDays; d++) {
        const dt = new Date(startMs + d * DAY_MS)
        out.push({ x: d * pxPerDay, label: String(dt.getUTCDate()) })
      }
    } else if (columns === "week") {
      for (let d = 0; d <= totalDays; d += 7) {
        const dt = new Date(startMs + d * DAY_MS)
        out.push({
          x: d * pxPerDay,
          label: new Intl.DateTimeFormat(i18n.language, { month: "short", day: "2-digit", timeZone: "UTC" }).format(dt),
        })
      }
    } else {
      const dt = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1))
      while (dt.getTime() <= startMs + totalDays * DAY_MS) {
        if (dt.getTime() >= startMs) {
          out.push({
            x: ((dt.getTime() - startMs) / DAY_MS) * pxPerDay,
            label: new Intl.DateTimeFormat(i18n.language, { month: "short", year: "2-digit", timeZone: "UTC" }).format(dt),
          })
        }
        dt.setUTCMonth(dt.getUTCMonth() + 1)
      }
    }
    return out
  }, [columns, startMs, totalDays, pxPerDay, i18n.language])

  // cluster events that land within ~24px on the same lane; pills are much
  // wider than dots and their width varies with the label, so the pill
  // variant chains while the next anchor falls inside the previous pill's
  // estimated footprint — otherwise neighbouring pills overlap
  const estPillWidth = (e: TimelineEventDef) => 26 + ((e.label?.length ?? 6) + 5) * 6.2
  const clustered = useMemo(() => {
    const map = new Map<string, Array<{ laneId: LaneId; events: TimelineEventDef[] }>>()
    for (const lane of visibleLanes) {
      const laneEvents = visibleEvents.filter((e) => e.laneId === lane.id).sort((a, b) => a.at.localeCompare(b.at))
      const groups: TimelineEventDef[][] = []
      for (const e of laneEvents) {
        const last = groups[groups.length - 1]
        const gap = variant === "pill" && last ? estPillWidth(last[last.length - 1]) : 24
        if (last && xOf(e.at) - xOf(last[last.length - 1].at) < gap) last.push(e)
        else groups.push([e])
      }
      for (const g of groups) {
        const key = `${lane.id}:${g[0].id}`
        map.set(key, [{ laneId: lane.id, events: g }])
      }
    }
    return map
  }, [visibleLanes, visibleEvents, variant])

  const openDetail = (e: TimelineEventDef) => {
    if (e.detail) setOpenEvent(e)
    onSelect?.(e.id)
  }

  const laneLabelById = new Map(lanes.map((l) => [l.id, l.label]))

  return (
    <div
      data-slot="event-timeline"
      data-variant={variant}
      className={cn("overflow-auto rounded-md border border-things-hairline bg-card", className)}
      style={{ maxHeight }}
    >
      <div style={{ width: 120 + trackWidth }} className="min-w-full">
        {/* date header */}
        <div className="sticky top-0 z-30 flex border-b border-clinic-grid-line bg-clinic-grid-header">
          <div className="sticky left-0 z-40 w-[120px] shrink-0 bg-clinic-grid-header px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-things-gray-3">
            {t("clinic.timeline.when")}
          </div>
          <div className="relative h-6 flex-1">
            {todayX !== null && todayX >= 0 && todayX <= trackWidth && (
              <span
                className="absolute inset-y-0 w-px"
                style={{ left: todayX, backgroundColor: "var(--color-things-gold)" }}
                aria-hidden="true"
              />
            )}
            {ticks.map((tk, i) => (
              <span
                key={i}
                className="clinic-num absolute top-1 -translate-x-1/2 whitespace-nowrap text-[10px] text-things-gray-3"
                style={{ left: tk.x }}
              >
                {tk.label}
              </span>
            ))}
          </div>
        </div>

        {/* lanes */}
        {visibleLanes.map((lane) => {
          const color = CATEGORY_COLORS[lane.id]?.var ?? "var(--color-things-gray-2)"
          const LaneIcon = LANE_ICON[lane.id]
          return (
            <div key={lane.id} className="flex border-b border-clinic-grid-line last:border-b-0">
              <div className="sticky left-0 z-20 flex w-[120px] shrink-0 items-center gap-1.5 bg-card px-2">
                <LaneIcon className="size-3.5 shrink-0 text-things-gray-3" aria-hidden="true" />
                <span className="truncate text-xs font-medium text-things-gray-2">{lane.label}</span>
              </div>
              <div className="relative h-8 flex-1 sm:h-9">
                {todayX !== null && todayX >= 0 && todayX <= trackWidth && (
                  <span
                    className="absolute inset-y-0 w-px"
                    style={{ left: todayX, backgroundColor: "var(--color-things-gold)" }}
                    aria-hidden="true"
                  />
                )}
                {[...clustered.entries()]
                  .filter(([key]) => key.startsWith(`${lane.id}:`))
                  .map(([, [{ events: group }]]) => {
                    const x = xOf(group[0].at)
                    if (group.length > 1) {
                      return (
                        <HoverCard key={group[0].id} openDelay={100}>
                          <HoverCardTrigger asChild>
                            <button
                              type="button"
                              className="absolute top-1/2 flex h-5 -translate-y-1/2 items-center gap-0.5 rounded-full border border-things-hairline bg-things-chip px-1.5 text-[10px] text-things-gray-2 hover:bg-things-hover"
                              style={{ left: x - 14 }}
                              aria-label={t("clinic.timeline.cluster", { count: group.length })}
                            >
                              <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                              +{group.length - 1}
                            </button>
                          </HoverCardTrigger>
                          <HoverCardContent side="top" className="w-52 p-2">
                            <ul className="flex flex-col gap-1">
                              {group.map((e) => (
                                <li key={e.id} className="clinic-num truncate text-xs text-things-gray-2">
                                  {e.label ?? e.kind}
                                </li>
                              ))}
                            </ul>
                          </HoverCardContent>
                        </HoverCard>
                      )
                    }
                    const e = group[0]
                    if (variant === "pill" && e.label) {
                      return (
                        <Popover key={e.id} open={openEvent?.id === e.id} onOpenChange={(o) => setOpenEvent(o ? e : null)}>
                          <PopoverTrigger asChild>
                            <div className="absolute top-1/2 w-fit -translate-y-1/2" style={{ left: x }}>
                              <TimelinePill label={e.label} color={color} time={e.at.slice(11, 16)} />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent side="top" className="w-64 p-3">
                            <EventDetailPopover title={e.label ?? e.kind} at={e.at} laneLabel={laneLabelById.get(e.laneId)} laneIcon={LaneIcon} detail={e.detail} />
                          </PopoverContent>
                        </Popover>
                      )
                    }
                    if (variant === "thumbnail" && e.thumbnailUrl) {
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => openDetail(e)}
                          className="absolute top-1/2 size-6 -translate-y-1/2 overflow-hidden rounded-sm border border-things-hairline"
                          style={{ left: x - 12 }}
                          aria-label={e.label ?? e.kind}
                        >
                          <img src={e.thumbnailUrl} alt="" className="size-full object-cover" />
                        </button>
                      )
                    }
                    return (
                      <Popover key={e.id} open={openEvent?.id === e.id} onOpenChange={(o) => setOpenEvent(o ? e : null)}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            onClick={() => openDetail(e)}
                            className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full ring-2 ring-card transition-transform hover:scale-125"
                            style={{ left: x - 6, backgroundColor: color }}
                            aria-label={`${e.label ?? e.kind} — ${e.at.slice(0, 10)}`}
                          />
                        </PopoverTrigger>
                        <PopoverContent side="top" className="w-64 p-3">
                          <EventDetailPopover title={e.label ?? e.kind} at={e.at} laneLabel={laneLabelById.get(e.laneId)} laneIcon={LaneIcon} detail={e.detail} />
                        </PopoverContent>
                      </Popover>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Breakpoint-swap: the same detail as a bottom Sheet on phones */}
      <Sheet open={isMobile && openEvent !== null} onOpenChange={(o) => !o && setOpenEvent(null)}>
        <SheetContent side="bottom" className="max-h-[70vh] overflow-auto p-4">
          <SheetHeader className="p-0">
            <SheetTitle>{openEvent?.label ?? openEvent?.kind}</SheetTitle>
          </SheetHeader>
          {openEvent && (
            <EventDetailPopover
              title={openEvent.label ?? openEvent.kind}
              at={openEvent.at}
              laneLabel={laneLabelById.get(openEvent.laneId)}
              laneIcon={LANE_ICON[openEvent.laneId]}
              detail={openEvent.detail}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
