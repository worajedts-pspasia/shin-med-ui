import type { Meta, StoryObj } from "@storybook/react-vite"
import { VitalsList } from "./VitalsList"
import { AtDensity } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof VitalsList> = {
  title: "Medical/Medical Component/Vitals List",
  tags: ["autodocs"],
  component: VitalsList,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("VitalsList"),
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
  parameters: { docs: { description: { story: docsDesc("VitalsList::Unknown") } } },
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
