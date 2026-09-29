import { useId } from "react"
import { Area, AreaChart as RAreaChart } from "recharts"
import { cn } from "@/lib/utils"
import { ChartContainer } from "@/components/ui/chart"

/** Sparkline block: a bare trend with no axes, grid, or tooltip — the
 *  shape is the whole message. Belongs inside a Metric Tile or table
 *  cell, never alone on a surface. */
export function Sparkline({
  points,
  color = "var(--color-things-blue)",
  filled = true,
  height = "h-10",
  className,
  ...rest
}: {
  points: number[]
  color?: string
  filled?: boolean
  height?: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const uid = useId().replace(/:/g, "")
  const config = { trend: { label: "Trend", color } }
  const data = points.map((v, i) => ({ i, trend: v }))

  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)} {...rest}>
      <RAreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`${uid}-spark`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-trend)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-trend)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          dataKey="trend"
          type="monotone"
          stroke="var(--color-trend)"
          strokeWidth={1.5}
          fill={filled ? `url(#${uid}-spark)` : "transparent"}
          isAnimationActive={false}
        />
      </RAreaChart>
    </ChartContainer>
  )
}
