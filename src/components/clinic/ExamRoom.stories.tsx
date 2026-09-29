import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Stethoscope } from "lucide-react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AllergyBanner } from "./AllergyBanner"
import { CodedSearchInput } from "./CodedSearchInput"
import { FindingsChecklistGroup } from "./FindingsChecklistGroup"
import { FormActionBar } from "./FormActionBar"
import { KeyHintButton } from "./KeyHintButton"
import { LineItemTable } from "./LineItemTable"
import { NestedPanel } from "./NestedPanel"
import { PatientHeaderBar } from "./PatientHeaderBar"
import { ProcedureEntryCard } from "./ProcedureEntryCard"
import { QueueTable } from "./QueueTable"
import { VitalsStrip } from "./VitalsStrip"
import { AtDensity, ForcedLocale } from "./story-utils"
import { allergiesA, codedIcd10, fixtureDirectory, fixtureFindings, fixtureLineItems, fixtureProblems, fixtureQueue, fixtureVitals, patientA } from "@/fixtures/clinic"
import type { CodedConcept } from "./types"
import { docsDesc } from "@/lib/docs-desc"

// Blueprint 3 — the exam room (05 §3): where the redesign happens. The source
// uses tabs (you cannot see the diagnosis while prescribing for it); we adopt
// the cardiology system's CARD STACK. The allergy banner sits under the
// patient header permanently (in 02.1 it is a form field that scrolls away —
// a defect). F-keys survive: F2 save, F5–F9 focus the matching card.
// The queue persists in the context pane. Inspector/PatientIdentityCard and
// AppShell arrive with the shell wave — provisional frame, documented.
// GATE (06 §3): this screen must work end-to-end in Thai at 390px and 1440px.

