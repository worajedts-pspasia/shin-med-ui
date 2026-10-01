// Design study — the scenario's state and rules, shared by every variant.
// Variants only render; navigation, validation, allergy checks and the
// registry query live here so the three designs are judged on the same
// behaviour.

import { createContext, useContext, useMemo, useState } from "react"
import type { CodedConcept, Tone, Urgency } from "@/components/clinic/types"
import {
  DRUGS, FREQS, ICD10, REGISTRY, TODAY, allergyCheck, currentMeds, featuredPatient, formatName,
  type AllergyHit, type CurrentMed, type Drug, type FreqCode, type MedDecision, type RegPatient, type Scheme,
} from "./data"

export type Page = "registry" | "visit" | "orders"
export const PAGES: Array<{ id: Page; label: string; short: string; step: string }> = [
  { id: "registry", label: "Patient registry", short: "Registry", step: "1" },
  { id: "visit", label: "Visit & assessment", short: "Visit", step: "2" },
  { id: "orders", label: "Orders & prescription", short: "Orders", step: "3" },
]

/* ——— registry query ——————————————————————————————————————— */

export type ListId = "today" | "waiting" | "in-room" | "done" | "allergy" | "balance" | "all"
export const LISTS: Array<{ id: ListId; label: string; test: (p: RegPatient) => boolean }> = [
  { id: "today", label: "Today's visits", test: (p) => p.status !== null },
  { id: "waiting", label: "Waiting", test: (p) => p.status === "arrived" },
  { id: "in-room", label: "In exam", test: (p) => p.status === "in-room" },
  { id: "done", label: "Completed today", test: (p) => p.status === "done" },
  { id: "allergy", label: "Allergy flagged", test: (p) => p.allergies.length > 0 },
  { id: "balance", label: "Outstanding balance", test: (p) => p.balance > 0 },
  { id: "all", label: "All patients", test: () => true },
]

export type SortKey = "mrn" | "name" | "age" | "scheme" | "provider" | "status" | "arrivedAt" | "lastVisit" | "balance"
export interface RegistryQuery {
  list: ListId
  text: string
  scheme: Scheme | "any"
  provider: string
  sort: { id: SortKey; dir: "asc" | "desc" }
  page: number
}
export const PAGE_SIZE = 20

const STATUS_ORDER = { "in-room": 0, arrived: 1, held: 2, done: 3, cancelled: 4 } as const
function sortValue(p: RegPatient, k: SortKey): string | number {
  switch (k) {
    case "name": return formatName(p.name)
    case "age": return p.dob
    case "status": return p.status === null ? 9 : STATUS_ORDER[p.status]
    case "arrivedAt": return p.arrivedAt ?? "99:99"
    case "balance": return p.balance
    default: return p[k]
  }
}

export function runQuery(rows: RegPatient[], q: RegistryQuery) {
  const list = LISTS.find((l) => l.id === q.list)!
  const text = q.text.trim().toLowerCase()
  const filtered = rows.filter(
    (p) =>
      list.test(p) &&
      (q.scheme === "any" || p.scheme === q.scheme) &&
      (q.provider === "any" || p.provider === q.provider) &&
      (!text || formatName(p.name).toLowerCase().includes(text) || p.mrn.includes(text) || p.phone.replace(/-/g, "").includes(text.replace(/-/g, ""))),
  )
  const dir = q.sort.dir === "asc" ? 1 : -1
  // age sorts by dob, so invert it to read as "age ascending"
  const flip = q.sort.id === "age" ? -1 : 1
  filtered.sort((a, b) => {
    const va = sortValue(a, q.sort.id)
    const vb = sortValue(b, q.sort.id)
    return (va < vb ? -1 : va > vb ? 1 : a.mrn < b.mrn ? -1 : 1) * dir * flip
  })
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(q.page, pageCount)
  return { total: filtered.length, pageCount, page, rows: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) }
}

/* ——— encounter (page 2) —————————————————————————————————————— */

