import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/components/ui/button"
import { PatientPickerDialog } from "./PatientPickerDialog"
import { patientCorpus } from "@/fixtures/clinic"

const meta: Meta<typeof PatientPickerDialog> = {
  title: "Medical/Medical Component/Patient Picker Dialog",
  tags: ["autodocs"],
  component: PatientPickerDialog,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Search came back with too many matches \u2014 this dialog shows them all as a proper table (name, DOB, MRN, sex) at a wide, comfortable density, one click to commit. It's the careful sibling of the quick combobox: for *choosing* a patient, not finding one.\n\n**Watch out:** this is an identity-critical surface \u2014 the row you click is the chart you open. Duplicate-heavy results should sort by similarity, not string order.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ results = patientCorpus }: { results?: typeof patientCorpus }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="max-w-md">
      <Button onClick={() => setOpen(true)}>ค้นประวัติ — Find patient</Button>
      <PatientPickerDialog open={open} onOpenChange={setOpen} results={results} onSelect={() => {}} />
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }
export const Default: Story = { name: "Default", render: () => <Demo /> }
export const Empty: Story = { render: () => <Demo results={[]} /> }
