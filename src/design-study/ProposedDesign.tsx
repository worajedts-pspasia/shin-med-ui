// Variants B (macOS 27) and C (Windows 11 / Fluent 2) — the proposals.
// Shell stays the real AppShell + LauncherRail (re-skinned by study.css, not
// forked). Page content is hand-composed from ./primitives. Structure only
// branches where the platforms genuinely differ:
//   macOS 27  — sidebar material to the window edge, one unified glass
//               toolbar per workspace (title + subtitle), grouped forms with
//               labels on the left, zebra tables, alert-sheet dialogs.
//   Windows 11 — app title bar with global search (Mica), command bar under a
//               20px page title, cards with labels above inputs, 4px controls,
//               NavigationView pill indicator, ContentDialog over smoke.

import {
  ArrowLeft, ArrowRight, Bell, CircleCheck, Clock, Download, Info as InfoIcon, ListFilter, Pill, Plus, Printer,
  Save, Send, SlidersHorizontal, Stethoscope, Trash2, TriangleAlert, UserPlus, Users, Wallet, X,
} from "lucide-react"
import { useCallback, useLayoutEffect, useState } from "react"
import { AppShell } from "@/components/clinic/AppShell"
import { LauncherRail } from "@/components/clinic/LauncherRail"
import type { Tone } from "@/components/clinic/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { fixtureLauncherModuleGroups, fixtureLauncherModules } from "@/fixtures/clinic"
import { STUDY_SECTIONS } from "./CurrentDesign"
import {
  FREQS, PHARMACY, PROVIDERS, ROUTES, SCHEMES, STATUS_LABEL, ageOf, drugLabel, formatName, visitHistory,
  type CurrentMed, type PastVisit, type RegPatient, type TodayStatus,
} from "./data"
import { Badge, Btn, Combo, Dialog, Group, Info, Pager, Row, SearchField, Segmented, Table, type Col } from "./primitives"
import {
  LISTS, PAGES, PAGE_SIZE, VITALS, bmiOf, emptyRx, encounterErrors, findDrug, runQuery, rxErrors, rxQty, rxTotal,
  searchDrugs, searchIcd, thb, toneGlyph, useScenario, vitalTone, type ListId, type Page, type RxDraft, type SortKey,
} from "./scenario"
import "./study.css"

export type Lang = "mac27" | "win11"
type Mode = "light" | "dark"
type Glass = "clear" | "medium" | "tinted"

interface Look {
  lang: Lang
  mode: Mode
  setMode: (m: Mode) => void
  glass: Glass
  setGlass: (g: Glass) => void
  borders: boolean
  setBorders: (b: boolean) => void
}

export function ProposedDesignApp({ lang, initialMode = "light", initialGlass = "medium" }: { lang: Lang; initialMode?: Mode; initialGlass?: Glass }) {
  const s = useScenario()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [glass, setGlass] = useState<Glass>(initialGlass)
  const [borders, setBorders] = useState(false)
  const look: Look = { lang, mode, setMode, glass, setGlass, borders, setBorders }

  // Theme lives on <html> so portaled UI (rail flyout, tooltips) is themed too.
  useLayoutEffect(() => {
    const h = document.documentElement
    h.dataset.study = lang
    h.dataset.mode = mode
    h.dataset.glass = glass
    h.dataset.borders = borders ? "on" : "off"
    h.classList.toggle("dark", mode === "dark")
    return () => {
      for (const k of ["study", "mode", "glass", "borders"]) delete h.dataset[k]
      h.classList.remove("dark")
    }
  }, [lang, mode, glass, borders])

  const chart = s.page !== "registry"

  return (
    <div className="st-app flex h-[100dvh] flex-col overflow-hidden">
      {lang === "win11" && <TitleBar look={look} />}
      <div className="min-h-0 flex-1">
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
          context={chart ? <QueuePane /> : <ListsPane />}
          inspector={s.page === "registry" ? <PatientPane /> : s.page === "visit" ? <HistoryPane /> : <OrderSummaryPane />}
          footer={
            <div className="st-statusbar">
              <span>{s.patients.length} registered</span>
              <span>{s.patients.filter((p) => p.status === "arrived").length} waiting</span>
              <span className="ml-auto">Dr. Test Physician</span>
              <Badge tone="warn">Training</Badge>
              <span>Variant {lang === "mac27" ? "B · macOS 27" : "C · Windows 11"}</span>
            </div>
          }
        >
          {s.page === "registry" && <RegistryPage look={look} />}
          {s.page === "visit" && <VisitPage look={look} />}
          {s.page === "orders" && <OrdersPage look={look} />}
        </AppShell>
      </div>
    </div>
  )
}

/* ——— chrome ————————————————————————————————————————————————— */

