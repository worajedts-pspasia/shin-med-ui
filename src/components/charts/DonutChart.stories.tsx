import type { Meta, StoryObj } from "@storybook/react-vite"
import { DonutChart } from "./DonutChart"
import { WON_BY_SOURCE, WON_BY_SOURCE_TH } from "./story-data"
import { ForcedLocale } from "../clinic/story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof DonutChart> = {
  title: "Charts/Donut Chart",
  tags: ["autodocs"],
  component: DonutChart,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("DonutChart") } },
  },
  args: {
    slices: WON_BY_SOURCE,
    centerValue: "89",
    centerLabel: "deals won",
  },
  argTypes: {
    showLegend: { control: "boolean" },
    centerValue: { control: "text" },
    centerLabel: { control: "text" },
  },
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <DonutChart slices={WON_BY_SOURCE} centerValue="89" centerLabel="deals won" />
  ),
}

export const WithLegend: StoryObj<typeof meta> = {
  render: () => (
    <DonutChart
      slices={WON_BY_SOURCE}
      centerValue="89"
      centerLabel="deals won"
      showLegend
    />
  ),
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <DonutChart
        slices={WON_BY_SOURCE_TH}
        centerValue="89"
        centerLabel="ดีลที่ชนะ"
        showLegend
      />
    </ForcedLocale>
  ),
}
