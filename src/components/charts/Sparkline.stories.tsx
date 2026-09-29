import type { Meta, StoryObj } from "@storybook/react-vite"
import { Sparkline } from "./Sparkline"
import { SPARK } from "./story-data"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof Sparkline> = {
  title: "Charts/Sparkline",
  tags: ["autodocs"],
  component: Sparkline,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("Sparkline") } },
  },
  args: { points: SPARK },
  argTypes: {
    filled: { control: "boolean" },
    color: {
      control: "radio",
      options: ["blue", "green", "amber", "purple"],
      mapping: {
        blue: "var(--color-things-blue)",
        green: "var(--color-clinic-ok)",
        amber: "var(--color-things-gold-dark)",
        purple: "var(--color-things-purple)",
      },
    },
  },
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Default: StoryObj<typeof meta> = {
  render: () => <Sparkline points={SPARK} />,
}

export const Bare: StoryObj<typeof meta> = {
  parameters: { docs: { description: { story: "Unfilled — stroke only, for the tightest rows." } } },
  render: () => <Sparkline points={SPARK} filled={false} />,
}

export const InTile: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      description: {
        story:
          "The sparkline's natural habitat: inside a Metric Tile, where the number answers and the shape explains.",
      },
    },
  },
  render: () => (
    <div className="w-56 rounded-lg border border-things-border bg-white p-4">
      <div className="text-[11px] text-things-gray-2">Deals won · last 12 months</div>
      <div className="clinic-num text-2xl font-semibold text-things-ink-strong">27</div>
      <Sparkline points={SPARK} className="mt-2" />
    </div>
  ),
}
