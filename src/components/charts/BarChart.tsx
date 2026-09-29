import { Bar, BarChart as RBarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { buildConfig, type ChartDatum, type ChartSeries } from "./types"

/** Bar chart block: grouped by default, stacked or horizontal on request.
 *  Bars take rounded tops (or the trailing edge when horizontal) so the
 *  value column always reads as a container, not a spike. */
export function BarChart({
  data,
  series,
  xKey,
  stacked = false,
  horizontal = false,
  showGrid = true,
  showLegend = false,
  height = "h-64",
  className,
  ...rest
}: {
  data: ChartDatum[]
  series: ChartSeries[]
  xKey: string
  stacked?: boolean
  horizontal?: boolean
  showGrid?: boolean
  showLegend?: boolean
  height?: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const config = buildConfig(series)

  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)} {...rest}>
      <RBarChart data={data} layout={horizontal ? "vertical" : "horizontal"}>
        {showGrid && <CartesianGrid vertical={horizontal} horizontal={!horizontal} />}
        {horizontal ? (
          <>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey={xKey} tickLine={false} axisLine={false} width={88} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={36} />
          </>
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            stackId={stacked ? "a" : undefined}
            fill={`var(--color-${s.key})`}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          />
        ))}
      </RBarChart>
    </ChartContainer>
  )
}
