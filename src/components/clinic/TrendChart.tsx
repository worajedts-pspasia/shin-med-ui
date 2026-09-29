import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { CartesianGrid, Line, LineChart as RLineChart, ReferenceArea, ReferenceLine, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { toneSoft, toneText } from "./tokens"
import type { Tone } from "./types"

// TrendChart — multi-series clinical time series (04, Layer 5; the
// Vitals-Analysis BP chart). referenceBands is the clinically important
// addition: shading the normal range turns the chart from decorative into
// diagnostic. Series colours are CSS vars from the category map — never a
// literal hex. Below md keep at most two series (caller trims; the legend
// stays compact).

const RANGE_MS: Record<string, number> = {
  "3m": 91 * 86400_000,
  "6m": 183 * 86400_000,
  "1y": 365 * 86400_000,
  "2y": 730 * 86400_000,
}

const BAND_FILL: Record<Tone, string> = {
  none: "var(--color-things-gray-3)",
  ok: "var(--color-clinic-ok)",
  warn: "var(--color-clinic-warn)",
  critical: "var(--color-clinic-critical)",
}

export interface TrendSeries {
  id: string
  label: string
  /** CSS var, e.g. "var(--color-things-blue)". */
  color: string
  points: Array<{ at: string; value: number }>
}

export function TrendChart({
  series,
  range = "all",
  onRangeChange,
  referenceBands,
  annotations,
  unit,
  className,
}: {
  series: TrendSeries[]
  range?: string
  onRangeChange?: (r: string) => void
  referenceBands?: Array<{ from: number; to: number; tone: Tone }>
  annotations?: Array<{ at: string; label: string }>
  unit?: string
  className?: string
}) {
  const { t, i18n } = useTranslation()

  const cutoff = useMemo(() => {
    const span = RANGE_MS[range]
    if (!span) return undefined
    const lastAt = Math.max(...series.flatMap((s) => s.points.map((p) => Date.parse(p.at))))
    return lastAt - span
  }, [range, series])

  const trimmed = useMemo(
    () =>
      series.map((s) => ({
        ...s,
        points: cutoff === undefined ? s.points : s.points.filter((p) => Date.parse(p.at) >= cutoff),
      })),
    [series, cutoff],
  )

  // one row per date, one column per series — the shape recharts wants
  const data = useMemo(() => {
    const byAt = new Map<string, Record<string, number | string>>()
    for (const s of trimmed) {
      for (const p of s.points) {
        const row = byAt.get(p.at) ?? { at: p.at }
        row[s.id] = p.value
        byAt.set(p.at, row)
      }
    }
    return [...byAt.values()].sort((a, b) => String(a.at).localeCompare(String(b.at)))
  }, [trimmed])

  const config = useMemo(() => {
    const c: ChartConfig = {}
    for (const s of trimmed) c[s.id] = { label: s.label, color: s.color }
    return c
  }, [trimmed])

  const allValues = trimmed.flatMap((s) => s.points.map((p) => p.value))
  const bandValues = referenceBands?.flatMap((b) => [b.from, b.to]) ?? []
  const yMin = Math.min(...allValues, ...bandValues)
  const yMax = Math.max(...allValues, ...bandValues)
  const pad = (yMax - yMin) * 0.1 || 1

  const dateFmt = (v: string) =>
    new Intl.DateTimeFormat(i18n.language, { month: "short", year: "2-digit", timeZone: "UTC" }).format(new Date(v))

  return (
    <div data-slot="trend-chart" data-range={range} className={cn("flex flex-col gap-2", className)}>
      <ChartContainer config={config} className="h-56 w-full">
        <RLineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-clinic-grid-line)" />
          <XAxis
            dataKey="at"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={dateFmt}
            tick={{ fontSize: 11, fill: "var(--color-things-gray-3)" }}
          />
          <YAxis
            domain={[Math.floor(yMin - pad), Math.ceil(yMax + pad)]}
            tickLine={false}
            axisLine={false}
            width={34}
            tick={{ fontSize: 11, fill: "var(--color-things-gray-3)" }}
          />
          {referenceBands?.map((b, i) => (
            <ReferenceArea
              key={i}
              y1={b.from}
              y2={b.to}
              fill={BAND_FILL[b.tone]}
              fillOpacity={0.08}
              stroke="none"
              ifOverflow="extendDomain"
            />
          ))}
          {annotations?.map((a, i) => (
            <ReferenceLine
              key={`ann-${i}`}
              x={a.at}
              stroke="var(--color-things-gray-2)"
              strokeDasharray="3 3"
              label={{ value: a.label, position: "insideTopLeft", fontSize: 10, fill: "var(--color-things-gray-2)" }}
              ifOverflow="extendDomain"
            />
          ))}
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          {trimmed.map((s) => (
            <Line
              key={s.id}
              dataKey={s.id}
              type="monotone"
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 2.5, fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </RLineChart>
      </ChartContainer>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {trimmed.map((s) => (
          <span key={s.id} className="flex items-center gap-1.5 text-xs text-things-gray-2">
            <span className="inline-block h-0.5 w-4 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
            {s.label}
          </span>
        ))}
        {referenceBands && referenceBands.length > 0 && (
          <span className={cn("ml-auto flex items-center gap-1.5 text-xs", toneText.ok)}>
            <span className={cn("inline-block h-2.5 w-4 rounded-sm border border-dashed", toneSoft.ok, "border-clinic-ok/50")} aria-hidden="true" />
            {t("clinic.trend.reference")}
          </span>
        )}
        {unit && <span className="text-[11px] text-things-gray-3">{unit}</span>}
      </div>
    </div>
  )
}
