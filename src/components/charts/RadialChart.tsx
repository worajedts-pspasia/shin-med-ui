import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { cn } from "@/lib/utils"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

/** Radial gauge block: one number against its ceiling — quota, goal,
 *  completion. The track reads as the remaining distance; the bar takes
 *  the accent. Answers exactly one question (the MetricTile rule). */
export function RadialChart({
  /** 0–100. Values outside the domain clamp visually via the axis. */
  value,
  label,
  color = "var(--color-things-blue)",
  trackColor = "var(--color-things-select)",
  height = "h-56",
  className,
  ...rest
}: {
  value: number
  label?: string
  color?: string
  trackColor?: string
  height?: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const data = [{ name: label ?? "value", value }]
  const config = { value: { label: label ?? "Value", color } }

  return (
    <div className={cn("relative", className)} {...rest}>
      <ChartContainer config={config} className={cn(height, "mx-auto aspect-square w-full")}>
        <RadialBarChart data={data} innerRadius="72%" startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <RadialBar
            dataKey="value"
            background={{ fill: trackColor }}
            cornerRadius={12}
            fill={`var(--color-value)`}
          />
        </RadialBarChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="clinic-num text-2xl font-semibold text-things-ink-strong">
          {Math.round(value)}%
        </span>
        {label && <span className="text-[11px] text-things-gray-2">{label}</span>}
      </div>
    </div>
  )
}
