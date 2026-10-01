// Variant A — the CURRENT design, composed only from existing shin-med-ui
// components (no new styling). This is the baseline the proposals are judged
// against, so it must not be prettied up: if a page looks rough here, that
// roughness is a finding.

import { ClipboardList, ListFilter, Pill, Plus, Printer, Stethoscope, Trash2, UserRound, Users } from "lucide-react"
import { useState } from "react"
import { AllergyBanner } from "@/components/clinic/AllergyBanner"
import { AppShell } from "@/components/clinic/AppShell"
import { CodedSearchInput } from "@/components/clinic/CodedSearchInput"
import { CollapsiblePanel } from "@/components/clinic/CollapsiblePanel"
import { DataTable, type DataTableColumn } from "@/components/clinic/DataTable"
import { FormActionBar } from "@/components/clinic/FormActionBar"
import { FormRow, FormSection, RequiredMark } from "@/components/clinic/FormGrid"
import { LauncherRail, type LauncherSection } from "@/components/clinic/LauncherRail"
import { PaginationFooter } from "@/components/clinic/PaginationFooter"
import { PatientHeaderBar } from "@/components/clinic/PatientHeaderBar"
import { PatientIdentityCard } from "@/components/clinic/PatientIdentityCard"
import { QueueTable } from "@/components/clinic/QueueTable"
import { SectionHeader } from "@/components/clinic/SectionHeader"
import { StatusBar } from "@/components/clinic/StatusBar"
import { StatusDot } from "@/components/clinic/StatusDot"
import { StepTabs } from "@/components/clinic/StepTabs"
import { TaskCountList } from "@/components/clinic/TaskCountList"
import { toneText } from "@/components/clinic/tokens"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { fixtureLauncherModuleGroups, fixtureLauncherModules } from "@/fixtures/clinic"
import { FREQS, PHARMACY, PROVIDERS, ROUTES, SCHEMES, STATUS_LABEL, ageOf, formatName, visitHistory, type CurrentMed, type PastVisit, type RegPatient } from "./data"
import {
  LISTS, PAGES, VITALS, bmiOf, emptyRx, encounterErrors, findDrug, runQuery, rxErrors, rxQty, rxTotal,
  searchDrugs, searchIcd, thb, toneGlyph, useScenario, vitalTone, type Page, type RxDraft, type SortKey,
} from "./scenario"

export const STUDY_SECTIONS: LauncherSection[] = [
  { id: "registry", label: "Patient registry", icon: Users },
  { id: "visit", label: "Visit & assessment", icon: Stethoscope },
  { id: "orders", label: "Orders & prescription", icon: Pill },
]

export function CurrentDesignApp() {
  const s = useScenario()
  const p = s.patient
  const chartPage = s.page !== "registry"

  const queueRows = s.patients
    .filter((x) => x.status === "arrived" || x.status === "in-room" || x.status === "held")
    .map((x) => ({ id: x.id, mrn: x.mrn, name: x.name, arrivedAt: x.arrivedAt ?? "", waitMinutes: x.waitMinutes, urgency: x.urgency, status: x.status! }))

  return (
    <div className="h-[100dvh] overflow-hidden">
      <AppShell
        density="compact"
        rail={
          <LauncherRail
            mode="sections"
            modules={fixtureLauncherModules}
            groups={fixtureLauncherModuleGroups}
            activeModuleId="clinic"
            sections={STUDY_SECTIONS}
            activeSectionId={s.page}
            onSectionSelect={(id) => s.go(id as Page)}
          />
        }
        header={
          chartPage ? (
            <PatientHeaderBar
              patient={{ id: p.id, mrn: p.mrn, name: p.name, dob: p.dob, sex: p.sex }}
              asOf="2026-09-28"
              alerts={p.allergies.map((a) => ({ kind: "allergy" as const, label: a.allergen }))}
            />
          ) : undefined
        }
        context={
          chartPage ? (
            <CollapsiblePanel title="Waiting queue" variant="panel" className="bg-card" defaultOpen>
              <QueueTable rows={queueRows} selectedId={p.id} onSelect={(id) => s.go("visit", id)} maxHeight={520} />
            </CollapsiblePanel>
          ) : (
            <CollapsiblePanel title="Lists" variant="panel" className="bg-card" defaultOpen>
              <TaskCountList
                items={LISTS.map((l) => ({ id: l.id, label: l.label, count: s.patients.filter(l.test).length, icon: l.id === "all" ? Users : ListFilter }))}
                activeId={s.query.list}
                onSelect={(id) => s.setQuery({ list: id as typeof s.query.list })}
              />
            </CollapsiblePanel>
          )
        }
        inspector={s.page === "registry" ? <RegistryInspector /> : <HistoryInspector />}
        footer={<StatusBar left={`${s.patients.length} registered · ${s.patients.filter((x) => x.status === "arrived").length} waiting`} center="Dr. Test Physician" right="Variant A · current design" environment={{ label: "Training" }} />}
      >
        <div className="flex flex-col gap-3">
          <StepTabs
            steps={PAGES.map((x) => ({ id: x.id, label: `${x.step}. ${x.label}`, icon: x.id === "registry" ? Users : x.id === "visit" ? Stethoscope : ClipboardList }))}
            activeId={s.page}
            onSelect={(id) => s.go(id as Page)}
            completedIds={s.page === "orders" ? ["registry", "visit"] : s.page === "visit" ? ["registry"] : []}
          />
          {chartPage && <AllergyBanner state={p.allergies.length ? "has-allergies" : "none-recorded"} allergies={p.allergies} />}
          {s.page === "registry" && <RegistryPage />}
          {s.page === "visit" && <VisitPage />}
          {s.page === "orders" && <OrdersPage />}
        </div>
      </AppShell>
    </div>
  )
}

