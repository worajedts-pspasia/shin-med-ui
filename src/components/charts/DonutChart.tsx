import { Cell, Pie, PieChart as RPieChart } from "recharts"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { buildConfig, type ChartSeries } from "./types"

export interface DonutSlice extends ChartSeries {
  value: number
}

/** Donut block: parts of a whole with an optional center stat — the
 *  number in the hole answers "what is the total" so the ring can stay
 *  busy answering "what are the parts". */
export function DonutChart({
  slices,
  centerLabel,
  centerValue,
  showLegend = false,
  height = "h-64",
  className,
  ...rest
}: {
  slices: DonutSlice[]
  /** Quiet label under the center value (e.g. "total deals"). */
  centerLabel?: string
  centerValue?: string
  showLegend?: boolean
  height?: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const config = buildConfig(slices)
  const data = slices.map((s) => ({ name: s.label, value: s.value, key: s.key }))

  return (
    <div className={cn("relative", className)} {...rest}>
      <ChartContainer config={config} className={cn(height, "mx-auto aspect-square w-full")}>
        <RPieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
          {showLegend && <ChartLegend content={<ChartLegendContent nameKey="name" />} />}
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" paddingAngle={2}>
            {slices.map((s) => (
              <Cell key={s.key} fill={`var(--color-${s.key})`} />
            ))}
          </Pie>
        </RPieChart>
      </ChartContainer>
      {(centerValue || centerLabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          {centerValue && (
            <span className="clinic-num text-2xl font-semibold text-things-ink-strong">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-[11px] text-things-gray-2">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
