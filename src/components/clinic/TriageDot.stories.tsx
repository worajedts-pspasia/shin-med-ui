import type { Meta, StoryObj } from "@storybook/react-vite"
import { TriageDot, TriageLegend } from "./TriageDot"
import { AtDensity, ForcedLocale, Monochrome } from "./story-utils"
import type { Urgency } from "./types"

const meta: Meta<typeof TriageDot> = {
  title: "Medical/Medical UI/Triage Dot",
  tags: ["autodocs"],
  component: TriageDot,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Clinical urgency with a shape channel: routine is a circle, rush a square, urgent a triangle *and* red. The shape means the scale still works in grayscale, on a bad monitor, at 2 a.m.\n\n**Watch out:** urgency is a clinical judgment (routine/rush/urgent) \u2014 do not borrow it for queue position or wait time; that is StatusDot's job.",
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
  parameters: { docs: { description: { story: "Grayscale — the shape channel (hollow / half / filled) still reads." } } },
  render: () => (
    <Monochrome>
      <TriageLegend />
    </Monochrome>
  ),
}

export const Thai: StoryObj<typeof TriageDot> = {
  parameters: { docs: { description: { story: "ปกติ · รีบ · ด่วน — the adjudicated queue legend reading (00-corrections §1)." } } },
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