export type VitalKey = "sbp" | "dbp" | "pulse" | "temp" | "rr" | "spo2" | "weight" | "height"
export const VITALS: Array<{ key: VitalKey; label: string; abbr: string; unit: string; range: [number, number]; required?: boolean; plausible: [number, number] }> = [
  { key: "sbp", label: "Systolic BP", abbr: "SBP", unit: "mmHg", range: [90, 139], required: true, plausible: [50, 280] },
  { key: "dbp", label: "Diastolic BP", abbr: "DBP", unit: "mmHg", range: [60, 89], required: true, plausible: [30, 180] },
  { key: "pulse", label: "Pulse", abbr: "HR", unit: "/min", range: [60, 100], required: true, plausible: [20, 250] },
  { key: "temp", label: "Temperature", abbr: "Temp", unit: "°C", range: [36.0, 37.5], required: true, plausible: [32, 43] },
  { key: "rr", label: "Respiratory rate", abbr: "RR", unit: "/min", range: [12, 20], plausible: [4, 60] },
  { key: "spo2", label: "SpO₂", abbr: "SpO₂", unit: "%", range: [95, 100], plausible: [50, 100] },
  { key: "weight", label: "Weight", abbr: "BW", unit: "kg", range: [0, 999], plausible: [1, 300] },
  { key: "height", label: "Height", abbr: "Ht", unit: "cm", range: [0, 999], plausible: [30, 250] },
]

export interface Encounter {
  vitals: Record<VitalKey, string>
  chiefComplaint: string
  triage: Urgency
  diagnoses: CodedConcept[]
  note: string
  followUp: string
}

const EMPTY_VITALS: Record<VitalKey, string> = { sbp: "", dbp: "", pulse: "", temp: "", rr: "", spo2: "", weight: "", height: "" }

function seedEncounter(p: RegPatient): Encounter {
  if (p.id === featuredPatient.id)
    return {
      vitals: { sbp: "148", dbp: "96", pulse: "92", temp: "38.4", rr: "20", spo2: "97", weight: "72.5", height: "170" },
      chiefComplaint: "Sore throat and fever for 3 days, painful swallowing",
      triage: "rush",
      diagnoses: [],
      note: "",
      followUp: "2026-10-05",
    }
  return { vitals: { ...EMPTY_VITALS }, chiefComplaint: "", triage: p.urgency, diagnoses: [], note: "", followUp: "" }
}

/** Study ICD-10 list: the shared fixture trio + the scenario's acute codes. */
export const STUDY_ICD: CodedConcept[] = [
  { code: "J02.9", term: "Acute pharyngitis, unspecified", localTerm: "คออักเสบเฉียบพลัน" },
  { code: "J03.90", term: "Acute tonsillitis, unspecified", localTerm: "ต่อมทอนซิลอักเสบเฉียบพลัน" },
  { code: "J06.9", term: "Acute upper respiratory infection, unspecified", localTerm: "ติดเชื้อทางเดินหายใจส่วนบน" },
  { code: "R50.9", term: "Fever, unspecified", localTerm: "ไข้ไม่ทราบสาเหตุ" },
  ...ICD10,
]

export const searchIcd = async (q: string) => {
  const n = q.toLowerCase()
  return STUDY_ICD.filter((c) => c.code.toLowerCase().includes(n) || c.term.toLowerCase().includes(n) || (c.localTerm ?? "").includes(q))
}

export function vitalTone(key: VitalKey, raw: string): Tone {
  const v = Number(raw)
  if (raw === "" || Number.isNaN(v)) return "none"
  if (key === "sbp") return v >= 180 || v < 80 ? "critical" : v >= 140 || v < 90 ? "warn" : "ok"
  if (key === "dbp") return v >= 120 ? "critical" : v >= 90 || v < 60 ? "warn" : "ok"
  if (key === "spo2") return v < 90 ? "critical" : v < 95 ? "warn" : "ok"
  if (key === "temp") return v >= 39.5 || v < 35 ? "critical" : v >= 37.6 ? "warn" : "ok"
  if (key === "pulse") return v >= 130 || v < 40 ? "critical" : v > 100 || v < 60 ? "warn" : "ok"
  if (key === "rr") return v >= 30 || v < 8 ? "critical" : v > 20 || v < 12 ? "warn" : "ok"
  return "none"
}

/** Second channel for severity (spec 02 §4.1): never hue alone. */
export function toneGlyph(key: VitalKey, raw: string, tone: Tone): string {
  if (tone === "none" || tone === "ok") return ""
  const vital = VITALS.find((x) => x.key === key)!
  const high = Number(raw) > vital.range[1]
  return tone === "critical" ? (high ? "▲▲" : "▼▼") : high ? "▲" : "▼"
}

