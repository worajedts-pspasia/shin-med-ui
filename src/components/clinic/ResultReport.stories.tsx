import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResultReport } from "./Paper"
import { AtDensity } from "./story-utils"
import { fixtureHl7, fixturePanels, fixtureReportHeader } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ResultReport> = {
  title: "Medical/Medical Component/Result Report",
  tags: ["autodocs"],
  component: ResultReport,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("ResultReport"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <div className="mx-auto w-[80vw] rounded-md border border-things-hairline bg-things-sidebar/40 p-4">
      <ResultReport header={fixtureReportHeader} panels={fixturePanels} hl7={fixtureHl7} pageCount={2} onPage={() => {}} />
    </div>
  ),
}
