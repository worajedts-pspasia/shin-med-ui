import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { toneText } from "./tokens"
import type { Tone } from "./types"

// MetricTile — one number, large (04, Layer 5; "120/80 — April 24, 2014").
// The source's deep-blue gradient becomes a flat card. Ships in a grid that
// goes 4→2→1 (the grid lives with the caller). Footnotes carry the
// scorecard's cumulative rows with semantic tones.

function Sparkline({ points, className }: { points: number[]; className?: string }) {
  if (points.length < 2) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const w = 56
  const h = 16
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - 2 - ((p - min) / span) * (h - 4)}`)
    .join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-4 w-14", className)} aria-hidden="true">
      <polyline points={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MetricTile({
  label,
  value,
  unit,
  at,
  tone = "none",
  sparkline,
  footnote,
  onSelect,
  className,
}: {
  label: string
  value: string
  unit?: string
  at?: string
  tone?: Tone
  sparkline?: number[]
  footnote?: Array<{ label: string; value: string; tone?: Tone }>
  onSelect?: () => void
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <Card
      data-slot="metric-tile"
      data-tone={tone}
      onClick={onSelect}
      className={cn(
        "gap-0 rounded-md border-things-hairline py-3 shadow-none",
        onSelect && "cursor-pointer transition-colors hover:bg-things-hover",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2 px-3">
        <span className="text-xs font-medium uppercase tracking-wide text-things-gray-3">{label}</span>
        {sparkline && <Sparkline points={sparkline} className="text-things-gray-3" />}
      </div>
      <p className="mt-1 flex items-baseline gap-1.5 px-3">
        <span className={cn("clinic-num text-3xl font-semibold leading-none tracking-tight", toneText[tone])}>{value}</span>
        {unit && <span className="text-xs text-things-gray-3">{unit}</span>}
        {at && <span className="clinic-num ml-auto text-[11px] text-things-gray-3">{at}</span>}
      </p>
      {footnote && footnote.length > 0 && (
        <dl className="mt-2 space-y-0.5 border-t border-things-hairline px-3 pt-1.5">
          {footnote.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-2 text-[11px]">
              <dt className="truncate text-things-gray-3">{f.label}</dt>
              <dd className={cn("clinic-num", f.tone ? toneText[f.tone] : "text-things-gray-2")}>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {onSelect && <span className="sr-only">{t("clinic.common.select")}</span>}
    </Card>
  )
}
