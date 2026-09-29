import type { Meta, StoryObj } from "@storybook/react-vite"
import { VitalsStrip } from "./VitalsStrip"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureVitals } from "@/fixtures/clinic"

const meta: Meta<typeof VitalsStrip> = {
  title: "Medical/Medical Component/Vitals Strip",
  tags: ["autodocs"],
  component: VitalsStrip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The compact editable vitals row: one line, every value inline-editable, abnormal entries toning as you type \u2014 designed for the room, where the computer is between you and the patient.\n\n**Watch out:** it's for *capture*, not history \u2014 once saved, values move to VitalsList and the trend. And keep the row single-line; wrapping defeats the whole point.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: {
    editable: { control: "boolean" },
    withCC: { control: "boolean" },
  } as unknown as Meta<typeof VitalsStrip>["argTypes"],
  args: { editable: true, withCC: true } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-3xl rounded-md border border-things-hairline bg-card p-3">
      <VitalsStrip cells={fixtureVitals} chiefComplaint={args.withCC ? "HTN follow-up, epigastric burning" : undefined} editable={args.editable} onChange={(k, v) => console.log(k, v)} />
    </div>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => (
    <div className="max-w-3xl rounded-md border border-things-hairline bg-card p-3">
      <VitalsStrip cells={fixtureVitals} chiefComplaint="HTN follow-up, epigastric burning" onChange={() => {}} />
    </div>
  ),
}

export const ReadOnly: Story = {
  render: () => (
    <div className="max-w-3xl rounded-md border border-things-hairline bg-card p-3">
      <VitalsStrip cells={fixtureVitals} chiefComplaint="HTN follow-up" editable={false} />
    </div>
  ),
}

/** At 390px the grid wraps to 3 columns — it never scrolls sideways. */
export const Mobile: Story = {
  render: () => (
    <AtDensity density="compact">
      <div className="max-w-[390px] rounded-md border border-things-hairline bg-card p-3">
        <VitalsStrip cells={fixtureVitals} chiefComplaint="HTN follow-up" />
      </div>
    </AtDensity>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-3xl rounded-md border border-things-hairline bg-card p-3">
          <VitalsStrip cells={fixtureVitals} chiefComplaint="ตามอาการความดันสูง" />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}