export function bmiOf(e: Encounter): string {
  const w = Number(e.vitals.weight)
  const h = Number(e.vitals.height) / 100
  if (!w || !h) return "—"
  return (w / (h * h)).toFixed(1)
}

export function encounterErrors(e: Encounter): Partial<Record<VitalKey | "chiefComplaint" | "diagnoses", string>> {
  const errs: Partial<Record<VitalKey | "chiefComplaint" | "diagnoses", string>> = {}
  for (const v of VITALS) {
    const raw = e.vitals[v.key]
    if (raw === "") {
      if (v.required) errs[v.key] = "Required"
      continue
    }
    const n = Number(raw)
    if (Number.isNaN(n)) errs[v.key] = "Enter a number"
    else if (n < v.plausible[0] || n > v.plausible[1]) errs[v.key] = `Check value (${v.plausible[0]}–${v.plausible[1]} ${v.unit})`
  }
  if (!e.chiefComplaint.trim()) errs.chiefComplaint = "Required"
  if (e.diagnoses.length === 0) errs.diagnoses = "Add at least one diagnosis"
  return errs
}

/* ——— prescription (page 3) ——————————————————————————————————— */

export interface RxDraft {
  drugCode: string
  dose: string
  freq: FreqCode
  days: string
  route: string
  instructions: string
  override: string
  acknowledged: boolean
}
export interface RxLine {
  id: string
  drug: Drug
  dose: number
  freq: FreqCode
  days: number
  route: string
  qty: number
  instructions: string
  allergy: AllergyHit | null
  override?: string
}

export const emptyRx = (): RxDraft => ({ drugCode: "", dose: "1", freq: "TID", days: "7", route: "Oral", instructions: "", override: "", acknowledged: false })

export function rxQty(drug: Drug | undefined, dose: number, freq: FreqCode, days: number): number {
  if (!drug) return 0
  if (drug.form === "inhaler" || drug.form === "syrup") return 1
  const perDay = FREQS.find((f) => f.code === freq)!.perDay
  return Math.ceil(dose * perDay * days)
}

export function rxErrors(d: RxDraft, allergies: RegPatient["allergies"]) {
  const errs: Partial<Record<keyof RxDraft, string>> = {}
  const drug = DRUGS.find((x) => x.code === d.drugCode)
  if (!drug) errs.drugCode = "Choose a drug"
  const dose = Number(d.dose)
  if (!(dose > 0 && dose <= 8)) errs.dose = "Dose 0.5–8 units"
  const days = Number(d.days)
  if (!(Number.isInteger(days) && days >= 1 && days <= 90)) errs.days = "1–90 days"
  const hit = drug ? allergyCheck(drug, allergies) : null
  if (hit?.level === "critical" && d.override.trim().length < 10) errs.override = "Override needs a clinical reason (≥10 characters)"
  if (hit?.level === "warn" && !d.acknowledged) errs.acknowledged = "Acknowledge the cross-reactivity warning"
  return { errs, drug, hit }
}

