import type { Meta, StoryObj } from "@storybook/react-vite"
import { BarChart } from "./BarChart"
import { MONTHLY, MONTHLY_TH, STAGES, STAGES_TH } from "./story-data"
import { ForcedLocale } from "../clinic/story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof BarChart> = {
  title: "Charts/Bar Chart",
  tags: ["autodocs"],
  component: BarChart,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("BarChart") } },
  },
  args: { data: STAGES, xKey: "stage", series: [{ key: "count", label: "Deals" }] },
  argTypes: {
    stacked: { control: "boolean" },
    horizontal: { control: "boolean" },
    showLegend: { control: "boolean" },
  },
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Default: StoryObj<typeof meta> = {
  render: () => <BarChart data={STAGES} xKey="stage" series={[{ key: "count", label: "Deals" }]} />,
}

export const Stacked: StoryObj<typeof meta> = {
  render: () => (
    <BarChart
      data={MONTHLY}
      xKey="month"
      stacked
      showLegend
      series={[
        { key: "won", label: "Won" },
        { key: "lost", label: "Lost" },
      ]}
    />
  ),
}

export const Horizontal: StoryObj<typeof meta> = {
  parameters: { docs: { description: { story: "Funnel-shaped stages read best sideways." } } },
  render: () => (
    <BarChart
      data={STAGES}
      xKey="stage"
      horizontal
      height="h-56"
      series={[{ key: "count", label: "Deals" }]}
    />
  ),
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <BarChart
        data={STAGES_TH}
        xKey="stage"
        horizontal
        height="h-56"
        series={[{ key: "count", label: "ดีล" }]}
      />
    </ForcedLocale>
  ),
}
