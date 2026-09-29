import type { Meta, StoryObj } from "@storybook/react-vite"
import { SummaryOfCareTable } from "./Paper"
import { AtDensity } from "./story-utils"
import { fixtureSocSections, patientA } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof SummaryOfCareTable> = {
  title: "Medical/Medical Component/Summary Of Care Table",
  tags: ["autodocs"],
  component: SummaryOfCareTable,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("SummaryOfCareTable"),
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
