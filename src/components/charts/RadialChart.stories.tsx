import type { Meta, StoryObj } from "@storybook/react-vite"
import { RadialChart } from "./RadialChart"
import { ForcedLocale } from "../clinic/story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof RadialChart> = {
  title: "Charts/Radial Chart",
  tags: ["autodocs"],
  component: RadialChart,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("RadialChart") } },
  },
  args: { value: 68, label: "Quarterly quota" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    label: { control: "text" },
    color: {
      control: "radio",
      options: ["blue", "green", "amber", "red"],
      mapping: {
        blue: "var(--color-things-blue)",
        green: "var(--color-clinic-ok)",
        amber: "var(--color-things-gold-dark)",
        red: "var(--color-clinic-critical)",
      },
    },
  },
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Default: StoryObj<typeof meta> = {
  render: () => <RadialChart value={68} label="Quarterly quota" />,
}

export const Tones: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      description: {
        story:
          "The bar is judgment, not decoration — green at goal, amber behind, red only when the number itself is the alarm.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <RadialChart value={92} label="At goal" color="var(--color-clinic-ok)" height="h-44" />
      <RadialChart value={54} label="Behind" color="var(--color-things-gold-dark)" height="h-44" />
      <RadialChart value={18} label="At risk" color="var(--color-clinic-critical)" height="h-44" />
    </div>
  ),
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <RadialChart value={68} label="โควตาไตรมาส" />
    </ForcedLocale>
  ),
}
