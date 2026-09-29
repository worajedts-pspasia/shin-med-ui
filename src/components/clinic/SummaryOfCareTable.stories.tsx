import type { Meta, StoryObj } from "@storybook/react-vite"
import { SummaryOfCareTable } from "./Paper"
import { AtDensity } from "./story-utils"
import { fixtureSocSections, patientA } from "@/fixtures/clinic"

const meta: Meta<typeof SummaryOfCareTable> = {
  title: "Medical/Medical Component/Summary Of Care Table",
  tags: ["autodocs"],
  component: SummaryOfCareTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The striped label/value clinical summary for referrals and transitions: full-width label bands, values in readable columns, emphasis where the next provider's eyes should land first.\n\n**Watch out:** it's a *communication* document \u2014 written for someone who doesn't have your chart. If it only makes sense with the chart open, it has failed.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: { emphasis: { control: "boolean" } },
  args: { emphasis: false } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-3xl rounded-md border border-things-hairline bg-things-sidebar/40 p-4">
      <SummaryOfCareTable
        emphasis={args.emphasis}
        header={<p className="text-sm font-bold">Continuity of Care Document — Siri Clinic</p>}
        sections={fixtureSocSections}
      />
    </div>
  ),
}