const meta: Meta<typeof QueueTable> = {
  title: "Medical/Medical Shell/Exam Room Blueprint",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: docsDesc("ExamRoom"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const searchIcd = async (q: string): Promise<CodedConcept[]> => {
  await sleep(150)
  const n = q.toLowerCase()
  return codedIcd10.filter((c) => c.code.toLowerCase().includes(n) || c.term.toLowerCase().includes(n) || (c.localTerm ?? "").includes(q))
}

function ExamRoomScreen({ valid = true }: { valid?: boolean }) {
  const [dx, setDx] = useState<CodedConcept | undefined>(codedIcd10[0])
  const [findings, setFindings] = useState(fixtureFindings.map((f) => ({ ...f, checked: false, abnormal: undefined as string | undefined })))
  const [focusCard, setFocusCard] = useState<string>("plan")

  return (
    <div data-slot="exam-room-blueprint" className="flex max-w-6xl flex-col gap-3 lg:flex-row">
      {/* context — the queue persists into the exam room (05 §3) */}
      <aside className="w-full shrink-0 lg:w-full max-w-[300px]">
        <div className="rounded-md border border-things-hairline bg-card p-2">
          <p className="mb-1.5 text-[13px] font-semibold text-things-title">คิวตรวจ — Waiting queue</p>
          <QueueTable rows={fixtureQueue} maxHeight={280} onSelect={() => {}} />
        </div>
      </aside>

      {/* workspace — the card stack */}
      <main className="flex min-w-0 flex-1 flex-col gap-3">
        {/* pinned identity + safety — the banner NEVER scrolls away */}
        <PatientHeaderBar patient={patientA} alerts={allergiesA.map((a) => ({ kind: "allergy" as const, label: a.allergen }))} />
        <AllergyBanner state="has-allergies" allergies={allergiesA} />

        <div className="rounded-md border border-things-hairline bg-card p-3">
          <VitalsStrip cells={fixtureVitals} chiefComplaint="Epigastric burning × 3 days" onChange={() => {}} />
        </div>

        {/* F-keys keep the source's muscle memory (05 §3) */}
        <div className="flex flex-wrap gap-1.5">
          <KeyHintButton label="Save (F2)" shortcut="F2" onSelect={() => {}} variant="outline" />
          {(["Subjective F5", "Objective F6", "Assessment F7", "Plan F8"] as const).map((label, i) => (
            <KeyHintButton key={label} label={label} shortcut={`F${5 + i}`} showHint="never" onSelect={() => setFocusCard(["subjective", "objective", "assessment", "plan"][i])} variant="ghost" />
          ))}
        </div>

        <ProcedureEntryCard
          kind="Subjective"
          title="PI — epigastric burning × 3 days, worse post-prandial"
          accent="var(--color-things-glyph-blue)"
          defaultOpen={focusCard === "subjective"}
        >
          <Field>
            <FieldLabel htmlFor="er-pi">Present illness</FieldLabel>
            <textarea id="er-pi" rows={2} className="w-full rounded-md border border-things-box bg-transparent px-2 py-1.5 text-sm shadow-xs focus-visible:border-things-blue focus-visible:ring-2 focus-visible:ring-things-blue/30" defaultValue="Burning epigastric pain for 3 days, worse after meals, no radiation. Occasional nausea, no vomiting." />
          </Field>
        </ProcedureEntryCard>

        <ProcedureEntryCard kind="Objective" title="Exam + point-of-care findings" accent="var(--color-things-teal)" defaultOpen={focusCard === "objective"}>
          <FindingsChecklistGroup
            title="Abdominal exam"
            items={findings}
            columns={2}
            onToggle={(id, checked) => setFindings((its) => its.map((i) => (i.id === id ? { ...i, checked } : i)))}
            onAbnormal={(id, value) => setFindings((its) => its.map((i) => (i.id === id ? { ...i, abnormal: value } : i)))}
          />
        </ProcedureEntryCard>

        <ProcedureEntryCard kind="Assessment" title="Diagnoses" accent="var(--color-things-pink)" defaultOpen={focusCard === "assessment"}>
          <div className="flex flex-col gap-2">
            <CodedSearchInput<CodedConcept> system="icd10" value={dx} onSelect={setDx} search={searchIcd} favorites={[codedIcd10[0], codedIcd10[4]]} />
            <LineItemTable
              headers={[{ label: "Code" }, { label: "Diagnosis" }, { label: "Status" }]}
              rows={fixtureProblems.filter((p) => p.status === "active").map((p) => ({
                id: p.id,
                status: p.alert ? ("warn" as const) : undefined,
                cells: [{ node: <span className="font-mono text-xs">{p.code}</span> }, { node: p.description }, { node: p.status === "active" ? "Active" : "—" }],
              }))}
            />
          </div>
        </ProcedureEntryCard>

        <ProcedureEntryCard kind="Plan" title="Orders & prescriptions" accent="var(--color-things-blue)" defaultOpen={focusCard === "plan"}>
          <div className="flex flex-col gap-3">
            <NestedPanel title="Medications" addLabel="+ ADD RX" onAdd={() => {}}>
              <LineItemTable
                headers={[{ label: "Item" }, { label: "Qty", numeric: true }, { label: "Unit" }, { label: "Sig" }]}
                rows={fixtureLineItems.map((li) => ({
                  id: li.id, status: li.status,
                  cells: [{ node: li.name }, { node: String(li.qty), numeric: true }, { node: li.unit }, { node: <span className="font-mono text-xs">{li.sig}</span> }],
                }))}
                onEdit={() => {}} onDelete={() => {}}
              />
            </NestedPanel>
            <NestedPanel title="Labs" addLabel="+ ADD ORDER" onAdd={() => {}}>
              <p className="text-sm text-things-title">HbA1c — every 3 mo (due) · Creatinine + eGFR — every 6 mo</p>
            </NestedPanel>
            <NestedPanel title="Follow-up" onAdd={() => {}}>
              <p className="clinic-num text-sm text-things-title">3 months — 2026-12-28</p>
            </NestedPanel>
          </div>
        </ProcedureEntryCard>

        <FormActionBar
          primary={{ label: "Save & sign", onSelect: () => {}, disabled: !valid, reason: valid ? undefined : "Assessment requires at least one diagnosis." }}
          secondary={[{ label: "Print OPD", onSelect: () => {} }, { label: "Cancel", onSelect: () => {} }]}
          dirty
          onCancel={() => {}}
        />
      </main>
    </div>
  )
}

export const Playground: Story = {
  argTypes: { valid: { control: "boolean" } } as unknown as Meta<typeof QueueTable>["argTypes"],
  args: { valid: true } as Record<string, unknown>,
  render: (args: any) => (
    <AtDensity density="compact">
      <ExamRoomScreen valid={args.valid} />
    </AtDensity>
  ),
}

export const Default: Story = {
  name: "Default (1440px)",
  parameters: { viewport: { defaultViewport: "desktop1280" } },
  render: () => (
    <AtDensity density="compact">
      <ExamRoomScreen />
    </AtDensity>
  ),
}

/** GATE (06 §3): the exam room works end-to-end in Thai at 390px. */
export const ThaiMobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile390" } },
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="mx-auto max-w-[390px]">
          <ExamRoomScreen />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <ExamRoomScreen />
      </AtDensity>
    </ForcedLocale>
  ),
}
