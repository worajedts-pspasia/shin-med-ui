import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useTranslation } from "react-i18next"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { CodedSearchInput } from "./CodedSearchInput"
import { CollapsiblePanel } from "./CollapsiblePanel"
import { FormActionBar } from "./FormActionBar"
import { FormGrid, FormRow, FormSection, readOnlyFieldClass, RequiredMark } from "./FormGrid"
import { KeyHintButton } from "./KeyHintButton"
import { PaginationFooter } from "./PaginationFooter"
import { QueueTable } from "./QueueTable"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureQueue, patientB } from "@/fixtures/clinic"
import type { CodedConcept } from "./types"
import { docsDesc } from "@/lib/docs-desc"

// Blueprint 1 — Front desk: registration & queue (05 §1). Assembly-only, per
// the blueprint rule: nobody builds <ReceptionScreen> as a catalog component.
// AppShell / ModuleRail / StatusBar arrive with the shell wave; this story
// uses a provisional two-pane layout to prove the workspace wiring early —
// exactly what Phase 3 is for (06 §3): surfacing integration problems while
// they are cheap.

const meta: Meta<typeof QueueTable> = {
  title: "Medical/Medical Shell/Reception Blueprint",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("Reception"),
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof meta>

/** Patient search over synthetic names — CodedSearchInput stands in for
 *  PatientSearchCombobox until the shell wave ships it. */
const PATIENT_CONCEPTS: CodedConcept[] = [
  { code: "000001", term: "Smith, Michael A. Jr.", localTerm: "MRN 000001" },
  { code: "000002", term: "นาย วรวุฒิ ศิริธรรม", localTerm: "MRN 000002" },
  { code: "000003", term: "นาย สมคิด สอนประเสริฐ", localTerm: "MRN 000003" },
  { code: "000004", term: "Kakasuleff, Carly", localTerm: "MRN 000004" },
]

function Reception({ valid = true }: { valid?: boolean }) {
  const { t } = useTranslation()
  const [selectedQueueId, setSelectedQueueId] = useState<string>()
  const [patient, setPatient] = useState<CodedConcept | undefined>(PATIENT_CONCEPTS[1])
  const [page, setPage] = useState(1)
  const search = useMemo(
    () => async (q: string): Promise<CodedConcept[]> => {
      await new Promise((r) => setTimeout(r, 150))
      const n = q.toLowerCase()
      return PATIENT_CONCEPTS.filter((c) => c.term.toLowerCase().includes(n) || c.code.includes(n))
    },
    [],
  )
  return (
    <div data-slot="reception-blueprint" className="flex max-w-5xl flex-col gap-4 lg:flex-row">
      {/* context pane — the queue persists into the exam room (05 §1) */}
      <div className="flex w-full shrink-0 flex-col gap-4 lg:w-full max-w-[380px]">
        <CollapsiblePanel title={t("clinic.queue.title")}>
          <div className="rounded-md border border-things-hairline">
            <div className="p-2">
              <QueueTable rows={fixtureQueue} selectedId={selectedQueueId} onSelect={setSelectedQueueId} onRefresh={() => {}} maxHeight={240} />
            </div>
            <PaginationFooter total={5} page={page} pageCount={1} onPage={setPage} />
          </div>
        </CollapsiblePanel>

        <CollapsiblePanel title={t("clinic.reception.findPatient")} defaultOpen>
          <CodedSearchInput<CodedConcept>
            system="mrn"
            value={patient}
            onSelect={setPatient}
            search={search}
            recents={PATIENT_CONCEPTS.slice(0, 2)}
            placeholder={t("clinic.reception.searchPatient")}
          />
        </CollapsiblePanel>
      </div>

      {/* workspace — the registration record */}
      <div className="min-w-0 flex-1">
        <CollapsiblePanel title={t("clinic.reception.patientRecord")}>
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <FormSection title={t("clinic.reception.identity")} columns={2}>
              <Field>
                <FieldLabel htmlFor="rc-given">
                  {t("clinic.reception.given")}<RequiredMark />
                </FieldLabel>
                <Input id="rc-given" defaultValue="วรวุฒิ" aria-required="true" aria-invalid={!valid} />
              </Field>
              <Field>
                <FieldLabel htmlFor="rc-family">
                  {t("clinic.reception.family")}<RequiredMark />
                </FieldLabel>
                <Input id="rc-family" defaultValue="ศิริธรรม" aria-required="true" aria-invalid={!valid} />
              </Field>
              <Field>
                <FieldLabel htmlFor="rc-dob">{t("clinic.reception.dob")}</FieldLabel>
                <Input id="rc-dob" type="date" defaultValue={patientB.dob} />
              </Field>
              <Field>
                <FieldLabel htmlFor="rc-sex">{t("clinic.patient.sex")}</FieldLabel>
                <NativeSelect id="rc-sex" defaultValue="male">
                  <option value="male">{t("clinic.patient.sexLabel.male")}</option>
                  <option value="female">{t("clinic.patient.sexLabel.female")}</option>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="rc-mrn">{t("clinic.patient.mrn")}</FieldLabel>
                <Input id="rc-mrn" defaultValue={patientB.mrn} readOnly className={`font-mono ${readOnlyFieldClass}`} />
              </Field>
              <Field>
                <FieldLabel htmlFor="rc-phone">{t("clinic.reception.phone")}</FieldLabel>
                <Input id="rc-phone" defaultValue="(317) 555-0101" />
              </Field>
            </FormSection>

            <FormSection title={t("clinic.reception.address")}>
              <FormRow columns={3} fixed>
                <Field>
                  <FieldLabel htmlFor="rc-house">{t("clinic.reception.houseNo")}</FieldLabel>
                  <Input id="rc-house" defaultValue="128/3" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="rc-moo">{t("clinic.reception.moo")}</FieldLabel>
                  <Input id="rc-moo" defaultValue="5" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="rc-road">{t("clinic.reception.road")}</FieldLabel>
                  <Input id="rc-road" defaultValue="ประชาอุทิศ" />
                </Field>
              </FormRow>
              <FormRow columns={3}>
                <Field>
                  <FieldLabel htmlFor="rc-sub">{t("clinic.reception.subdistrict")}</FieldLabel>
                  <Input id="rc-sub" defaultValue="บางบอน" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="rc-dist">{t("clinic.reception.district")}</FieldLabel>
                  <Input id="rc-dist" defaultValue="บางแขก" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="rc-post">{t("clinic.reception.postcode")}</FieldLabel>
                  <Input id="rc-post" defaultValue="10180" />
                </Field>
              </FormRow>
            </FormSection>

            <FormSection title={t("clinic.reception.visit")} columns={2}>
              <Field>
                <FieldLabel htmlFor="rc-status">{t("clinic.queue.status")}</FieldLabel>
                <NativeSelect id="rc-status" defaultValue="arrived">
                  <option value="arrived">{t("clinic.queue.arrived")}</option>
                  <option value="accepted">{t("clinic.queue.accepted")}</option>
                  <option value="held">{t("clinic.queue.held")}</option>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="rc-urgency">{t("clinic.queue.urgency")}</FieldLabel>
                <NativeSelect id="rc-urgency" defaultValue="routine">
                  <option value="routine">{t("clinic.urgency.routine")}</option>
                  <option value="rush">{t("clinic.urgency.rush")}</option>
                  <option value="urgent">{t("clinic.urgency.urgent")}</option>
                </NativeSelect>
              </Field>
            </FormSection>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <KeyHintButton label={t("clinic.reception.newPatient")} shortcut="F9" onSelect={() => {}} variant="outline" />
              <FormActionBar
                className="border-t-0 px-0 backdrop-blur-none"
                primary={{
                  label: t("clinic.reception.saveSend"),
                  onSelect: () => {},
                  disabled: !valid,
                  reason: valid ? undefined : t("clinic.reception.invalidReason"),
                }}
                secondary={[
                  { label: t("clinic.reception.printOpd"), onSelect: () => {} },
                  { label: t("clinic.form.cancel"), onSelect: () => {} },
                ]}
                dirty
                onCancel={() => {}}
              />
            </div>
          </form>
        </CollapsiblePanel>
      </div>
    </div>
  )
}

export const Playground: Story = {
  argTypes: { valid: { control: "boolean" } } as unknown as Meta<typeof QueueTable>["argTypes"],
  args: { valid: true } as Record<string, unknown>,
  render: (args: any) => (
    <AtDensity density="compact">
      <Reception valid={args.valid} />
    </AtDensity>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => (
    <AtDensity density="compact">
      <Reception />
    </AtDensity>
  ),
}

export const InvalidForm: Story = {
  render: () => (
    <AtDensity density="compact">
      <Reception valid={false} />
    </AtDensity>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <Reception />
      </AtDensity>
    </ForcedLocale>
  ),
}
