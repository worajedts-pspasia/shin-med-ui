import type { Meta, StoryObj } from "@storybook/react-vite"
import { MedicationList } from "./ClinicalLists"
import { AtDensity } from "./story-utils"
import { fixtureMedList } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof MedicationList> = {
  title: "Medical/Medical Component/Medication List",
  tags: ["autodocs"],
  component: MedicationList,
  parameters: { layout: "padded", docs: { description: { component: docsDesc("MedicationList") } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { render: () => <div className="max-w-3xl"><MedicationList rows={fixtureMedList} onDrugInfo={() => {}} /></div> }
export const Dense: Story = { decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>], render: () => <div className="max-w-3xl"><MedicationList rows={fixtureMedList} /></div> }
