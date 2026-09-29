import { CartesianGrid, Line, LineChart as RLineChart, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { buildConfig, type ChartDatum, type ChartSeries } from "./types"

/** Multi-series line block — the flat sibling of the clinic TrendChart
 *  (which owns reference bands and annotations). A series can carry
 *  `dash` for projection segments: actual solid, forecast dashed. */
export function LineChart({
  data,
  series,
  xKey,
  showGrid = true,
  showDots = false,
  showLegend = false,
  height = "h-64",
  className,
  ...rest
}: {
  data: ChartDatum[]
  series: ChartSeries[]
  xKey: string
  showGrid?: boolean
  showDots?: boolean
  showLegend?: boolean
  height?: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const config = buildConfig(series)

  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)} {...rest}>
      <RLineChart data={data}>
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        {series.map((s) => (
          <Line
            key={s.key}
            dataKey={s.key}
            type="monotone"
            stroke={`var(--color-${s.key})`}
            strokeWidth={2}
            strokeDasharray={s.dash}
            dot={showDots ? { r: 3, strokeWidth: 1.5 } : false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RLineChart>
    </ChartContainer>
  )
}