/* ——— page 1: registry ——————————————————————————————————————— */

function RegistryPage() {
  const s = useScenario()
  const q = s.query
  const res = runQuery(s.patients, q)
  const onSort = (id: string) =>
    s.setQuery({ sort: { id: id as SortKey, dir: q.sort.id === id && q.sort.dir === "asc" ? "desc" : "asc" }, page: q.page })

  const columns: Array<DataTableColumn<RegPatient>> = [
    { id: "mrn", header: "MRN", width: 80, cell: (r) => <span className="font-mono text-[11px]">{r.mrn}</span> },
    {
      id: "name", header: "Patient", cell: (r) => (
        <button type="button" className="text-left text-things-blue hover:underline" onClick={() => s.go("visit", r.id)}>
          {formatName(r.name)}
          {r.allergies.length > 0 && <span className="ml-1.5 text-[11px] font-semibold text-clinic-critical" title={`Allergy: ${r.allergies.map((a) => a.allergen).join(", ")}`}>⚠ ALG</span>}
        </button>
      ),
    },
    { id: "age", header: "Age", numeric: true, width: 56, cell: (r) => `${ageOf(r.dob)} ${r.sex === "male" ? "M" : "F"}` },
    { id: "scheme", header: "Scheme", width: 80, priority: "secondary", cell: (r) => r.scheme },
    { id: "provider", header: "Provider", priority: "secondary", cell: (r) => r.provider },
    { id: "status", header: "Today", width: 120, cell: (r) => (r.status ? <StatusDot tone={r.status} label={STATUS_LABEL[r.status]} /> : <span className="text-things-gray">—</span>) },
    { id: "arrivedAt", header: "Arrived", numeric: true, width: 72, cell: (r) => r.arrivedAt ?? "—" },
    { id: "lastVisit", header: "Last visit", numeric: true, width: 96, priority: "secondary", cell: (r) => r.lastVisit },
    { id: "balance", header: "Balance", numeric: true, width: 96, cell: (r) => (r.balance ? thb(r.balance) : "—") },
  ]

  return (
    <>
      {s.flash && (
        <Alert>
          <AlertTitle>Prescriptions signed</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            {s.flash.text}
            <Button size="xs" variant="ghost" onClick={s.dismissFlash}>Dismiss</Button>
          </AlertDescription>
        </Alert>
      )}
      <SectionHeader title="Patient registry" meta={`${res.total} of ${s.patients.length} patients`} action={<Button size="sm"><Plus className="size-4" />Register patient</Button>} />
      <div className="flex flex-wrap items-end gap-2">
        <Field className="w-64">
          <FieldLabel className="text-xs">Search</FieldLabel>
          <Input placeholder="Name, MRN or phone" value={q.text} onChange={(e) => s.setQuery({ text: e.target.value })} className="h-8 text-sm" />
        </Field>
        <Field className="w-36">
          <FieldLabel className="text-xs">Scheme</FieldLabel>
          <NativeSelect value={q.scheme} onChange={(e) => s.setQuery({ scheme: e.target.value as typeof q.scheme })} className="h-8 text-sm">
            <NativeSelectOption value="any">Any scheme</NativeSelectOption>
            {SCHEMES.map((x) => <NativeSelectOption key={x} value={x}>{x}</NativeSelectOption>)}
          </NativeSelect>
        </Field>
        <Field className="w-48">
          <FieldLabel className="text-xs">Provider</FieldLabel>
          <NativeSelect value={q.provider} onChange={(e) => s.setQuery({ provider: e.target.value })} className="h-8 text-sm">
            <NativeSelectOption value="any">Any provider</NativeSelectOption>
            {PROVIDERS.map((x) => <NativeSelectOption key={x} value={x}>{x}</NativeSelectOption>)}
          </NativeSelect>
        </Field>
        {s.selection.length > 0 && (
          <div className="ml-auto flex items-center gap-2 text-xs text-things-gray-2">
            {s.selection.length} selected
            <Button size="sm" variant="outline"><Printer className="size-4" />Print labels</Button>
            <Button size="sm" variant="ghost" onClick={s.clearSelection}>Clear</Button>
          </div>
        )}
      </div>
      <DataTable<RegPatient>
        columns={columns}
        rows={res.rows}
        rowKey={(r) => r.id}
        zebra
        selected={s.selection}
        onSelect={s.toggleSelection}
        sort={q.sort}
        onSort={onSort}
        rowClass={(r) => (s.flash?.patientId === r.id ? "bg-things-blue-soft" : "")}
        emptyState={<p className="p-6 text-center text-sm text-things-gray-3">No patients match these filters.</p>}
      />
      <PaginationFooter total={res.total} page={res.page} pageCount={res.pageCount} onPage={(n) => s.setQuery({ page: n })} unit="rows" />
    </>
  )
}

