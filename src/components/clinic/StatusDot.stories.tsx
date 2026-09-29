import type { Meta, StoryObj } from "@storybook/react-vite"
import { StatusDot, StatusLegend } from "./StatusDot"
import { AtDensity } from "./story-utils"
import type { VisitStatus } from "./types"

const meta: Meta<typeof StatusDot> = {
  title: "Medical/Medical UI/Status Dot",
  tags: ["autodocs"],
  component: StatusDot,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The semantic dot for visit and processing states \u2014 arrived, accepted, in-room, done \u2014 each with its flow tone and an optional short label. Flow, not severity: gold means \"waiting\", not \"warning\".\n\n**Watch out:** these dots answer *where is the patient in the flow*, never *how sick*. For sick, see TriageDot. The legend variant doubles as a filter with counts.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { tone: "arrived" },
  argTypes: {
    tone: { control: "radio", options: ["arrived", "accepted", "in-room", "done", "held", "cancelled", "pending", "info"] },
    label: { control: "text", description: "Leave empty for the locale default; pass \" \" to hide" },
  },
  render: (args: any) => {
    const { tone = "arrived", label } = args
    return <StatusDot tone={tone} label={label} />
  },
}
export default meta

export const Playground: StoryObj<typeof StatusDot> = {}

export const AllStates: StoryObj<typeof StatusDot> = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["arrived", "accepted", "in-room", "done", "held", "cancelled", "pending", "info"] as VisitStatus[]).map((t) => (
        <StatusDot key={t} tone={t} />
      ))}
    </div>
  ),
}

export const LegendAsFilter: StoryObj<typeof StatusLegend> = {
  render: () => (
    <StatusLegend
      items={[
        { tone: "arrived", label: "มา" },
        { tone: "accepted", label: "รับ" },
        { tone: "held", label: "อั้น" },
      ]}
      counts={{ arrived: 12, accepted: 3, held: 1 }}
      value={["arrived", "accepted", "held"]}
      onChange={() => {}}
    />
  ),
}

export const Dense: StoryObj<typeof StatusDot> = {
  render: () => (
    <AtDensity density="dense">
      <StatusDot tone="arrived" />
    </AtDensity>
  ),
}
