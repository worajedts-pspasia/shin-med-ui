import type { Meta, StoryObj } from "@storybook/react-vite"
import { TriageDot, TriageLegend } from "./TriageDot"
import { AtDensity, ForcedLocale, Monochrome } from "./story-utils"
import type { Urgency } from "./types"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof TriageDot> = {
  title: "Medical/Medical UI/Triage Dot",
  tags: ["autodocs"],
  component: TriageDot,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("TriageDot"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { level: "routine", showLabel: true },
  argTypes: {
    level: { control: "radio", options: ["routine", "rush", "urgent"] },
    showLabel: { control: "boolean" },
    size: { control: "radio", options: ["sm", "md"] },
  },
  render: (args: any) => {
    const { level = "routine", showLabel = true, size = "md" } = args
    return <TriageDot level={level} showLabel={showLabel} size={size} />
  },
}
export default meta

export const Playground: StoryObj<typeof TriageDot> = {}

export const AllStates: StoryObj<typeof TriageDot> = {
  render: () => (
    <div className="flex flex-col gap-3">
      <TriageLegend />
      <div className="flex gap-4">
        <TriageDot level="routine" />
        <TriageDot level="rush" />
        <TriageDot level="urgent" />
      </div>
    </div>
  ),
}

export const Grayscale: StoryObj<typeof TriageDot> = {
  name: "Monochrome",
  parameters: { docs: { description: { story: docsDesc("TriageDot::Grayscale") } } },
  render: () => (
    <Monochrome>
      <TriageLegend />
    </Monochrome>
  ),
}

export const Thai: StoryObj<typeof TriageDot> = {
  parameters: { docs: { description: { story: docsDesc("TriageDot::Thai") } } },
  render: () => (
    <ForcedLocale locale="th">
      <TriageLegend />
    </ForcedLocale>
  ),
}

export const Dense: StoryObj<typeof TriageDot> = {
  render: () => (
    <AtDensity density="dense">
      <TriageLegend />
    </AtDensity>
  ),
}