function RegistryInspector() {
  const s = useScenario()
  const p = s.patient
  return (
    <div className="flex flex-col gap-3">
      <CollapsiblePanel title="Selected patient" variant="panel" className="bg-card" defaultOpen>
        <PatientIdentityCard patient={{ id: p.id, mrn: p.mrn, name: p.name, dob: p.dob, sex: p.sex }} phone={p.phone} insurance={p.scheme} fields={["dob", "sex", "phone", "insurance", "mrn"]} />
        <Button size="sm" className="mt-2 w-full" onClick={() => s.go("visit", p.id)}><UserRound className="size-4" />Open visit</Button>
      </CollapsiblePanel>
      <AllergyBanner state={p.allergies.length ? "has-allergies" : "none-recorded"} allergies={p.allergies} />
    </div>
  )
}

function HistoryInspector() {
  const s = useScenario()
  const rows = visitHistory(s.patient)
  const columns: Array<DataTableColumn<PastVisit>> = [
    { id: "date", header: "Date", numeric: true, width: 88, cell: (r) => r.date },
    { id: "dx", header: "Dx", cell: (r) => <span title={r.dx.term}><span className="font-mono text-[11px]">{r.dx.code}</span></span> },
    { id: "bp", header: "BP", numeric: true, width: 64, cell: (r) => `${r.bp[0]}/${r.bp[1]}` },
  ]
  return (
    <CollapsiblePanel title="Visit history" variant="panel" className="bg-card" defaultOpen>
      <DataTable<PastVisit> columns={columns} rows={rows} rowKey={(r) => r.id} zebra />
    </CollapsiblePanel>
  )
}

/* ——— page 2: visit ——————————————————————————————————————————— */

