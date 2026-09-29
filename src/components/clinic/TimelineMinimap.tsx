import { useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// TimelineMinimap — density histogram as a time brush (04, Layer 5; PSP).
// Over a decade of records the minimap finds the cluster worth looking at.
// Desktop-only: hidden below lg; small screens use a date-range select.
// Drag either edge of the window (or click a bar to center the window there).

const DAY_MS = 86400_000

export function TimelineMinimap({
  buckets,
  window: [from, to],
  onWindowChange,
  className,
}: {
  buckets: Array<{ at: string; count: number }>
  window: [string, string]
  onWindowChange?(w: [string, string]): void
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<null | "from" | "to">(null)

  const { min, max, maxCount } = useMemo(() => {
    const times = buckets.map((b) => Date.parse(b.at))
    return {
      min: Math.min(...times),
      max: Math.max(...times) + DAY_MS,
      maxCount: Math.max(...buckets.map((b) => b.count), 1),
    }
  }, [buckets])

  const span = Math.max(1, max - min)
  const pct = (iso: string) => ((Date.parse(iso) - min) / span) * 100

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { month: "short", year: "2-digit", timeZone: "UTC" }).format(new Date(iso))

  const commit = (clientX: number) => {
    const track = trackRef.current
    if (!track || !dragging.current || !onWindowChange) return
    const r = track.getBoundingClientRect()
    const clamped = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    const iso = new Date(min + clamped * span).toISOString().slice(0, 10)
    onWindowChange(dragging.current === "from" ? [iso, to] : [from, iso])
  }

  return (
    <div
      data-slot="timeline-minimap"
      className={cn("hidden flex-col gap-1 lg:flex", className)}
      aria-label={t("clinic.minimap.label")}
      onPointerMove={(e) => dragging.current && commit(e.clientX)}
      onPointerUp={() => (dragging.current = null)}
      onPointerLeave={() => (dragging.current = null)}
    >
      <div ref={trackRef} className="relative flex h-10 items-end gap-px overflow-hidden rounded-sm border border-things-hairline bg-card px-px pb-px">
        {buckets.map((b) => (
          <button
            key={b.at}
            type="button"
            title={`${fmt(b.at)} — ${b.count}`}
            className="flex-1 rounded-t-[1px] bg-things-teal/60 transition-colors hover:bg-things-teal"
            style={{ height: `${Math.max(6, (b.count / maxCount) * 100)}%` }}
            aria-label={`${fmt(b.at)}: ${b.count}`}
            onClick={() => {
              if (!onWindowChange) return
              const at = Date.parse(b.at)
              const half = span / 12
              onWindowChange([
                new Date(Math.max(min, at - half)).toISOString().slice(0, 10),
                new Date(Math.min(max, at + half)).toISOString().slice(0, 10),
              ])
            }}
          />
        ))}
        {/* window band + drag edges */}
        <span
          className="pointer-events-none absolute inset-y-0 border-x-2 border-things-blue bg-things-blue/10"
          style={{ left: `${pct(from)}%`, width: `${Math.max(2, pct(to) - pct(from))}%` }}
          aria-hidden="true"
        />
        <span
          role="slider"
          aria-label={t("clinic.minimap.from")}
          aria-valuenow={Math.round(pct(from))}
          tabIndex={0}
          onKeyDown={(e) => e.key === "ArrowLeft" && onWindowChange?.([new Date(Math.max(min, Date.parse(from) - span / 24)).toISOString().slice(0, 10), to])}
          onPointerDown={() => (dragging.current = "from")}
          className="absolute inset-y-0 z-10 w-2 -translate-x-1/2 cursor-col-resize rounded bg-things-blue/70 hover:bg-things-blue"
          style={{ left: `${pct(from)}%` }}
        />
        <span
          role="slider"
          aria-label={t("clinic.minimap.to")}
          aria-valuenow={Math.round(pct(to))}
          tabIndex={0}
          onKeyDown={(e) => e.key === "ArrowRight" && onWindowChange?.([from, new Date(Math.min(max, Date.parse(to) + span / 24)).toISOString().slice(0, 10)])}
          onPointerDown={() => (dragging.current = "to")}
          className="absolute inset-y-0 z-10 w-2 translate-x-1/2 cursor-col-resize rounded bg-things-blue/70 hover:bg-things-blue"
          style={{ left: `${pct(to)}%` }}
        />
      </div>
      <p className="clinic-num flex justify-between text-[10px] text-things-gray-3">
        <span>{fmt(from)}</span>
        <span>{t("clinic.minimap.window", { from: fmt(from), to: fmt(to) })}</span>
        <span>{fmt(to)}</span>
      </p>
    </div>
  )
}