export const thb = (n: number) => `฿${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/* ——— store ——————————————————————————————————————————————————— */

interface ScenarioState {
  page: Page
  go: (page: Page, patientId?: string) => void
  patients: RegPatient[]
  patient: RegPatient
  query: RegistryQuery
  setQuery: (q: Partial<RegistryQuery>) => void
  selection: string[]
  toggleSelection: (id: string) => void
  clearSelection: () => void
  encounter: Encounter
  updateEncounter: (patch: Partial<Encounter>) => void
  setVital: (k: VitalKey, v: string) => void
  encounterDirty: boolean
  saveEncounter: () => void
  savedAt: string | null
  meds: CurrentMed[]
  setMedDecision: (id: string, d: MedDecision) => void
  rx: RxLine[]
  addRx: (line: Omit<RxLine, "id">) => void
  removeRx: (id: string) => void
  sign: () => void
  flash: { text: string; patientId: string } | null
  dismissFlash: () => void
}

const Ctx = createContext<ScenarioState | null>(null)
let rxSeq = 0

export function useScenario() {
  const s = useContext(Ctx)
  if (!s) throw new Error("useScenario outside <ScenarioProvider>")
  return s
}

export function ScenarioProvider({ children, initialPage = "registry" }: { children: React.ReactNode; initialPage?: Page }) {
  const [page, setPage] = useState<Page>(initialPage)
  const [patients, setPatients] = useState(REGISTRY)
  const [patientId, setPatientId] = useState(featuredPatient.id)
  const [query, setQueryState] = useState<RegistryQuery>({
    list: "today", text: "", scheme: "any", provider: "any", sort: { id: "status", dir: "asc" }, page: 1,
  })
  const [selection, setSelection] = useState<string[]>([])
  const [encounters, setEncounters] = useState<Record<string, Encounter>>({})
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [medsBy, setMedsBy] = useState<Record<string, CurrentMed[]>>({})
  const [rxBy, setRxBy] = useState<Record<string, RxLine[]>>({})
  const [flash, setFlash] = useState<ScenarioState["flash"]>(null)

  const patient = patients.find((p) => p.id === patientId) ?? patients[0]
  const encounter = encounters[patient.id] ?? seedEncounter(patient)
  const meds = medsBy[patient.id] ?? currentMeds(patient)
  const rx = rxBy[patient.id] ?? []

  const value = useMemo<ScenarioState>(() => {
    const putEncounter = (e: Encounter) => {
      setEncounters((m) => ({ ...m, [patient.id]: e }))
      setDirty(true)
    }
    return {
      page,
      go: (p, id) => {
        if (id && id !== patientId) {
          setPatientId(id)
          setDirty(false)
          setSavedAt(null)
        }
        if (p === "visit" && (id ?? patientId)) {
          // opening the chart moves a waiting patient into the exam room
          setPatients((ps) => ps.map((x) => (x.id === (id ?? patientId) && x.status === "arrived" ? { ...x, status: "in-room" } : x)))
        }
        setPage(p)
      },
      patients,
      patient,
      query,
      setQuery: (q) => setQueryState((old) => ({ ...old, page: 1, ...q })),
      selection,
      toggleSelection: (id) => setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
      clearSelection: () => setSelection([]),
      encounter,
      updateEncounter: (patch) => putEncounter({ ...encounter, ...patch }),
      setVital: (k, v) => putEncounter({ ...encounter, vitals: { ...encounter.vitals, [k]: v } }),
      encounterDirty: dirty,
      saveEncounter: () => {
        setEncounters((m) => ({ ...m, [patient.id]: encounter }))
        setDirty(false)
        setSavedAt("09:41")
      },
      savedAt,
      meds,
      setMedDecision: (id, d) => setMedsBy((m) => ({ ...m, [patient.id]: meds.map((x) => (x.id === id ? { ...x, decision: d } : x)) })),
      rx,
      addRx: (line) => setRxBy((m) => ({ ...m, [patient.id]: [...rx, { ...line, id: `rx${++rxSeq}-${line.drug.code}` }] })),
      removeRx: (id) => setRxBy((m) => ({ ...m, [patient.id]: rx.filter((x) => x.id !== id) })),
      sign: () => {
        setPatients((ps) => ps.map((x) => (x.id === patient.id ? { ...x, status: "done", lastVisit: TODAY } : x)))
        setFlash({
          text: `Signed ${rx.length} prescription${rx.length === 1 ? "" : "s"} for ${formatName(patient.name)} — sent to pharmacy.`,
          patientId: patient.id,
        })
        setDirty(false)
        setPage("registry")
      },
      flash,
      dismissFlash: () => setFlash(null),
    }
  }, [page, patients, patient, patientId, query, selection, encounter, dirty, savedAt, meds, rx, flash])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const rxTotal = (rx: RxLine[]) => rx.reduce((s, l) => s + l.qty * l.drug.price, 0)
export const findDrug = (code: string) => DRUGS.find((d) => d.code === code)
export const drugConcepts: CodedConcept[] = DRUGS.map((d) => ({ code: d.code, term: `${d.name} ${d.strength} ${d.form}`, localTerm: d.localName }))
export const searchDrugs = async (q: string) => {
  const n = q.toLowerCase()
  return drugConcepts.filter((c) => c.term.toLowerCase().includes(n) || c.code.toLowerCase().includes(n) || (c.localTerm ?? "").includes(q))
}
