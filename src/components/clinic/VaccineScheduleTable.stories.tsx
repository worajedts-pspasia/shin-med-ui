import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VaccineScheduleTable } from "./VaccineScheduleTable"
import { FormGrid } from "./FormGrid"
import { fixtureVaccineSeries } from "@/fixtures/clinic"

const meta: Meta<typeof VaccineScheduleTable> = {
  title: "Medical/Medical Component/Vaccine Schedule Table",
  tags: ["autodocs"],
  component: VaccineScheduleTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Immunizations as a schedule: series rows \u00d7 dose columns \u2014 date given, next due, site, route, reaction \u2014 scroll-locked with the vaccine name pinned. Pending doses carry their \"Record\" action; the dose dialog is the composition story in the story.\n\n**Watch out:** national schedules differ and change \u2014 this table renders *your* series data and owns none of the rules. Reaction cells are amber because they're context, not alarms.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

function Demo() {
  const [open, setOpen] = useState(false)
  const [vaccine, setVaccine] = useState<string | null>(null)
  return (
    <div className="max-w-3xl">
      <VaccineScheduleTable
        series={fixtureVaccineSeries}
        onRecordDose={(id) => {
          setVaccine(fixtureVaccineSeries.find((s) => s.id === id)?.vaccine ?? null)
          setOpen(true)
        }}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{vaccine ? `Record dose — ${vaccine}` : "Record dose"}</DialogTitle>
            <DialogDescription>Core fields; the full record carries ~20.</DialogDescription>
          </DialogHeader>
          <FormGrid columns={2}>
            <div className="space-y-1.5">
              <Label htmlFor="v-dose">Dose</Label>
              <Input id="v-dose" defaultValue="Annual 2026" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-date">Date given</Label>
              <Input id="v-date" type="date" defaultValue="2026-10-01" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-site">Site</Label>
              <Input id="v-site" placeholder="L deltoid" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-route">Route</Label>
              <Input id="v-route" placeholder="IM" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-lot">Lot number</Label>
              <Input id="v-lot" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-by">Given by</Label>
              <Input id="v-by" placeholder="Nurse P. Rivera" />
            </div>
            <div className="col-span-full space-y-1.5">
              <Label htmlFor="v-notes">Notes</Label>
              <Input id="v-notes" />
            </div>
          </FormGrid>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Save dose
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }
