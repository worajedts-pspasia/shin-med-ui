import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/components/ui/button"
import { PatientPickerDialog } from "./PatientPickerDialog"
import { patientCorpus } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof PatientPickerDialog> = {
  title: "Medical/Medical Component/Patient Picker Dialog",
  tags: ["autodocs"],
  component: PatientPickerDialog,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("PatientPickerDialog"),
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
