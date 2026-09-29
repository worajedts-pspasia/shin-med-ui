import type { Meta, StoryObj } from "@storybook/react-vite"
import { VitalsList } from "./VitalsList"
import { AtDensity } from "./story-utils"

const meta: Meta<typeof VitalsList> = {
  title: "Medical/Medical Component/Vitals List",
  tags: ["autodocs"],
  component: VitalsList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The vitals a nurse reads off in order \u2014 label, value with unit, most-recent timestamp \u2014 stacked and calm. It's the display side; editing lives in VitalsStrip.\n\n**Watch out:** \"most recent\" must actually be the most recent. A stale timestamp next to a fresh value is a chart error wearing a UI costume.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const ITEMS = [
  { id: "bp", label: "Blood pressure", value: "140/95", unit: "mmHg", at: "Sep 10, 09:45", trend: "up" as const },
  { id: "wt", label: "Weight", value: "82.0", unit: "kg", at: "Sep 10, 07:52", trend: "down" as const },
  { id: "bmi", label: "BMI", value: "26.8", at: "Sep 10", trend: "down" as const },
  { id: "spo2", label: "SpO₂", unit: "%", at: "Sep 10" },
  { id: "pulse", label: "Pulse", value: "76", unit: "/min", at: "Sep 10, 07:52", trend: "flat" as const },
]

export const Playground: Story = {
  argTypes: { clickable: { control: "boolean" } } as unknown as Meta<typeof VitalsList>["argTypes"],
  args: { clickable: true } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-sm rounded-md border border-things-hairline bg-card py-1">
      <VitalsList items={ITEMS} onSelect={args.clickable ? (id) => console.log("plot", id) : undefined} />
    </div>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => (
    <div className="max-w-sm rounded-md border border-things-hairline bg-card py-1">
      <VitalsList items={ITEMS} onSelect={() => {}} />
    </div>
  ),
}

export const Unknown: Story = {
  parameters: { docs: { description: { story: "Unknown renders —, never blank." } } },
  render: () => (
    <div className="max-w-sm rounded-md border border-things-hairline bg-card py-1">
      <VitalsList items={[{ id: "a", label: "SpO₂", unit: "%" }, { id: "b", label: "Pain score" }]} />
    </div>
  ),
}

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => (
    <div className="max-w-sm rounded-md border border-things-hairline bg-card py-1">
      <VitalsList items={ITEMS} />
    </div>
  ),
}
