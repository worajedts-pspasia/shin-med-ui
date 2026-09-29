import type { Meta, StoryObj } from "@storybook/react-vite"
import { AreaChart } from "./AreaChart"
import { MONTHLY, MONTHLY_TH } from "./story-data"
import { ForcedLocale } from "../clinic/story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof AreaChart> = {
  title: "Charts/Area Chart",
  tags: ["autodocs"],
  component: AreaChart,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("AreaChart") } },
  },
  args: {
    data: MONTHLY,
    xKey: "month",
    series: [
      { key: "won", label: "Won" },
      { key: "open", label: "Open" },
    ],
  },
  argTypes: {
    stacked: { control: "boolean" },
    gradient: { control: "boolean" },
    showLegend: { control: "boolean" },
    showAxis: { control: "boolean" },
  },
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Default: StoryObj<typeof meta> = {
  render: () => <AreaChart data={MONTHLY} xKey="month" series={[{ key: "won", label: "Won" }]} />,
}

export const MultiSeries: StoryObj<typeof meta> = {
  render: () => (
    <AreaChart
      data={MONTHLY}
      xKey="month"
      showLegend
      series={[
        { key: "won", label: "Won" },
        { key: "lost", label: "Lost" },
        { key: "open", label: "Open" },
      ]}
    />
  ),
}

export const Stacked: StoryObj<typeof meta> = {
  render: () => (
    <AreaChart
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

export const Flat: StoryObj<typeof meta> = {
  parameters: { docs: { description: { story: "Gradient off — quiet tint fill instead." } } },
  render: () => (
    <AreaChart
      data={MONTHLY}
      xKey="month"
      gradient={false}
      series={[{ key: "won", label: "Won" }]}
    />
  ),
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <AreaChart
        data={MONTHLY_TH}
        xKey="month"
        showLegend
        series={[
          { key: "won", label: "ชนะ" },
          { key: "lost", label: "แพ้" },
        ]}
      />
    </ForcedLocale>
  ),
}
