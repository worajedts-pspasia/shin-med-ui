import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResultReport } from "./Paper"
import { AtDensity } from "./story-utils"
import { fixtureHl7, fixturePanels, fixtureReportHeader } from "@/fixtures/clinic"

const meta: Meta<typeof ResultReport> = {
  title: "Medical/Medical Component/Result Report",
  tags: ["autodocs"],
  component: ResultReport,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A full external lab report as a document: identity grid (accession, collected, reported), the result table in fit-to-sheet mode, flags and interpretive notes, HL7 guts tucked behind a details element, pager at the bottom.\n\n**Watch out:** external reports are legal documents \u2014 render them verbatim, warts and all. \"Fit\" mode stretches columns to the sheet; turn it off only for genuinely wide panels.",
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
