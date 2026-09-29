import type { Meta, StoryObj } from "@storybook/react-vite"
import { MedicationList } from "./ClinicalLists"
import { AtDensity } from "./story-utils"
import { fixtureMedList } from "@/fixtures/clinic"

const meta: Meta<typeof MedicationList> = {
  title: "Medical/Medical Component/Medication List",
  tags: ["autodocs"],
  component: MedicationList,
  parameters: { layout: "padded", docs: { description: { component: "Current and historical medications in one honest list: active meds first, stopped and completed below with their end dates and reasons, doses and routes in the shared formatter's care.\n\n**Watch out:** a stopped med is still *on* the record \u2014 dimmed, not deleted. And this list is read-only; changing therapy belongs to orders and reconciliation." } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { render: () => <div className="max-w-3xl"><MedicationList rows={fixtureMedList} onDrugInfo={() => {}} /></div> }
export const Dense: Story = { decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>], render: () => <div className="max-w-3xl"><MedicationList rows={fixtureMedList} /></div> }
