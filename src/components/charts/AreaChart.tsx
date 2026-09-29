import { useId } from "react"
import { Area, AreaChart as RAreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { buildConfig, type ChartDatum, type ChartSeries } from "./types"

/** Area chart block: one or more series over a shared x-axis, optional
 *  per-series gradient fill and stacking. Colors come from the token
 *  palette unless a series overrides them. */
export function AreaChart({
  data,
  series,
  xKey,
  stacked = false,
  gradient = true,
  showGrid = true,
  showAxis = true,
  showLegend = false,
  height = "h-64",
  className,
  ...rest
}: {
  data: ChartDatum[]
  series: ChartSeries[]
  xKey: string
  stacked?: boolean
  gradient?: boolean
  showGrid?: boolean
  showAxis?: boolean
  showLegend?: boolean
  height?: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const uid = useId().replace(/:/g, "")
  const config = buildConfig(series)

  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)} {...rest}>
      <RAreaChart data={data}>
        {showGrid && <CartesianGrid vertical={false} />}
        {showAxis && (
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        )}
        {showAxis && <YAxis tickLine={false} axisLine={false} width={36} />}
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${uid}-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${s.key})`} stopOpacity={0.28} />
              <stop offset="100%" stopColor={`var(--color-${s.key})`} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            type="monotone"
            stackId={stacked ? "a" : undefined}
            stroke={`var(--color-${s.key})`}
            fill={gradient ? `url(#${uid}-grad-${s.key})` : `var(--color-${s.key})`}
            fillOpacity={gradient ? 1 : 0.12}
          />
        ))}
      </RAreaChart>
    </ChartContainer>
  )
}