function VisitPage() {
  const s = useScenario()
  const e = s.encounter
  const errs = encounterErrors(e)
  const [touched, setTouched] = useState(false)
  const show = (k: keyof typeof errs) => (touched || k !== "diagnoses") && errs[k]
  const valid = Object.keys(errs).length === 0

  return (
    <div className="flex flex-col gap-4 pb-2">
      <FormSection title="Vital signs" description="Taken at triage 08:21 — edit if re-measured." columns={3}>
        {VITALS.map((v) => {
          const tone = vitalTone(v.key, e.vitals[v.key])
          const glyph = toneGlyph(v.key, e.vitals[v.key], tone)
          return (
            <Field key={v.key} data-invalid={Boolean(errs[v.key]) || undefined}>
              <FieldLabel className="text-xs">
                {v.label} ({v.unit}){v.required && <RequiredMark />}
              </FieldLabel>
              <div className="flex items-center gap-2">
                <Input inputMode="decimal" value={e.vitals[v.key]} onChange={(ev) => s.setVital(v.key, ev.target.value)} aria-invalid={Boolean(errs[v.key]) || undefined} className={cn("clinic-num h-8 text-sm", toneText[tone])} />
                {glyph && <span className={cn("clinic-num text-xs font-semibold", toneText[tone])} aria-label={tone}>{glyph}</span>}
              </div>
              {errs[v.key] && <FieldError>{errs[v.key]}</FieldError>}
            </Field>
          )
        })}
        <Field>
          <FieldLabel className="text-xs">BMI (derived)</FieldLabel>
          <Input readOnly value={bmiOf(e)} className="clinic-num h-8 text-sm read-only:bg-things-blue-soft/50" />
        </Field>
      </FormSection>

      <FormSection title="Presenting problem" columns={2}>
        <FormRow columns={1}>
          <Field data-invalid={Boolean(errs.chiefComplaint) || undefined}>
            <FieldLabel className="text-xs">Chief complaint<RequiredMark /></FieldLabel>
            <Textarea value={e.chiefComplaint} onChange={(ev) => s.updateEncounter({ chiefComplaint: ev.target.value })} rows={2} className="text-sm" />
            {errs.chiefComplaint && <FieldError>{errs.chiefComplaint}</FieldError>}
          </Field>
        </FormRow>
        <Field>
          <FieldLabel className="text-xs">Triage</FieldLabel>
          <NativeSelect value={e.triage} onChange={(ev) => s.updateEncounter({ triage: ev.target.value as typeof e.triage })} className="h-8 text-sm">
            <NativeSelectOption value="routine">Routine</NativeSelectOption>
            <NativeSelectOption value="rush">Rush</NativeSelectOption>
            <NativeSelectOption value="urgent">Urgent</NativeSelectOption>
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel className="text-xs">Follow-up</FieldLabel>
          <Input type="date" value={e.followUp} onChange={(ev) => s.updateEncounter({ followUp: ev.target.value })} className="h-8 text-sm" />
        </Field>
      </FormSection>

      <FormSection title="Diagnosis (ICD-10)" columns={1}>
        <Field data-invalid={Boolean(show("diagnoses")) || undefined}>
          <FieldLabel className="text-xs">Add diagnosis<RequiredMark /></FieldLabel>
          <CodedSearchInput system="icd10" search={searchIcd} onSelect={(c) => s.updateEncounter({ diagnoses: [...e.diagnoses.filter((d) => d.code !== c.code), c] })} placeholder="Search code or term…" />
          {show("diagnoses") && <FieldError>{errs.diagnoses}</FieldError>}
        </Field>
        {e.diagnoses.length > 0 && (
          <ul className="divide-y divide-things-hairline rounded-md border border-things-hairline">
            {e.diagnoses.map((d, i) => (
              <li key={d.code} className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <span className="w-14 font-mono text-[11px]">{d.code}</span>
                <span className="flex-1">{d.term} <span className="text-xs text-things-gray-3">{d.localTerm}</span></span>
                {i === 0 && <Badge variant="outline">Primary</Badge>}
                <Button size="icon-xs" variant="ghost" aria-label={`Remove ${d.code}`} onClick={() => s.updateEncounter({ diagnoses: e.diagnoses.filter((x) => x.code !== d.code) })}><Trash2 /></Button>
              </li>
            ))}
          </ul>
        )}
      </FormSection>

      <FormSection title="Clinical note" columns={1}>
        <Textarea value={e.note} onChange={(ev) => s.updateEncounter({ note: ev.target.value })} rows={4} placeholder="Examination findings, assessment, plan…" className="text-sm" />
      </FormSection>

      <FormActionBar
        dirty={s.encounterDirty}
        primary={{
          label: "Continue to orders",
          onSelect: () => (valid ? s.go("orders") : setTouched(true)),
          disabled: touched && !valid,
          reason: "Complete the required fields first",
        }}
        secondary={[{ label: "Save draft", onSelect: s.saveEncounter }]}
        onCancel={() => s.go("registry")}
      />
    </div>
  )
}

/* ——— page 3: orders ——————————————————————————————————————————— */