function TitleBar({ look }: { look: Look }) {
  const s = useScenario()
  return (
    <header className="st-titlebar">
      <div className="st-titlebar__app">
        <span className="st-titlebar__logo" aria-hidden="true" />
        <span>Shin Clinic</span>
        <Badge tone="warn">Training</Badge>
      </div>
      <SearchField
        className="st-titlebar__search"
        placeholder="Search patients by name, MRN or phone"
        aria-label="Search patients"
        value={s.query.text}
        onChange={(e) => {
          s.setQuery({ text: e.target.value, list: e.target.value ? "all" : s.query.list })
          if (s.page !== "registry") s.go("registry")
        }}
      />
      <div className="flex min-w-[200px] items-center justify-end gap-1">
        <Btn icon variant="subtle" aria-label="Notifications"><Bell /></Btn>
        <AppearanceMenu look={look} />
        <span className="st-avatar" aria-label="Dr. Test Physician">TP</span>
      </div>
    </header>
  )
}

function AppearanceMenu({ look }: { look: Look }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Btn icon variant="subtle" aria-label="Appearance"><SlidersHorizontal /></Btn>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="st-flyout">
          <h4>Appearance</h4>
          <label>
            Mode
            <Segmented label="Mode" value={look.mode} onChange={look.setMode} options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
          </label>
          {look.lang === "mac27" && (
            <label>
              Liquid Glass
              <Segmented label="Liquid Glass" value={look.glass} onChange={look.setGlass} options={[{ value: "clear", label: "Clear" }, { value: "medium", label: "Medium" }, { value: "tinted", label: "Tinted" }]} />
            </label>
          )}
          <label>
            {look.lang === "mac27" ? "Show borders" : "Contrast strokes"}
            <input type="checkbox" className="st-check" checked={look.borders} onChange={(e) => look.setBorders(e.target.checked)} />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function Steps() {
  const s = useScenario()
  return (
    <nav className="st-steps" aria-label="Scenario steps">
      {PAGES.map((p, i) => (
        <span key={p.id} className="contents">
          {i > 0 && <span className="st-dim" aria-hidden="true">›</span>}
          <button aria-current={s.page === p.id ? "step" : undefined} onClick={() => s.go(p.id)}>
            <i>{p.step}</i>{p.short}
          </button>
        </span>
      ))}
    </nav>
  )
}

/** Page header. macOS: one glass toolbar row. Windows: title row + command bar row. */
function PageBar({
  look, title, subtitle, commands, trailing, below,
}: {
  look: Look
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Primary page commands (CommandBar on Windows, toolbar items on macOS). */
  commands?: React.ReactNode
  /** macOS-only trailing items (search). Windows puts search in the title bar. */
  trailing?: React.ReactNode
  /** Sticky content under the bar that must never scroll away (allergy). */
  below?: React.ReactNode
}) {
  if (look.lang === "mac27")
    return (
      <div className="st-toolbar flex-col !items-stretch gap-1.5">
        <div className="flex items-center gap-2">
          <div className="st-toolbar__title">
            <b>{title}</b>
            {subtitle && <small>{subtitle}</small>}
          </div>
          <Steps />
          <div className="ml-auto flex items-center gap-1">
            {commands}
            {trailing}
            <AppearanceMenu look={look} />
          </div>
        </div>
        {below}
      </div>
    )
  return (
    <div className="st-toolbar flex-col !items-stretch gap-2 !pt-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="st-toolbar__title !mr-0">
          <b>{title}</b>
          {subtitle && <small>{subtitle}</small>}
        </div>
        <div className="ml-auto"><Steps /></div>
      </div>
      {commands && <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Commands">{commands}</div>}
      {below}
    </div>
  )
}

const initials = (p: RegPatient) => (p.name.given[0] ?? "") + (p.name.family[0] ?? "")
const patientMeta = (p: RegPatient) => `MRN ${p.mrn} · ${ageOf(p.dob)} y ${p.sex === "male" ? "M" : "F"} · DOB ${p.dob} · ${p.scheme}`

function AllergyStrip({ p }: { p: RegPatient }) {
  // Never dismissible, never collapsed, no entrance animation (spec 02 §4.2).
  if (p.allergies.length === 0)
    return <Info tone="warn" icon={TriangleAlert} title="Allergies not recorded.">Ask the patient and record before prescribing.</Info>
  return (
    <Info tone="crit" icon={TriangleAlert} title={`Allergy: ${p.allergies.map((a) => a.allergen).join(", ")}`}>
      <span className="st-muted">— {p.allergies.map((a) => `${a.reaction ?? "reaction n/r"}, ${a.severity ?? "severity n/r"}`).join("; ")}</span>
    </Info>
  )
}

/* ——— panes ————————————————————————————————————————————————— */

const LIST_ICON: Record<ListId, typeof Users> = {
  today: Clock, waiting: Clock, "in-room": Stethoscope, done: CircleCheck, allergy: TriangleAlert, balance: Wallet, all: Users,
}

function ListsPane() {
  const s = useScenario()
  return (
    <nav className="st-list" aria-label="Patient lists">
      <div className="st-list__title">Lists</div>
      {LISTS.map((l) => {
        const Icon = LIST_ICON[l.id]
        return (
          <button key={l.id} aria-current={s.query.list === l.id || undefined} onClick={() => s.setQuery({ list: l.id, text: "" })}>
            <Icon aria-hidden="true" />
            {l.label}
            <span className="st-count">{s.patients.filter(l.test).length}</span>
          </button>
        )
      })}
    </nav>
  )
}

function QueuePane() {
  const s = useScenario()
  const queue = s.patients.filter((p) => p.status === "arrived" || p.status === "in-room" || p.status === "held")
  return (
    <nav className="st-list" aria-label="Today's queue">
      <div className="st-list__title">Queue · {queue.length}</div>
      {queue.map((p) => (
        <button key={p.id} aria-current={s.patient.id === p.id || undefined} onClick={() => s.go("visit", p.id)} title={formatName(p.name)}>
          <span className="st-dot" style={{ color: p.status === "in-room" ? "var(--st-accent)" : "var(--st-text-3)" }} aria-hidden="true" />
          <span className="truncate">{formatName(p.name)}</span>
          <span className="st-count">{p.status === "in-room" ? "exam" : `${p.waitMinutes ?? 0}m`}</span>
        </button>
      ))}
    </nav>
  )
}

function PatientPane() {
  const s = useScenario()
  const p = s.patient
  return (
    <div className="st-pane">
      <div className="st-pane-title">Selected patient</div>
      <div className="st-group__body">
        <div className="st-identity">
          <span className="st-avatar">{initials(p)}</span>
          <div className="min-w-0">
            <b className="truncate">{formatName(p.name)}</b>
            <small>MRN {p.mrn}</small>
          </div>
        </div>
        <dl className="st-kv">
          <dt>Age / sex</dt><dd>{ageOf(p.dob)} y · {p.sex}</dd>
          <dt>DOB</dt><dd className="clinic-num">{p.dob}</dd>
          <dt>Phone</dt><dd className="clinic-num">{p.phone}</dd>
          <dt>Scheme</dt><dd>{p.scheme}</dd>
          <dt>Provider</dt><dd>{p.provider}</dd>
          <dt>Visits</dt><dd className="clinic-num">{p.visitCount} · last {p.lastVisit}</dd>
          <dt>Balance</dt><dd className="clinic-num">{p.balance ? thb(p.balance) : "—"}</dd>
          <dt>Allergies</dt>
          <dd className="flex flex-wrap gap-1">{p.allergies.length ? p.allergies.map((a) => <Badge key={a.allergen} tone="crit">⚠ {a.allergen}</Badge>) : <span className="st-muted">None recorded</span>}</dd>
        </dl>
      </div>
      <Btn variant="primary" onClick={() => s.go("visit", p.id)}>Open visit <ArrowRight /></Btn>
    </div>
  )
}

function HistoryPane() {
  const s = useScenario()
  const cols: Array<Col<PastVisit>> = [
    { id: "date", header: "Date", cell: (r) => <span className="clinic-num">{r.date}</span> },
    { id: "dx", header: "Dx", cell: (r) => <span className="st-mono" title={r.dx.term}>{r.dx.code}</span> },
    { id: "bp", header: "BP", num: true, cell: (r) => `${r.bp[0]}/${r.bp[1]}` },
  ]
  return (
    <div className="st-pane">
      <div className="st-pane-title">Visit history</div>
      <div className="st-group__body st-group__body--flush">
        <Table label="Visit history" columns={cols} rows={visitHistory(s.patient)} rowKey={(r) => r.id} />
      </div>
      <div className="st-pane-title">Current medications</div>
      <div className="st-group__body">
        <ul className="st-chips">
          {s.meds.map((m) => (
            <li key={m.id}><span className="flex-1">{m.drug} {m.dose}</span><span className="st-dim text-[11px]">{m.sig}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function OrderSummaryPane() {
  const s = useScenario()
  const overrides = s.rx.filter((r) => r.allergy).length
  return (
    <div className="st-pane">
      <div className="st-pane-title">Order summary</div>
      <div className="st-group__body">
        <dl className="st-kv">
          <dt>Prescriptions</dt><dd className="clinic-num">{s.rx.length}</dd>
          <dt>Allergy overrides</dt><dd className="clinic-num">{overrides ? <Badge tone="crit">⚠ {overrides}</Badge> : "0"}</dd>
          <dt>Stopped meds</dt><dd className="clinic-num">{s.meds.filter((m) => m.decision === "stop").length}</dd>
          <dt>Pharmacy</dt><dd>{PHARMACY}</dd>
          <dt>Diagnoses</dt><dd>{s.encounter.diagnoses.map((d) => d.code).join(", ") || "—"}</dd>
        </dl>
        <div className="st-total"><span>Total</span><span>{thb(rxTotal(s.rx))}</span></div>
      </div>
    </div>
  )
}

/* ——— page 1: registry ——————————————————————————————————————— */

function statusBadge(st: TodayStatus) {
  if (st === null) return <span className="st-dim">—</span>
  // flow, not severity: accent/neutral only (spec 03 — severity colours mean severity)
  const tone = st === "arrived" || st === "in-room" ? "accent" : undefined
  return (
    <Badge tone={tone} className={cn(st === "cancelled" && "line-through opacity-70")}>
      {st === "done" ? <CircleCheck className="size-3" aria-hidden="true" /> : <span className="st-dot" aria-hidden="true" />}
      {STATUS_LABEL[st]}
    </Badge>
  )
}

function RegistryPage({ look }: { look: Look }) {
  const s = useScenario()
  const q = s.query
  const res = runQuery(s.patients, q)
  const list = LISTS.find((l) => l.id === q.list)!
  const today = s.patients.filter((p) => p.status !== null)
  const waiting = s.patients.filter((p) => p.status === "arrived")
  const avgWait = waiting.length ? Math.round(waiting.reduce((a, p) => a + (p.waitMinutes ?? 0), 0) / waiting.length) : 0
  const onSort = (id: string) => s.setQuery({ sort: { id: id as SortKey, dir: q.sort.id === id && q.sort.dir === "asc" ? "desc" : "asc" }, page: q.page })
  const nSel = s.selection.length

  const cols: Array<Col<RegPatient>> = [
    { id: "mrn", header: "MRN", sortable: true, width: 72, cell: (r) => <span className="st-mono">{r.mrn}</span> },
    {
      id: "name", header: "Patient", sortable: true, cell: (r) => (
        <span className="inline-flex items-center gap-2">
          <button type="button" className="st-link" onClick={(e) => { e.stopPropagation(); s.go("visit", r.id) }}>{formatName(r.name)}</button>
          {r.allergies.length > 0 && <Badge tone="crit">⚠ {r.allergies[0].allergen}</Badge>}
        </span>
      ),
    },
    { id: "age", header: "Age", sortable: true, num: true, width: 56, cell: (r) => `${ageOf(r.dob)} ${r.sex === "male" ? "M" : "F"}` },
    { id: "scheme", header: "Scheme", sortable: true, optional: true, width: 76, cell: (r) => r.scheme },
    { id: "provider", header: "Provider", sortable: true, optional: true, cell: (r) => <span className="st-muted">{r.provider}</span> },
    { id: "status", header: "Today", sortable: true, width: 112, cell: (r) => statusBadge(r.status) },
    {
      id: "arrivedAt", header: "Arrived", sortable: true, num: true, width: 92, cell: (r) =>
        r.arrivedAt ? (
          <span>
            {r.arrivedAt}
            {r.waitMinutes !== undefined && <span className={cn("st-muted", r.waitMinutes > 30 && "font-semibold")}> · {r.waitMinutes}m</span>}
          </span>
        ) : <span className="st-dim">—</span>,
    },
    { id: "balance", header: "Balance", sortable: true, num: true, width: 92, cell: (r) => (r.balance ? thb(r.balance) : <span className="st-dim">—</span>) },
  ]

  const filters = (
    <>
      <select className="st-select !w-auto" aria-label="Scheme" value={q.scheme} onChange={(e) => s.setQuery({ scheme: e.target.value as typeof q.scheme })}>
        <option value="any">All schemes</option>
        {SCHEMES.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
      <select className="st-select !w-auto" aria-label="Provider" value={q.provider} onChange={(e) => s.setQuery({ provider: e.target.value })}>
        <option value="any">All providers</option>
        {PROVIDERS.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
    </>
  )

  return (
    <>
      <PageBar
        look={look}
        title={look.lang === "mac27" ? "Patients" : "Patient registry"}
        subtitle={`${list.label} · ${res.total} of ${s.patients.length}`}
        commands={
          look.lang === "mac27" ? (
            <>
              {nSel > 0 && <Btn variant="subtle" onClick={s.clearSelection}><Printer />Print {nSel} label{nSel === 1 ? "" : "s"}</Btn>}
              <Btn icon variant="subtle" aria-label="Register patient"><UserPlus /></Btn>
            </>
          ) : (
            <>
              <Btn variant="primary"><Plus />New patient</Btn>
              <span className="st-sep" />
              <Btn variant="subtle" disabled={nSel === 0}><Printer />Print labels{nSel ? ` (${nSel})` : ""}</Btn>
              <Btn variant="subtle"><Download />Export</Btn>
              {nSel > 0 && <Btn variant="subtle" onClick={s.clearSelection}><X />Clear selection</Btn>}
              <span className="ml-auto inline-flex items-center gap-2"><ListFilter className="size-4 st-muted" aria-hidden="true" />{filters}</span>
            </>
          )
        }
        trailing={<SearchField className="w-56" placeholder="Name, MRN, phone" aria-label="Search patients" value={q.text} onChange={(e) => s.setQuery({ text: e.target.value, list: e.target.value ? "all" : q.list })} />}
      />

      {s.flash && (
        <Info tone="ok" icon={CircleCheck} title="Signed." className="mb-3" live action={<Btn variant="subtle" icon aria-label="Dismiss" onClick={s.dismissFlash}><X /></Btn>}>
          {s.flash.text}
        </Info>
      )}

      <div className="st-stats" role="list" aria-label="Today">
        <div className="st-stat" role="listitem"><b>{today.length}</b><span>Visits today</span></div>
        <div className="st-stat" role="listitem"><b>{waiting.length}</b><span>Waiting</span></div>
        <div className="st-stat" role="listitem"><b>{s.patients.filter((p) => p.status === "in-room").length}</b><span>In exam</span></div>
        <div className="st-stat" role="listitem"><b>{avgWait}m</b><span>Average wait</span></div>
        <div className="st-stat" role="listitem"><b>{thb(s.patients.reduce((a, p) => a + p.balance, 0)).replace(".00", "")}</b><span>Outstanding</span></div>
        {look.lang === "mac27" && <div className="ml-auto flex items-end gap-2">{filters}</div>}
      </div>

      <Group title={list.label} description={`${res.total} patients · double-click or Enter opens the visit`} flush>
        <Table
          label="Patient registry"
          columns={cols}
          rows={res.rows}
          rowKey={(r) => r.id}
          sort={q.sort}
          onSort={onSort}
          selectedId={s.patient.id}
          onRowClick={(r) => s.go("registry", r.id)}
          onRowOpen={(r) => s.go("visit", r.id)}
          checked={s.selection}
          onCheck={s.toggleSelection}
          rowClass={(r) => (s.flash?.patientId === r.id ? "is-flash" : undefined)}
          empty="No patients match these filters."
        />
      </Group>
      <Pager page={res.page} pageCount={res.pageCount} total={res.total} size={PAGE_SIZE} onPage={(n) => s.setQuery({ page: n })} />
    </>
  )
}

/* ——— page 2: visit ——————————————————————————————————————————— */

const toneBadge = (t: Tone) => (t === "critical" ? "crit" : t === "warn" ? "warn" : undefined)

function VisitPage({ look }: { look: Look }) {
  const s = useScenario()
  const p = s.patient
  const e = s.encounter
  const errs = encounterErrors(e)
  const [touched, setTouched] = useState(false)
  const valid = Object.keys(errs).length === 0
  const err = (k: keyof typeof errs) => (touched || (k !== "diagnoses" && k !== "chiefComplaint" && e.vitals[k as keyof typeof e.vitals] !== "")) && errs[k]
  const mac = look.lang === "mac27"

  return (
    <>
      <PageBar
        look={look}
        title={mac ? formatName(p.name) : <span className="inline-flex items-center gap-3"><span className="st-avatar">{initials(p)}</span>{formatName(p.name)}</span>}
        subtitle={patientMeta(p)}
        commands={
          mac ? (
            <Btn variant="subtle" icon aria-label="Print visit summary"><Printer /></Btn>
          ) : (
            <>
              <Btn variant="subtle" onClick={s.saveEncounter}><Save />Save draft</Btn>
              <Btn variant="subtle"><Printer />Print summary</Btn>
              <span className="st-sep" />
              <Btn variant="subtle" onClick={() => s.go("registry")}><ArrowLeft />Registry</Btn>
            </>
          )
        }
        below={<AllergyStrip p={p} />}
      />

      <div className="st-groups st-groups--2">
        <div>
          <Group title="Vital signs" description="Triage 08:21 · re-enter if re-measured" cols={4}>
            {VITALS.map((v) => {
              const raw = e.vitals[v.key]
              const tone = vitalTone(v.key, raw)
              const glyph = toneGlyph(v.key, raw, tone)
              const id = `v-${v.key}`
              return (
                <Row key={v.key} label={<span title={v.label}>{mac ? v.label : v.abbr}</span>} required={v.required} error={err(v.key)} htmlFor={id}>
                  <span className="st-field">
                    <input id={id} inputMode="decimal" className={cn("st-input clinic-num", tone !== "none" && tone !== "ok" && "font-semibold")}
                      style={{ color: tone === "critical" ? "var(--st-crit)" : tone === "warn" ? "var(--st-warn)" : undefined, maxWidth: mac ? 88 : undefined }}
                      aria-invalid={Boolean(err(v.key)) || undefined} aria-describedby={glyph ? `${id}-flag` : undefined}
                      value={raw} onChange={(ev) => s.setVital(v.key, ev.target.value)} />
                    <span className="st-field__unit">{v.unit}</span>
                    {glyph && <Badge tone={toneBadge(tone)}><span id={`${id}-flag`} aria-label={tone === "critical" ? "critical" : "abnormal"}>{glyph}</span></Badge>}
                  </span>
                </Row>
              )
            })}
            <Row label={mac ? "BMI (derived)" : "BMI"}>
              <span className="st-field"><input className="st-input clinic-num" readOnly value={bmiOf(e)} style={{ maxWidth: 88 }} /><span className="st-field__unit">kg/m²</span></span>
            </Row>
          </Group>

          <Group title="Presenting problem" cols={2}>
            <Row label="Chief complaint" required error={err("chiefComplaint")} stack span={2} htmlFor="cc">
              <textarea id="cc" className="st-textarea" rows={2} value={e.chiefComplaint} aria-invalid={Boolean(err("chiefComplaint")) || undefined} onChange={(ev) => s.updateEncounter({ chiefComplaint: ev.target.value })} />
            </Row>
            <Row label="Triage">
              <Segmented label="Triage" value={e.triage} onChange={(v) => s.updateEncounter({ triage: v })} options={[{ value: "routine", label: "Routine" }, { value: "rush", label: "Rush" }, { value: "urgent", label: "Urgent" }]} />
            </Row>
            <Row label="Follow-up" htmlFor="fu">
              <input id="fu" type="date" className="st-input" value={e.followUp} onChange={(ev) => s.updateEncounter({ followUp: ev.target.value })} style={{ maxWidth: 170 }} />
            </Row>
          </Group>
        </div>

        <div>
          <Group title="Diagnosis" description="ICD-10 · first is primary" cols={1}>
            <Row label="Add diagnosis" required error={err("diagnoses")} stack={!mac} htmlFor="dx">
              <Combo id="dx" label="Search ICD-10" placeholder="Code or term, e.g. J02" search={searchIcd} invalid={Boolean(err("diagnoses"))}
                onPick={(c) => s.updateEncounter({ diagnoses: [...e.diagnoses.filter((d) => d.code !== c.code), c] })} />
            </Row>
            {e.diagnoses.length > 0 && (
              <div className={mac ? "st-row st-row--stack" : "st-row"} style={{ ["--st-span" as string]: 1 }}>
                <ul className="st-chips rounded-[var(--st-r-control)] border border-[var(--st-stroke)]">
                  {e.diagnoses.map((d, i) => (
                    <li key={d.code}>
                      <span className="st-mono" style={{ minWidth: 56 }}>{d.code}</span>
                      <span className="min-w-0 flex-1 truncate" title={d.term}>{d.term} <span className="st-dim text-[11px]">{d.localTerm}</span></span>
                      {i === 0 ? <Badge tone="accent">Primary</Badge> : <Btn variant="subtle" className="!h-6 !px-2 !text-[11px]" onClick={() => s.updateEncounter({ diagnoses: [d, ...e.diagnoses.filter((x) => x.code !== d.code)] })}>Make primary</Btn>}
                      <Btn icon variant="subtle" className="!size-6" aria-label={`Remove ${d.code}`} onClick={() => s.updateEncounter({ diagnoses: e.diagnoses.filter((x) => x.code !== d.code) })}><X /></Btn>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Group>

          <Group title="Clinical note" cols={1}>
            <Row label={mac ? "Assessment & plan" : "Examination, assessment and plan"} stack htmlFor="note">
              <textarea id="note" className="st-textarea" rows={7} value={e.note} placeholder="Findings, assessment, plan…" onChange={(ev) => s.updateEncounter({ note: ev.target.value })} />
            </Row>
          </Group>
        </div>
      </div>

      <div className="st-actions">
        <span className="st-actions__status">
          {s.encounterDirty ? <><span className="st-dot" style={{ color: "var(--color-things-gold)" }} aria-hidden="true" />Unsaved changes</> : s.savedAt ? <>Draft saved {s.savedAt}</> : null}
          {touched && !valid && <Badge tone="crit">{Object.keys(errs).length} field{Object.keys(errs).length === 1 ? "" : "s"} need attention</Badge>}
        </span>
        <Btn onClick={() => s.go("registry")}>Cancel</Btn>
        {mac && <Btn onClick={s.saveEncounter}>Save Draft</Btn>}
        <Btn variant="primary" onClick={() => (valid ? s.go("orders") : setTouched(true))}>
          {mac ? "Continue to Orders" : "Continue to orders"} <ArrowRight />
        </Btn>
      </div>
    </>
  )
}

/* ——— page 3: orders ——————————————————————————————————————————— */

function OrdersPage({ look }: { look: Look }) {
  const s = useScenario()
  const p = s.patient
  const mac = look.lang === "mac27"
  const [draft, setDraft] = useState<RxDraft>(emptyRx())
  const [tried, setTried] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const closeConfirm = useCallback(() => setConfirm(false), [])
  const { errs, drug, hit } = rxErrors(draft, p.allergies)
  const qty = rxQty(drug, Number(draft.dose), draft.freq, Number(draft.days))
  const set = (patch: Partial<RxDraft>) => setDraft((d) => ({ ...d, ...patch }))
  const show = (k: keyof RxDraft) => (tried || k === "dose" || k === "days") && errs[k]

  const add = () => {
    setTried(true)
    if (Object.keys(errs).length || !drug) return
    s.addRx({ drug, dose: Number(draft.dose), freq: draft.freq, days: Number(draft.days), route: draft.route, qty, instructions: draft.instructions, allergy: hit, override: draft.override || undefined })
    setDraft(emptyRx())
    setTried(false)
  }

  const medCols: Array<Col<CurrentMed>> = [
    { id: "drug", header: "Medication", cell: (r) => <span className={cn(r.decision === "stop" && "line-through st-muted")}>{r.drug} {r.dose}</span> },
    { id: "sig", header: "Sig", cell: (r) => <span className="st-muted">{r.sig}</span> },
    { id: "since", header: "Since", num: true, optional: true, width: 90, cell: (r) => r.since },
    { id: "by", header: "Prescriber", optional: true, cell: (r) => <span className="st-muted">{r.prescriber}</span> },
    {
      id: "decision", header: "Decision", width: 210, cell: (r) => (
        <Segmented label={`Decision for ${r.drug}`} value={r.decision} tone={r.decision === "stop" ? "danger" : r.decision === "hold" ? "warn" : undefined}
          onChange={(v) => s.setMedDecision(r.id, v)} options={[{ value: "continue", label: "Continue" }, { value: "hold", label: "Hold" }, { value: "stop", label: "Stop" }]} />
      ),
    },
  ]

  return (
    <>
      <PageBar
        look={look}
        title={mac ? formatName(p.name) : <span className="inline-flex items-center gap-3"><span className="st-avatar">{initials(p)}</span>{formatName(p.name)}</span>}
        subtitle={`${patientMeta(p)} · Dx ${s.encounter.diagnoses.map((d) => d.code).join(", ") || "—"}`}
        commands={
          mac ? undefined : (
            <>
              <Btn variant="subtle" onClick={() => s.go("visit")}><ArrowLeft />Back to visit</Btn>
              <Btn variant="subtle"><Printer />Print prescription</Btn>
            </>
          )
        }
        below={<AllergyStrip p={p} />}
      />

      <Group title="Current medications" description="Reconcile before adding new orders" flush>
        <Table label="Current medications" columns={medCols} rows={s.meds} rowKey={(r) => r.id} />
      </Group>

      <Group title="New prescription" cols={4} action={<Badge tone="accent"><Pill className="size-3" aria-hidden="true" />{PHARMACY}</Badge>}>
        <Row label="Drug" required error={show("drugCode")} span={4} stack={!mac} htmlFor="drug">
          {drug ? (
            <span className="flex items-center gap-2">
              <b className="font-semibold">{drugLabel(drug)}</b>
              <span className="st-dim text-[11px]">{drug.localName} · {thb(drug.price)}/{drug.form}</span>
              <Btn variant="subtle" className="ml-auto" onClick={() => set({ drugCode: "", override: "", acknowledged: false })}>Change</Btn>
            </span>
          ) : (
            <Combo id="drug" label="Search drug" placeholder="Name or code, e.g. amox" search={searchDrugs} invalid={Boolean(show("drugCode"))}
              onPick={(c) => { const d = findDrug(c.code); set({ drugCode: c.code, freq: d?.defaultFreq ?? draft.freq, override: "", acknowledged: false }) }} />
          )}
        </Row>
        {hit && (
          <div className="st-row st-row--stack" style={{ ["--st-span" as string]: 4 }}>
            <Info live tone={hit.level === "critical" ? "crit" : "warn"} icon={TriangleAlert} title={hit.level === "critical" ? "Contraindicated — allergy." : "Caution — cross-reactivity."}>
              {hit.message}
            </Info>
          </div>
        )}
        <Row label="Dose" required error={show("dose")} htmlFor="dose">
          <span className="st-field"><input id="dose" inputMode="decimal" className="st-input clinic-num" style={{ maxWidth: 80 }} value={draft.dose} onChange={(ev) => set({ dose: ev.target.value })} /><span className="st-field__unit">{drug?.form ?? "unit"}</span></span>
        </Row>
        <Row label="Frequency" htmlFor="freq">
          <select id="freq" className="st-select" value={draft.freq} onChange={(ev) => set({ freq: ev.target.value as RxDraft["freq"] })}>
            {FREQS.map((f) => <option key={f.code} value={f.code}>{f.code} — {f.label}</option>)}
          </select>
        </Row>
        <Row label="Duration" required error={show("days")} htmlFor="days">
          <span className="st-field"><input id="days" inputMode="numeric" className="st-input clinic-num" style={{ maxWidth: 80 }} value={draft.days} onChange={(ev) => set({ days: ev.target.value })} /><span className="st-field__unit">days</span></span>
        </Row>
        <Row label="Route" htmlFor="route">
          <select id="route" className="st-select" value={draft.route} onChange={(ev) => set({ route: ev.target.value })}>
            {ROUTES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Row>
        <Row label="Instructions" span={mac ? undefined : 2} htmlFor="instr">
          <input id="instr" className="st-input" placeholder="e.g. หลังอาหาร (after meals)" value={draft.instructions} onChange={(ev) => set({ instructions: ev.target.value })} />
        </Row>
        <Row label="Quantity">
          <input className="st-input clinic-num" readOnly value={drug ? `${qty} ${drug.form}` : "—"} />
        </Row>
        <Row label="Line total">
          <input className="st-input clinic-num" readOnly value={drug ? thb(qty * drug.price) : "—"} />
        </Row>
        {hit?.level === "critical" && (
          <Row label="Override reason" required error={show("override")} span={4} stack={!mac} htmlFor="ovr" hint="Recorded in the audit trail with your signature.">
            <input id="ovr" className="st-input" value={draft.override} aria-invalid={Boolean(show("override")) || undefined} onChange={(ev) => set({ override: ev.target.value })} />
          </Row>
        )}
        {hit?.level === "warn" && (
          <Row label="Acknowledge" required error={show("acknowledged")} span={4}>
            <label className="inline-flex items-center gap-2"><input type="checkbox" className="st-check" checked={draft.acknowledged} onChange={(ev) => set({ acknowledged: ev.target.checked })} />I have reviewed the cross-reactivity risk</label>
          </Row>
        )}
        <div className={mac ? "st-row st-row--stack" : "st-row"} style={{ ["--st-span" as string]: 4 }}>
          <div className="flex justify-end"><Btn onClick={add}><Plus />Add to order</Btn></div>
        </div>
      </Group>

      <Group title="Pending orders" description={`${s.rx.length} item${s.rx.length === 1 ? "" : "s"}`} flush>
        <Table
          label="Pending orders"
          rows={s.rx}
          rowKey={(r) => r.id}
          empty="No prescriptions yet — add one above."
          columns={[
            { id: "drug", header: "Drug", cell: (r) => <span className="inline-flex items-center gap-2">{drugLabel(r.drug)}{r.allergy && <Badge tone={r.allergy.level === "critical" ? "crit" : "warn"}>⚠ override</Badge>}</span> },
            { id: "sig", header: "Sig", cell: (r) => <span className="st-muted">{r.dose} {r.drug.form} · {r.freq} · {r.days} d{r.instructions ? ` · ${r.instructions}` : ""}</span> },
            { id: "qty", header: "Qty", num: true, width: 56, cell: (r) => r.qty },
            { id: "unit", header: "Unit", num: true, optional: true, width: 72, cell: (r) => thb(r.drug.price) },
            { id: "total", header: "Total", num: true, width: 92, cell: (r) => thb(r.qty * r.drug.price) },
            { id: "x", header: "", width: 40, cell: (r) => <Btn icon variant="subtle" className="!size-6" aria-label={`Remove ${r.drug.name}`} onClick={() => s.removeRx(r.id)}><Trash2 /></Btn> },
          ]}
        />
        {s.rx.length > 0 && <div className="st-total"><span>Total</span><span>{thb(rxTotal(s.rx))}</span></div>}
      </Group>

      <div className="st-actions">
        <span className="st-actions__status">
          <InfoIcon className="size-3.5" aria-hidden="true" />Signing sends to {PHARMACY} and closes today's visit.
        </span>
        {mac && <Btn onClick={() => s.go("visit")}><ArrowLeft />Back</Btn>}
        <Btn variant="primary" disabled={s.rx.length === 0} onClick={() => setConfirm(true)}><Send />{mac ? "Sign & Send…" : "Sign and send"}</Btn>
      </div>

      <Dialog
        open={confirm}
        onClose={closeConfirm}
        title={`Sign ${s.rx.length} prescription${s.rx.length === 1 ? "" : "s"} for ${formatName(p.name)}?`}
        actions={
          <>
            <Btn data-autofocus onClick={closeConfirm}>Keep editing</Btn>
            <Btn variant="primary" onClick={() => { setConfirm(false); s.sign() }}>Sign and send</Btn>
          </>
        }
      >
        <p>
          Sends {thb(rxTotal(s.rx))} of medication to {PHARMACY} and closes today's visit.
          {s.rx.some((r) => r.allergy) && <> Includes <b style={{ color: "var(--st-crit)" }}>{s.rx.filter((r) => r.allergy).length} allergy override</b>, recorded with your signature.</>}
          {" "}A signed prescription can only be changed by a new, countersigned order.
        </p>
      </Dialog>
    </>
  )
}
