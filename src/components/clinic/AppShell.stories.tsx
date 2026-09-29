import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BarChart3, CalendarDays, FileText, MessageSquare, ReceiptText, UserRound } from "lucide-react"
import { AppShell } from "./AppShell"
import { AllergyBanner } from "./AllergyBanner"
import { ChartTabNav } from "./ChartTabNav"
import { ClinicalSummaryColumn } from "./ClinicalSummaryColumn"
import { CollapsiblePanel } from "./CollapsiblePanel"
import { ModuleRail, type ModuleItem } from "./ModuleRail"
import { PanelStack } from "./PanelStack"
import { PatientHeaderBar } from "./PatientHeaderBar"
import { PatientIdentityCard } from "./PatientIdentityCard"
import { QueueTable } from "./QueueTable"
import { StatusBar } from "./StatusBar"
import { allergiesA, chartSections, fixtureQueue, moduleItemsData, patientA, patientB, summaryAllergies } from "@/fixtures/clinic"

const meta: Meta<typeof AppShell> = {
  title: "Medical/Medical Shell/App Shell",
  tags: ["autodocs"],
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The four-pane clinic frame: context rail left, workspace center, inspector right, status bar pinned at the bottom \u2014 resizable, layout persisted to localStorage, and honest about breakpoints. The inspector collapses to an edge-tab drawer on tablets; below that the rail moves into a sheet and the shell becomes a stacked canvas.\n\n**Watch out:** panes are percent-sized strings in this layout engine \u2014 numeric sizes are silently *pixels*. And bump the localStorage key when you change defaults, or old layouts haunt your users.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const ICONS = [CalendarDays, UserRound, MessageSquare, FileText, ReceiptText, BarChart3]
const MODULES: ModuleItem[] = moduleItemsData.map((m, i) => ({ ...m, icon: ICONS[i % ICONS.length] }))

function Shell() {
  const [activeModule, setActiveModule] = useState("schedule")
  const [activeSection, setActiveSection] = useState("summary")
  return (
    <div className="h-[100dvh] overflow-hidden">
      <AppShell
        density="compact"
        rail={<ModuleRail items={MODULES} activeId={activeModule} onSelect={setActiveModule} />}
        header={
          <PatientHeaderBar patient={patientA} alerts={allergiesA.map((a) => ({ kind: "allergy" as const, label: a.allergen }))} />
        }
        context={
          <div className="flex flex-col gap-3">
            <AllergyBanner state="has-allergies" allergies={allergiesA} />
            <CollapsiblePanel title="Waiting queue" variant="panel" className="bg-card">
              <QueueTable rows={fixtureQueue} maxHeight={220} onSelect={() => {}} />
            </CollapsiblePanel>
          </div>
        }
        inspector={
          <PanelStack mode="accordion">
            <CollapsiblePanel title="Patient" variant="panel" className="bg-card" defaultOpen>
              <PatientIdentityCard patient={patientB} phone="(317) 555-0102" fields={["dob", "sex", "phone", "mrn"]} />
            </CollapsiblePanel>
            <CollapsiblePanel title="Chart" variant="panel" className="bg-card">
              <ChartTabNav sections={chartSections} activeId={activeSection} onSelect={setActiveSection} />
            </CollapsiblePanel>
            <CollapsiblePanel title="Attested" variant="panel" className="bg-card">
              <ClinicalSummaryColumn title="Allergies" items={summaryAllergies} reviewedAt="2026-05-03" className="border-0" />
            </CollapsiblePanel>
          </PanelStack>
        }
        footer={<StatusBar left="Session 00:42:10" center="Dr. Test Physician" right="v1.0.0 · demo data" environment={{ label: "Training" }} />}
      >
        <p className="text-sm text-things-gray-2">Workspace — the screen's primary content renders here.</p>
      </AppShell>
    </div>
  )
}

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: "desktop1280" } },
  render: () => <Shell />,
}

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: "tablet" } },
  render: () => <Shell />,
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile390" } },
  render: () => <Shell />,
}

export const Playground: Story = { render: () => <Shell /> }
