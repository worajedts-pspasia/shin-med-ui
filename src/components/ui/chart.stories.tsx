import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bar, BarChart, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const meta: Meta = {
  title: "UI/Display/Chart",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { bars: 6, colorKey: "chart-1", max: 24 },
  argTypes: {
    bars: { control: { type: "range", min: 3, max: 12, step: 1 } },
    colorKey: { control: "radio", options: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
    max: { control: { type: "range", min: 10, max: 40, step: 2 } },
  },
  render: (args: { bars?: number; colorKey?: string; max?: number }) => {
    const { bars = 6, colorKey = "chart-1", max = 24 } = args
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const data = months.slice(0, bars).map((month, i) => ({ month, tasks: Math.round(((i * 7 + 5) % max) + 2) }))
    const config = { tasks: { label: "Completed", color: `var(--${colorKey})` } } satisfies ChartConfig
    return (
      <ChartContainer config={config} className="h-48 w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="tasks" fill={`var(--color-tasks)`} radius={4} />
        </BarChart>
      </ChartContainer>
    )
  },
}

const data = [
  { month: "Jan", tasks: 12 },
  { month: "Feb", tasks: 18 },
  { month: "Mar", tasks: 15 },
  { month: "Apr", tasks: 22 },
]
const config = { tasks: { label: "Completed", color: "var(--chart-1)" } } satisfies ChartConfig

export const Completions: StoryObj = {
  render: () => (
    <ChartContainer config={config} className="h-48 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
}
