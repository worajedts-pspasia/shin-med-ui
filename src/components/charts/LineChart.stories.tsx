import type { Meta, StoryObj } from "@storybook/react-vite"
import { LineChart } from "./LineChart"
import { MONTHLY, REVENUE } from "./story-data"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof LineChart> = {
  title: "Charts/Line Chart",
  tags: ["autodocs"],
  component: LineChart,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("LineChart") } },
  },
  args: {
    data: MONTHLY,
    xKey: "month",
    showLegend: true,
    series: [
      { key: "won", label: "Won" },
      { key: "lost", label: "Lost" },
    ],
  },
  argTypes: {
    showDots: { control: "boolean" },
    showLegend: { control: "boolean" },
  },
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <LineChart
      data={MONTHLY}
      xKey="month"
      showLegend
      series={[
        { key: "won", label: "Won" },
        { key: "lost", label: "Lost" },
      ]}
    />
  ),
}

export const Forecast: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      description: {
        story:
          "Actual solid, projection dashed — the null gap in `actual` ends the solid line and the dashed series carries the tail.",
      },
    },
  },
  render: () => (
    <LineChart
      data={REVENUE}
      xKey="month"
      showLegend
      series={[
        { key: "actual", label: "Actual" },
        { key: "forecast", label: "Forecast", dash: "5 4" },
      ]}
    />
  ),
}

export const Dots: StoryObj<typeof meta> = {
  render: () => (
    <LineChart
      data={MONTHLY.slice(0, 8)}
      xKey="month"
      showDots
      series={[{ key: "won", label: "Won" }]}
    />
  ),
}
