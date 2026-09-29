import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { MetricTile } from "./MetricTile"
import { toneText } from "./tokens"
import type { Tone } from "./types"

// KpiScorecard — solar Site Scorecard in clinic tokens (04, Layer 8): two or
// three MetricTiles up top, cumulative label→value rows with semantic tones
// below. Tones ride toneText so grayscale still reads via position + count.

export function KpiScorecard({
  title,
  metrics,
  rows,
  className,
}: {
  title?: string
  metrics: Array<React.ComponentProps<typeof MetricTile>>
  rows: { label: string; value: string; tone?: Tone }[]
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <section
      data-slot="kpi-scorecard"
      aria-label={title ?? t("clinic.ops.scorecard")}
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <MetricTile key={m.label} {...m} />
        ))}
      </div>
      <dl className="divide-y divide-things-hairline border-t border-things-hairline">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 px-3 py-2">
            <dt className="text-sm text-things-gray-2">{r.label}</dt>
            <dd
              className={cn(
                "clinic-num text-sm font-medium",
                toneText[r.tone ?? "none"],
              )}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
