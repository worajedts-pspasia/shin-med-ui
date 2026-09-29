import { useState } from "react"
import { CalendarCheck, Printer } from "lucide-react"
import { ActionToolbar } from "./ActionToolbar"
import { AppShell } from "./AppShell"
import { AppointmentCard } from "./AppointmentCard"
import { CollapsiblePanel } from "./CollapsiblePanel"
import { MiniCalendar } from "./MiniCalendar"
import { ModuleRail } from "./ModuleRail"
import { PanelStack } from "./PanelStack"
import { ResourceFilterList, ScheduleSummaryTable } from "./ScheduleLists"
import { ScheduleGrid } from "./ScheduleGrid"
import { StatusBar } from "./StatusBar"
import { calMarkers, fixtureAppointments, fixtureGridSlots, fixtureResourceGroups, scheduleResources, fixtureSummaryRows } from "@/fixtures/clinic"

// Blueprint 2 — the day board (05 §2), assembled in the real AppShell.
// Blocks coloured by appointment TYPE; status a glyph. Context rail: Today
// summary, Calendar with density markers, Providers filter, Rounds. Below md
// the grid degrades to the agenda automatically.

export function DayBoard() {
  const [module, setModule] = useState("schedule")
  const [resources, setResources] = useState(["r1", "r2", "r3"])
  const [day, setDay] = useState("2026-09-28")
  const slots = fixtureGridSlots.filter((s) => resources.includes(s.resourceId))

  return (
    <div className="h-[100dvh] overflow-hidden">
      <AppShell
        density="compact"
        rail={<ModuleRail items={DAYBOARD_MODULES} activeId={module} onSelect={setModule} />}
        context={
          <PanelStack mode="accordion">
            <CollapsiblePanel title="Today" variant="panel" className="bg-card" defaultOpen>
              <ScheduleSummaryTable date="Mon, Sep 28, 2026" rows={fixtureSummaryRows} onCell={() => {}} />
            </CollapsiblePanel>
            <CollapsiblePanel title="Calendar" variant="panel" className="bg-card">
              <MiniCalendar month="2026-09" selected={day} onSelect={setDay} markers={calMarkers} />
            </CollapsiblePanel>
            <CollapsiblePanel title="Providers" variant="panel" className="bg-card">
              <ResourceFilterList groups={fixtureResourceGroups} value={resources} onChange={setResources} />
            </CollapsiblePanel>
            <CollapsiblePanel title="Rounds" variant="panel" className="bg-card">
              <p className="text-sm text-things-gray-2">Facility rounds — 2 pending</p>
            </CollapsiblePanel>
          </PanelStack>
        }
        inspector={
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-things-gray-3">Selected appointment</p>
            <AppointmentCard appt={fixtureAppointments[1]} />
            <CollapsiblePanel title="Next steps" variant="panel" className="bg-card">
              <ul className="flex flex-col gap-1.5 text-sm text-things-title">
                <li>Check in</li>
                <li>Vitals</li>
                <li>Send to room</li>
              </ul>
            </CollapsiblePanel>
          </div>
        }
        footer={<StatusBar left="Session 00:12:03" center="Dr. Test Physician" right="v1.0.0 · demo data" environment={{ label: "Training" }} />}
      >
        <div className="flex flex-col gap-3">
          <ActionToolbar
            label="Schedule actions"
            actions={[
              { id: "new", icon: CalendarCheck, label: "New appointment", onSelect: () => {} },
              { id: "print", icon: Printer, label: "Print", onSelect: () => {} },
            ]}
          />
          <ScheduleGrid
            view="week"
            resources={scheduleResources}
            slots={slots}
            rangeLabel="Sep 28 – Oct 2, 2026"
            onNavigate={() => {}}
            onCreate={() => {}}
            interval={30}
            businessHours={["08:00", "16:00"]}
          />
        </div>
      </AppShell>
    </div>
  )
}

const DAYBOARD_MODULES = [
  { id: "schedule", label: "Schedule", icon: CalendarCheck },
  { id: "patients", label: "Patients", icon: Printer },
]