function OrdersPage() {
  const s = useScenario()
  const p = s.patient
  const [draft, setDraft] = useState<RxDraft>(emptyRx())
  const [tried, setTried] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const { errs, drug, hit } = rxErrors(draft, p.allergies)
  const qty = rxQty(drug, Number(draft.dose), draft.freq, Number(draft.days))
  const set = (patch: Partial<RxDraft>) => setDraft((d) => ({ ...d, ...patch }))

  const add = () => {
    setTried(true)
    if (Object.keys(errs).length || !drug) return
    s.addRx({ drug, dose: Number(draft.dose), freq: draft.freq, days: Number(draft.days), route: draft.route, qty, instructions: draft.instructions, allergy: hit, override: draft.override || undefined })
    setDraft(emptyRx())
    setTried(false)
  }

  const medCols: Array<DataTableColumn<CurrentMed>> = [
    { id: "drug", header: "Medication", cell: (r) => `${r.drug} ${r.dose}` },
    { id: "sig", header: "Sig", cell: (r) => r.sig },
    { id: "since", header: "Since", numeric: true, width: 92, priority: "secondary", cell: (r) => r.since },
    {
      id: "decision", header: "Decision", width: 132, cell: (r) => (
        <NativeSelect value={r.decision} onChange={(ev) => s.setMedDecision(r.id, ev.target.value as CurrentMed["decision"])} className="h-7 text-xs" aria-label={`Decision for ${r.drug}`}>
          <NativeSelectOption value="continue">Continue</NativeSelectOption>
          <NativeSelectOption value="hold">Hold</NativeSelectOption>
          <NativeSelectOption value="stop">Stop</NativeSelectOption>
        </NativeSelect>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4 pb-2">
      <section>
        <SectionHeader title="Current medications" meta={`${s.meds.length} active`} />
        <DataTable<CurrentMed> columns={medCols} rows={s.meds} rowKey={(r) => r.id} zebra rowTone={(r) => (r.decision === "stop" ? "warn" : "none")} />
      </section>

      <FormSection title="New prescription" columns={3}>
        <FormRow columns={1}>
          <Field data-invalid={Boolean(tried && errs.drugCode) || undefined}>
            <FieldLabel className="text-xs">Drug<RequiredMark /></FieldLabel>
            <CodedSearchInput
              system="drug"
              search={searchDrugs}
              value={drug ? { code: drug.code, term: `${drug.name} ${drug.strength} ${drug.form}`, localTerm: drug.localName } : undefined}
              onSelect={(c) => {
                const d = findDrug(c.code)
                set({ drugCode: c.code, freq: d?.defaultFreq ?? draft.freq, override: "", acknowledged: false })
              }}
              onClear={() => set({ drugCode: "" })}
              placeholder="Search drug…"
            />
            {tried && errs.drugCode && <FieldError>{errs.drugCode}</FieldError>}
          </Field>
        </FormRow>
        {hit && (
          <FormRow columns={1}>
            <Alert variant={hit.level === "critical" ? "destructive" : "default"}>
              <AlertTitle>{hit.level === "critical" ? "Allergy — contraindicated" : "Allergy — use caution"}</AlertTitle>
              <AlertDescription>{hit.message}</AlertDescription>
            </Alert>
          </FormRow>
        )}
        <Field data-invalid={Boolean(errs.dose) || undefined}>
          <FieldLabel className="text-xs">Dose (units)<RequiredMark /></FieldLabel>
          <Input inputMode="decimal" value={draft.dose} onChange={(ev) => set({ dose: ev.target.value })} className="clinic-num h-8 text-sm" />
          {errs.dose && <FieldError>{errs.dose}</FieldError>}
        </Field>
        <Field>
          <FieldLabel className="text-xs">Frequency</FieldLabel>
          <NativeSelect value={draft.freq} onChange={(ev) => set({ freq: ev.target.value as RxDraft["freq"] })} className="h-8 text-sm">
            {FREQS.map((f) => <NativeSelectOption key={f.code} value={f.code}>{f.code} — {f.label}</NativeSelectOption>)}
          </NativeSelect>
        </Field>
        <Field data-invalid={Boolean(errs.days) || undefined}>
          <FieldLabel className="text-xs">Duration (days)<RequiredMark /></FieldLabel>
          <Input inputMode="numeric" value={draft.days} onChange={(ev) => set({ days: ev.target.value })} className="clinic-num h-8 text-sm" />
          {errs.days && <FieldError>{errs.days}</FieldError>}
        </Field>
        <Field>
          <FieldLabel className="text-xs">Route</FieldLabel>
          <NativeSelect value={draft.route} onChange={(ev) => set({ route: ev.target.value })} className="h-8 text-sm">
            {ROUTES.map((r) => <NativeSelectOption key={r} value={r}>{r}</NativeSelectOption>)}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel className="text-xs">Quantity (calculated)</FieldLabel>
          <Input readOnly value={drug ? `${qty} ${drug.form}` : "—"} className="clinic-num h-8 text-sm read-only:bg-things-blue-soft/50" />
        </Field>
        <Field>
          <FieldLabel className="text-xs">Line total</FieldLabel>
          <Input readOnly value={drug ? thb(qty * drug.price) : "—"} className="clinic-num h-8 text-sm read-only:bg-things-blue-soft/50" />
        </Field>
        <FormRow columns={1}>
          <Field>
            <FieldLabel className="text-xs">Patient instructions</FieldLabel>
            <Input value={draft.instructions} onChange={(ev) => set({ instructions: ev.target.value })} placeholder="e.g. หลังอาหาร (after meals)" className="h-8 text-sm" />
          </Field>
        </FormRow>
        {hit?.level === "critical" && (
          <FormRow columns={1}>
            <Field data-invalid={Boolean(tried && errs.override) || undefined}>
              <FieldLabel className="text-xs">Override reason<RequiredMark /></FieldLabel>
              <Input value={draft.override} onChange={(ev) => set({ override: ev.target.value })} className="h-8 text-sm" />
              {tried && errs.override && <FieldError>{errs.override}</FieldError>}
            </Field>
          </FormRow>
        )}
        {hit?.level === "warn" && (
          <FormRow columns={1}>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.acknowledged} onChange={(ev) => set({ acknowledged: ev.target.checked })} className="size-3.5 accent-things-blue" />
              I have reviewed the cross-reactivity risk
            </label>
            {tried && errs.acknowledged && <FieldError>{errs.acknowledged}</FieldError>}
          </FormRow>
        )}
        <FormRow columns={1}>
          <div><Button size="sm" variant="outline" onClick={add}><Plus className="size-4" />Add to order</Button></div>
        </FormRow>
      </FormSection>

      <section>
        <SectionHeader title="Pending orders" meta={`${s.rx.length} item${s.rx.length === 1 ? "" : "s"} · ${thb(rxTotal(s.rx))}`} />
        <DataTable
          columns={[
            { id: "drug", header: "Drug", cell: (r) => <>{r.drug.name} {r.drug.strength}{r.allergy && <span className={cn("ml-1.5 text-[11px] font-semibold", r.allergy.level === "critical" ? "text-clinic-critical" : "text-clinic-warn")}>⚠ override</span>}</> },
            { id: "sig", header: "Sig", cell: (r) => `${r.dose} ${r.drug.form} ${r.freq} × ${r.days} d` },
            { id: "qty", header: "Qty", numeric: true, width: 56, cell: (r) => r.qty },
            { id: "total", header: "Total", numeric: true, width: 88, cell: (r) => thb(r.qty * r.drug.price) },
            { id: "x", header: "", width: 40, cell: (r) => <Button size="icon-xs" variant="ghost" aria-label={`Remove ${r.drug.name}`} onClick={() => s.removeRx(r.id)}><Trash2 /></Button> },
          ]}
          rows={s.rx}
          rowKey={(r) => r.id}
          emptyState={<p className="p-4 text-center text-sm text-things-gray-3">No prescriptions yet.</p>}
        />
      </section>

      <FormActionBar
        primary={{ label: "Sign & send…", onSelect: () => setConfirm(true), disabled: s.rx.length === 0, reason: "Add at least one prescription" }}
        secondary={[{ label: "Back to visit", onSelect: () => s.go("visit") }]}
        dirty={s.rx.length > 0}
        shortcuts={false}
      />

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign {s.rx.length} prescription{s.rx.length === 1 ? "" : "s"} for {formatName(p.name)}?</AlertDialogTitle>
            <AlertDialogDescription>
              Sends to {PHARMACY} and closes today's visit. A signed prescription can only be changed by a new, countersigned order. Total {thb(rxTotal(s.rx))}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={s.sign}>Sign & send</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
