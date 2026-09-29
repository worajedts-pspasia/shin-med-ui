// Deterministic, PHI-free clinic fixtures (docs/spec/07).
// No fetches, no randomness, no Date.now — fixed ISO strings only.
import type { AllergyRecord, CodedConcept, NameParts, PatientIdentity, Tone, Urgency, VisitStatus } from "@/components/clinic/types"
import type { AttachmentRef } from "@/components/clinic/AttachmentChip"
import type { LauncherApp } from "@/components/clinic/LauncherRail"
import type { ReconciliationItem } from "@/components/clinic/ReconciliationList"
import type { NoteHistoryEntry } from "@/components/clinic/NoteHistoryLog"
import type { CodeGroup } from "@/components/clinic/CodePickerAccordion"
import type { SummarySegment } from "@/components/clinic/TemplateSelect"
import type { OpsAlert } from "@/components/clinic/AlertTicker"
import type { ComplianceCategory } from "@/components/clinic/ComplianceBoard"
import type { BodyMarker } from "@/components/clinic/BodyMapAnnotator"
import type { AnatomyRegion } from "@/components/clinic/AnatomyInspector"
import type { FishboneValue } from "@/components/clinic/LabFishbone"
import type { VaccineSeries } from "@/components/clinic/VaccineScheduleTable"
import type { CohortPatient } from "@/components/clinic/CohortTimeline"
import {
  BarChart3, CalendarDays, ClipboardList, FlaskConical, HeartPulse, ListChecks,
  Mail, NotebookPen, PillBottle, Receipt, Scan, Settings, ShieldAlert,
  Stethoscope, Syringe, Users,
  FileText, Megaphone,
} from "lucide-react"

export const FIXTURE_AS_OF = "2026-09-28"

/** Patient A — English chart, 46y male (dob fixed against FIXTURE_AS_OF). */
export const patientA: PatientIdentity = {
  id: "A",
  mrn: "000001",
  name: { given: "Michael", middle: "A.", family: "Smith", suffix: "Jr." },
  dob: "1980-03-15",
  sex: "male",
}

/** Patient B — Thai chart, 42y6m8d as of FIXTURE_AS_OF. */
export const patientB: PatientIdentity = {
  id: "B",
  mrn: "000002",
  name: { title: "นาย", given: "วรวุฒิ", family: "ศิริธรรม" },
  dob: "1984-03-20",
  sex: "male",
}

export const patientBAddress =
  "ถ.ประชาอุทิศ แขวงบางบอน เขตบางแขก จ.กรุงเทพฯ 10180"

export const allergiesA: AllergyRecord[] = [
  { allergen: "Ace Inhibitors", reaction: "rash", severity: "moderate", recordedAt: "2019-04-02" },
  { allergen: "Amoxicillin", reaction: "body rash", severity: "moderate", recordedAt: "2019-04-02" },
  { allergen: "Latex", reaction: "hives", severity: "severe", recordedAt: "2016-11-20" },
  { allergen: "Peanut", reaction: "dizziness", severity: "mild", recordedAt: "2021-08-14" },
]

export const allergiesB: AllergyRecord[] = [
  { allergen: "Penicillin", reaction: "ผื่น", severity: "moderate", recordedAt: "2024-01-10" },
]

/** Queue fixture — 5 rows covering every tone (07 §3). */
export const fixtureQueue = [
  { id: "q1", mrn: "000001", name: patientA.name, arrivedAt: "08:02", waitMinutes: 14, urgency: "routine" as Urgency, status: "arrived" as VisitStatus },
  { id: "q2", mrn: "000002", name: patientB.name, arrivedAt: "08:10", waitMinutes: 6, urgency: "rush" as Urgency, status: "accepted" as VisitStatus },
  { id: "q3", mrn: "000003", name: { title: "นาย", given: "สมคิด", family: "สอนประเสริฐ" }, arrivedAt: "08:15", waitMinutes: 1, urgency: "urgent" as Urgency, status: "held" as VisitStatus, note: "รอเอกสาร" },
  { id: "q4", mrn: "000004", name: { given: "Carly", family: "Kakasuleff" }, arrivedAt: "07:40", waitMinutes: 36, urgency: "routine" as Urgency, status: "done" as VisitStatus },
  { id: "q5", mrn: "000005", name: { given: "Test", family: "Patient" }, arrivedAt: "07:55", waitMinutes: 21, urgency: "routine" as Urgency, status: "cancelled" as VisitStatus },
]

/** Visit rows for DataTable demos — grouped by month, numeric + tones (07 §3). */
export interface VisitRow {
  id: string
  date: string // ISO
  time: string
  type: string
  typeTh: string
  provider: string
  waitMinutes: number
  copay: number // THB
  status: VisitStatus
  note?: string
}

export const fixtureVisits: VisitRow[] = [
  { id: "v01", date: "2026-09-24", time: "09:00", type: "Follow-up", typeTh: "ตามอาการ", provider: "Dr. Test Physician", waitMinutes: 5, copay: 300, status: "done" },
  { id: "v02", date: "2026-09-21", time: "10:30", type: "Lab review", typeTh: "ทบทวนผลแล็บ", provider: "Dr. Example Doe", waitMinutes: 46, copay: 200, status: "done", note: "COMP METAB PANEL: GLUCOSE,FASTING 120 H — repeat fasting glucose in 3 months" },
  { id: "v03", date: "2026-09-14", time: "14:00", type: "New patient", typeTh: "ผู้ป่วยใหม่", provider: "Dr. Test Physician", waitMinutes: 12, copay: 500, status: "done" },
  { id: "v04", date: "2026-09-02", time: "08:15", type: "Walk-in", typeTh: "มาเอง", provider: "Dr. Sample Sam", waitMinutes: 8, copay: 200, status: "cancelled" },
  { id: "v05", date: "2026-08-28", time: "11:00", type: "Follow-up", typeTh: "ตามอาการ", provider: "Dr. Example Doe", waitMinutes: 22, copay: 300, status: "done" },
  { id: "v06", date: "2026-08-19", time: "09:45", type: "Physical exam", typeTh: "ตรวจร่างกาย", provider: "Dr. Test Physician", waitMinutes: 3, copay: 600, status: "done" },
  { id: "v07", date: "2026-08-11", time: "16:00", type: "Lab review", typeTh: "ทบทวนผลแล็บ", provider: "Dr. Sample Sam", waitMinutes: 51, copay: 200, status: "done" },
  { id: "v08", date: "2026-08-03", time: "13:30", type: "Follow-up", typeTh: "ตามอาการ", provider: "Dr. Example Doe", waitMinutes: 9, copay: 300, status: "cancelled" },
  { id: "v09", date: "2026-07-29", time: "10:00", type: "New patient", typeTh: "ผู้ป่วยใหม่", provider: "Dr. Test Physician", waitMinutes: 17, copay: 500, status: "done" },
  { id: "v10", date: "2026-07-17", time: "15:15", type: "Walk-in", typeTh: "มาเอง", provider: "Dr. Sample Sam", waitMinutes: 6, copay: 200, status: "done" },
  { id: "v11", date: "2026-07-08", time: "09:30", type: "Follow-up", typeTh: "ตามอาการ", provider: "Dr. Example Doe", waitMinutes: 28, copay: 300, status: "done" },
  { id: "v12", date: "2026-07-01", time: "08:00", type: "Physical exam", typeTh: "ตรวจร่างกาย", provider: "Dr. Test Physician", waitMinutes: 11, copay: 600, status: "done" },
]

/** ICD-10 concepts for CodedSearchInput (07 §3 — the ICD-10 trio + friends). */
export const codedIcd10: CodedConcept[] = [
  { code: "E11.9", term: "Type 2 diabetes mellitus without complications", localTerm: "เบาหวานชนิดที่ 2" },
  { code: "N18.3", term: "Chronic kidney disease, stage 3", localTerm: "โรคไตเรื้อรัง ระยะที่ 3" },
  { code: "K21.9", term: "Gastro-esophageal reflux disease without esophagitis", localTerm: "กรดไหลย้อน" },
  { code: "I10", term: "Essential (primary) hypertension", localTerm: "ความดันโลหิตสูง" },
  { code: "E78.5", term: "Hyperlipidemia, unspecified", localTerm: "ไขมันในเลือดสูง" },
  { code: "J45.909", term: "Asthma, unspecified", localTerm: "โรคหืด" },
  { code: "Z00.00", term: "Encounter for general adult medical examination", localTerm: "ตรวจสุขภาพทั่วไป" },
  { code: "M54.5", term: "Low back pain", localTerm: "ปวดหลังส่วนล่าง" },
]

/** Drug concepts — Lipitor strengths + Betadine (07 §3 drug fixtures). */
export const codedDrugs: CodedConcept[] = [
  { code: "lipitor-10", term: "Lipitor 10 mg tablet", localTerm: "ลิพิเตอร์ 10 มก." },
  { code: "lipitor-20", term: "Lipitor 20 mg tablet", localTerm: "ลิพิเตอร์ 20 มก." },
  { code: "lipitor-40", term: "Lipitor 40 mg tablet", localTerm: "ลิพิเตอร์ 40 มก." },
  { code: "lipitor-80", term: "Lipitor 80 mg tablet", localTerm: "ลิพิเตอร์ 80 มก." },
  { code: "betadine-sol", term: "Betadine 10 mg/mL solution", localTerm: "เบตาดีน สารละลาย" },
]



/** One week of appointments — 3 visit types, all 6 statuses (07 §3). */
export interface FixtureAppt {
  id: string
  patient: { name: NameParts; age?: string; sex?: "male" | "female" }
  start: string
  end?: string
  type: string
  typeTh: string
  reason?: string
  location?: string
  status: "scheduled" | "confirmed" | "checked-in" | "in-room" | "checked-out" | "no-show"
  day: string // ISO
}

export const fixtureAppointments: FixtureAppt[] = [
  { id: "a1", patient: { name: { given: "Michael", middle: "A.", family: "Smith", suffix: "Jr." }, age: "46y", sex: "male" }, start: "08:30", end: "09:00", type: "Follow-up", typeTh: "ตามอาการ", reason: "CKD stage 3 review", location: "Room 2", status: "checked-out", day: "2026-09-28" },
  { id: "a2", patient: { name: { title: "นาย", given: "วรวุฒิ", family: "ศิริธรรม" }, age: "42y", sex: "male" }, start: "09:00", end: "09:30", type: "New patient", typeTh: "ผู้ป่วยใหม่", reason: "เช็คสุขภาพ", location: "Room 1", status: "in-room", day: "2026-09-28" },
  { id: "a3", patient: { name: { given: "Carly", family: "Kakasuleff" }, age: "38y", sex: "female" }, start: "09:30", end: "09:45", type: "Walk-in", typeTh: "มาเอง", location: "Room 3", status: "checked-in", day: "2026-09-28" },
  { id: "a4", patient: { name: { given: "Test", family: "Patient" }, age: "30y", sex: "female" }, start: "10:00", end: "10:20", type: "Lab review", typeTh: "ทบทวนผลแล็บ", location: "Lab", status: "confirmed", day: "2026-09-28" },
  { id: "a5", patient: { name: { title: "นาย", given: "สมคิด", family: "สอนประเสริฐ" }, age: "55y", sex: "male" }, start: "10:30", end: "11:00", type: "Physical exam", typeTh: "ตรวจร่างกาย", location: "Room 2", status: "scheduled", day: "2026-09-29" },
  { id: "a6", patient: { name: { given: "No", family: "Showerson" }, age: "61y", sex: "male" }, start: "08:00", end: "08:30", type: "Follow-up", typeTh: "ตามอาการ", location: "Room 1", status: "no-show", day: "2026-09-28" },
]

/** Calendar density markers — appointments per day (MiniCalendar). */
export const calMarkers: Record<string, { count: number; level?: 1 | 2 | 3 }> = {
  "2026-09-02": { count: 2, level: 1 },
  "2026-09-09": { count: 5, level: 2 },
  "2026-09-15": { count: 9, level: 3 },
  "2026-09-24": { count: 3, level: 2 },
  "2026-09-28": { count: 6, level: 3 },
}

/** Fax-inbox items for GroupedListPanel demos (synthetic senders). */
export interface FixtureFax {
  id: string
  from: string
  subject: string
  day: string // ISO
  pages: number
}

export const fixtureFaxes: FixtureFax[] = [
  { id: "f01", from: "Bang Bon Lab", subject: "COMP METAB PANEL — MRN 000001", day: "2026-09-28", pages: 2 },
  { id: "f02", from: "Siri Pharmacy", subject: "Rx refill request — Lipitor 20 mg", day: "2026-09-28", pages: 1 },
  { id: "f03", from: "St. Example Hospital", subject: "Discharge summary — นาย สมคิด สอนประเสริฐ", day: "2026-09-27", pages: 4 },
  { id: "f04", from: "Bang Bon Lab", subject: "Lipid panel — MRN 000002", day: "2026-09-26", pages: 1 },
  { id: "f05", from: "Insurer Example", subject: "Prior auth — MRI lumbar", day: "2026-09-26", pages: 3 },
  { id: "f06", from: "Siri Pharmacy", subject: "Rx refill request — metformin 1,000 mg", day: "2026-09-25", pages: 1 },
]

// ——— wave 4a: clinical review core ———

/** Vitals — one abnormal (BP 140/95), one missing (SpO₂), BMI/IBW derived. */
export const fixtureVitals = [
  { key: "bw" as const, label: "BW", value: "82.0", unit: "kg", takenAt: "07:52" },
  { key: "h" as const, label: "H", value: "175", unit: "cm", takenAt: "07:52" },
  { key: "bp" as const, label: "BP", value: ["140", "95"] as [string, string], unit: "mmHg", abnormal: true, takenAt: "07:52" },
  { key: "pulse" as const, label: "Pulse", value: "76", unit: "/min", takenAt: "07:52" },
  { key: "temp" as const, label: "Temp", value: "36.8", unit: "°C", takenAt: "07:52" },
  { key: "spo2" as const, label: "SpO₂", unit: "%", takenAt: "07:52" },
  { key: "bmi" as const, label: "BMI", value: "26.8", derived: true as const },
  { key: "ibw" as const, label: "IBW", value: "70.5", unit: "kg", derived: true as const },
]

export interface LabAnalyte {
  id: string; name: string; nameLocal?: string
  value?: string; flag?: "N" | "H" | "L" | "HH" | "LL"
  range?: string; uom?: string; note?: string; collectedAt?: string
}
export interface LabPanel { id: string; name: string; nameLocal?: string; receivedAt?: string; analytes: LabAnalyte[] }

/** COMP METAB PANEL — GLUCOSE H + interpretive note + 12 normals (07 §3). */
export const fixturePanels: LabPanel[] = [
  {
    id: "cmp", name: "COMP METAB PANEL", receivedAt: "2026-09-21T09:40",
    analytes: [
      { id: "glu", name: "GLUCOSE,FASTING", value: "120", flag: "H", range: "70–99", uom: "mg/dL", note: "Impaired (fasting): 100–125 mg/dL", collectedAt: "2026-09-21T08:10" },
      { id: "na", name: "SODIUM", value: "139", flag: "N", range: "136–144", uom: "mmol/L", collectedAt: "2026-09-21T08:10" },
      { id: "k", name: "POTASSIUM", value: "4.2", flag: "N", range: "3.5–5.0", uom: "mmol/L", collectedAt: "2026-09-21T08:10" },
      { id: "cl", name: "CHLORIDE", value: "103", flag: "N", range: "98–107", uom: "mmol/L", collectedAt: "2026-09-21T08:10" },
      { id: "co2", name: "CO2", value: "25", flag: "N", range: "24–32", uom: "mmol/L", collectedAt: "2026-09-21T08:10" },
      { id: "bun", name: "BUN", value: "16", flag: "N", range: "7–20", uom: "mg/dL", collectedAt: "2026-09-21T08:10" },
      { id: "creat", name: "CREATININE", value: "1.1", flag: "N", range: "0.7–1.3", uom: "mg/dL", collectedAt: "2026-09-21T08:10" },
      { id: "ca", name: "CALCIUM", value: "9.2", flag: "N", range: "8.7–10.2", uom: "mg/dL", collectedAt: "2026-09-21T08:10" },
      { id: "prot", name: "TOTAL PROTEIN", value: "7.0", flag: "N", range: "6.4–8.2", uom: "g/dL", collectedAt: "2026-09-21T08:10" },
      { id: "alb", name: "ALBUMIN", value: "4.3", flag: "N", range: "3.5–5.0", uom: "g/dL", collectedAt: "2026-09-21T08:10" },
      { id: "ast", name: "AST (SGOT)", value: "22", flag: "N", range: "10–35", uom: "U/L", collectedAt: "2026-09-21T08:10" },
      { id: "alt", name: "ALT (SGPT)", value: "18", flag: "N", range: "10–35", uom: "U/L", collectedAt: "2026-09-21T08:10" },
      { id: "alp", name: "ALK PHOS", value: "70", flag: "N", range: "40–120", uom: "U/L", collectedAt: "2026-09-21T08:10" },
      { id: "bili", name: "TOTAL BILIRUBIN", value: "0.7", flag: "N", range: "0.2–1.2", uom: "mg/dL", collectedAt: "2026-09-21T08:10" },
    ],
  },
  {
    id: "lipid", name: "LIPID PANEL", receivedAt: "2026-09-21T09:40",
    analytes: [
      { id: "chol", name: "CHOLESTEROL, TOTAL", nameLocal: "ไขมันในเลือด", value: "192", flag: "N", range: "< 200", uom: "mg/dL", collectedAt: "2026-09-21T08:10" },
      { id: "ldl", name: "LDL CHOLESTEROL", value: "115", flag: "H", range: "< 100", uom: "mg/dL", collectedAt: "2026-09-21T08:10" },
      { id: "hdl", name: "HDL CHOLESTEROL", value: "38", flag: "L", range: "> 40", uom: "mg/dL", collectedAt: "2026-09-21T08:10" },
      { id: "tg", name: "TRIGLYCERIDES", value: "165", flag: "N", range: "< 150", uom: "mg/dL", collectedAt: "2026-09-21T08:10" },
    ],
  },
]

/** Longitudinal events — 6 lanes over Jul–Sep 2026 (07 §3). */
export interface TimelineEvent {
  id: string
  laneId: "medications" | "notes" | "orders" | "labs" | "documents" | "vitals"
  at: string
  kind: string
  label?: string
  detail?: Array<{ label: string; value: string }>
}

export const fixtureTimelineLanes = [
  { id: "medications" as const, label: "Medications" },
  { id: "orders" as const, label: "Orders" },
  { id: "labs" as const, label: "Labs" },
  { id: "notes" as const, label: "Notes" },
  { id: "documents" as const, label: "Documents" },
  { id: "vitals" as const, label: "Vitals" },
]

export const fixtureTimelineEvents: TimelineEvent[] = [
  { id: "e1", laneId: "medications", at: "2026-07-05T10:00", kind: "start", label: "Lisinopril 30 mg", detail: [
    { label: "Substance", value: "Lisinopril" }, { label: "ATC", value: "C09AA03" },
    { label: "Regimen", value: "1-0-0" }, { label: "Aim", value: "BP control" },
    { label: "Episode", value: "#Essential hypertension" }, { label: "Revision", value: "1" },
  ] },
  { id: "e2", laneId: "medications", at: "2026-08-12T14:00", kind: "stop", label: "Amlodipine 5 mg" },
  { id: "e3", laneId: "medications", at: "2026-09-10T09:00", kind: "refill", label: "Metformin refill" },
  { id: "e4", laneId: "orders", at: "2026-07-05T10:05", kind: "order", label: "CMP" },
  { id: "e5", laneId: "orders", at: "2026-09-08T11:30", kind: "order", label: "Lipid panel" },
  { id: "e6", laneId: "labs", at: "2026-07-06T09:15", kind: "result", label: "CMP resulted" },
  { id: "e7", laneId: "labs", at: "2026-09-09T08:45", kind: "result", label: "GLU 120 H" },
  { id: "e8", laneId: "labs", at: "2026-09-09T08:45", kind: "result", label: "LDL 115 H" },
  { id: "e9", laneId: "notes", at: "2026-07-05T11:00", kind: "soap", label: "SOAP — HTN f/u" },
  { id: "e10", laneId: "notes", at: "2026-08-20T15:20", kind: "soap", label: "SOAP — cough" },
  { id: "e10b", laneId: "notes", at: "2026-09-05T10:00", kind: "soap", label: "SOAP — sleep review" },
  { id: "e11", laneId: "notes", at: "2026-09-10T09:40", kind: "soap", label: "SOAP — DM f/u" },
  { id: "e12", laneId: "documents", at: "2026-08-01T13:00", kind: "doc", label: "Discharge summary" },
  { id: "e13", laneId: "documents", at: "2026-09-15T10:00", kind: "doc", label: "LabCorp results.jpg" },
  { id: "e14", laneId: "vitals", at: "2026-07-05T10:02", kind: "bp", label: "138/88" },
  { id: "e15", laneId: "vitals", at: "2026-08-20T15:30", kind: "bp", label: "142/94" },
  { id: "e16", laneId: "vitals", at: "2026-09-10T09:45", kind: "bp", label: "140/95" },
]

/** BP trend over 2y, quarterly (07 §3) + annotation: lisinopril start. */
export const bpTrendSeries = [
  {
    id: "systolic", label: "Systolic", color: "var(--color-things-blue)",
    points: [
      { at: "2024-09-15", value: 134 }, { at: "2024-12-15", value: 138 }, { at: "2025-03-15", value: 142 },
      { at: "2025-06-15", value: 146 }, { at: "2025-09-15", value: 144 }, { at: "2025-12-15", value: 141 },
      { at: "2026-03-15", value: 139 }, { at: "2026-06-15", value: 138 }, { at: "2026-09-15", value: 136 },
    ],
  },
  {
    id: "diastolic", label: "Diastolic", color: "var(--color-things-cal)",
    points: [
      { at: "2024-09-15", value: 84 }, { at: "2024-12-15", value: 87 }, { at: "2025-03-15", value: 90 },
      { at: "2025-06-15", value: 93 }, { at: "2025-09-15", value: 92 }, { at: "2025-12-15", value: 90 },
      { at: "2026-03-15", value: 89 }, { at: "2026-06-15", value: 88 }, { at: "2026-09-15", value: 86 },
    ],
  },
]

export const bpAnnotations = [{ at: "2025-03-15", label: "Lisinopril 30 mg" }]

/** Therapy spans (07 §3) — one terminated span (metformin). */
export const fixtureMeds = [
  { id: "m1", label: "Aspirin 81 mg", start: "2019-06-01", status: "active" as const, dose: "81 mg daily" },
  { id: "m2", label: "Lisinopril 30 mg", start: "2025-03-15", status: "active" as const, dose: "30 mg 1-0-0" },
  { id: "m3", label: "Metformin 1,000 mg", start: "2024-06-10", end: "2026-04-02", status: "stopped" as const, dose: "1,000 mg 1-0-1" },
  { id: "m4", label: "Crestor 10 mg", start: "2026-01-20", status: "active" as const, dose: "10 mg nightly" },
  { id: "m5", label: "Amlodipine 5 mg", start: "2026-08-12", status: "held" as const, dose: "5 mg daily" },
]

/** Flowsheet — measures down, encounters across. */
export interface FlowMeasure { id: string; label: string; unit?: string; range?: [number, number]; sectionId: string }
export const flowSections = [
  { id: "vitals", label: "Vitals", rows: [
    { id: "wt", label: "Weight", unit: "kg", range: [50, 100] as [number, number], sectionId: "vitals" },
    { id: "sbp", label: "SBP", unit: "mmHg", range: [90, 130] as [number, number], sectionId: "vitals" },
    { id: "dbp", label: "DBP", unit: "mmHg", range: [60, 85] as [number, number], sectionId: "vitals" },
  ] },
  { id: "labs", label: "Labs", rows: [
    { id: "glu", label: "Glucose, fasting", unit: "mg/dL", range: [70, 99] as [number, number], sectionId: "labs" },
    { id: "ldl", label: "LDL", unit: "mg/dL", range: [0, 100] as [number, number], sectionId: "labs" },
    { id: "creatinine", label: "Creatinine", unit: "mg/dL", range: [0.7, 1.3] as [number, number], sectionId: "labs" },
  ] },
]
export const flowColumns = [
  { id: "c1", at: "2026-07-05T10:00" }, { id: "c2", at: "2026-07-19T10:00" }, { id: "c3", at: "2026-08-02T10:00" },
  { id: "c4", at: "2026-08-16T10:00" }, { id: "c5", at: "2026-08-30T10:00" }, { id: "c6", at: "2026-09-13T10:00" },
  { id: "c7", at: "2026-09-27T10:00" },
]
export const flowValues: Record<string, Record<string, { value: number; flag?: Tone }>> = {
  wt: { c1: { value: 83.5 }, c2: { value: 83.1 }, c3: { value: 82.8 }, c4: { value: 82.6 }, c5: { value: 82.4 }, c6: { value: 82.1 }, c7: { value: 82.0 } },
  sbp: { c1: { value: 138 }, c2: { value: 140, flag: "warn" }, c3: { value: 139 }, c4: { value: 142, flag: "warn" }, c5: { value: 141, flag: "warn" }, c6: { value: 140, flag: "warn" }, c7: { value: 138 } },
  dbp: { c1: { value: 88, flag: "warn" }, c2: { value: 89, flag: "warn" }, c3: { value: 87 }, c4: { value: 90, flag: "warn" }, c5: { value: 91, flag: "warn" }, c6: { value: 92, flag: "warn" }, c7: { value: 90, flag: "warn" } },
  glu: { c1: { value: 112, flag: "warn" }, c3: { value: 116, flag: "warn" }, c5: { value: 118, flag: "warn" }, c7: { value: 120, flag: "warn" } },
  ldl: { c1: { value: 132, flag: "warn" }, c4: { value: 124, flag: "warn" }, c7: { value: 115, flag: "warn" } },
  creatinine: { c2: { value: 1.0 }, c4: { value: 1.1 }, c6: { value: 1.1 } },
}

// ——— wave 4b: clinical lists, order entry, messaging ———

export interface ProblemRow {
  id: string; alert?: boolean; priority: "primary" | "secondary"; code: string
  description: string; onset: string; modified: string; note?: string; status: "active" | "resolved"
}
export const fixtureProblems: ProblemRow[] = [
  { id: "p1", alert: true, priority: "primary", code: "N18.3", description: "Chronic kidney disease, stage 3", onset: "2024-03-12", modified: "2026-08-20", note: "eGFR 62 — monitor q6m", status: "active" },
  { id: "p2", priority: "primary", code: "E11.9", description: "Type 2 diabetes mellitus without complications", onset: "2023-11-02", modified: "2026-09-10", status: "active" },
  { id: "p3", priority: "secondary", code: "K21.9", description: "GERD without esophagitis", onset: "2025-06-18", modified: "2026-07-05", status: "active" },
  { id: "p4", priority: "secondary", code: "J45.909", description: "Asthma, unspecified", onset: "2019-02-10", modified: "2026-01-15", note: "Albuterol PRN", status: "active" },
  { id: "p5", priority: "secondary", code: "M54.5", description: "Low back pain", onset: "2026-04-02", modified: "2026-04-02", status: "resolved" },
]

export interface CareGapRow {
  id: string; protocolId: string; protocol: string; guideline?: string
  measure: string; interval: string; due: boolean
  todayResult: string; todayTone?: "ok" | "warn"; previousResult: string; previousDate: string
}
export const fixtureCareGaps: CareGapRow[] = [
  { id: "g1", protocolId: "dm", protocol: "Diabetes", guideline: "ADA 2026", measure: "HbA1c", interval: "every 3 mo", due: true, todayResult: "7.8 %", todayTone: "warn", previousResult: "7.2 %", previousDate: "2026-06-10" },
  { id: "g2", protocolId: "dm", protocol: "Diabetes", guideline: "ADA 2026", measure: "LDL cholesterol", interval: "every 1 y", due: true, todayResult: "115 mg/dL", todayTone: "warn", previousResult: "132 mg/dL", previousDate: "2025-09-21" },
  { id: "g3", protocolId: "dm", protocol: "Diabetes", guideline: "ADA 2026", measure: "Retinal exam", interval: "every 1 y", due: false, todayResult: "Done", todayTone: "ok", previousResult: "Done", previousDate: "2026-02-14" },
  { id: "g4", protocolId: "ckd", protocol: "CKD stage 3", guideline: "KDIGO 2024", measure: "Creatinine + eGFR", interval: "every 6 mo", due: false, todayResult: "1.1 / 62", todayTone: "ok", previousResult: "1.1 / 61", previousDate: "2026-03-18" },
  { id: "g5", protocolId: "prevent", protocol: "Preventive", guideline: "USPSTF", measure: "Colorectal screening", interval: "every 10 y", due: true, todayResult: "—", previousResult: "—", previousDate: "—" },
]

export interface MedListRow {
  id: string; group: "current" | "historical"; status: "active" | "stopped" | "held"
  interaction?: "warning" | "info"; start: string; drug: string; dose: string; sig: string
  lastRefill?: string; prescriber: string
}
export const fixtureMedList: MedListRow[] = [
  { id: "ml1", group: "current", status: "active", interaction: "warning", start: "2025-03-15", drug: "Lisinopril", dose: "30 mg", sig: "1-0-0", lastRefill: "2026-09-01", prescriber: "Dr. Test Physician" },
  { id: "ml2", group: "current", status: "active", start: "2026-01-20", drug: "Crestor", dose: "10 mg", sig: "0-0-1", lastRefill: "2026-08-22", prescriber: "Dr. Example Doe" },
  { id: "ml3", group: "current", status: "active", start: "2019-06-01", drug: "Aspirin", dose: "81 mg", sig: "1-0-0", lastRefill: "2026-07-30", prescriber: "Dr. Test Physician" },
  { id: "ml4", group: "current", status: "held", interaction: "info", start: "2026-08-12", drug: "Amlodipine", dose: "5 mg", sig: "0-1-0", prescriber: "Dr. Sample Sam" },
  { id: "ml5", group: "historical", status: "stopped", start: "2024-06-10", drug: "Metformin", dose: "1,000 mg", sig: "1-0-1", lastRefill: "2026-03-05", prescriber: "Dr. Example Doe" },
]

/** ClinicalSummaryColumn items per panel (WinForms EMR triptych + attestation). */
export const summaryAllergies = [
  { id: "sa1", label: "Ace Inhibitors", severity: "alert" as const, meta: "rash · moderate" },
  { id: "sa2", label: "Amoxicillin", severity: "alert" as const, meta: "body rash · moderate" },
  { id: "sa3", label: "Latex", severity: "alert" as const, meta: "hives · severe" },
]
export const summaryMeds = [
  { id: "sm1", label: "Lisinopril 30 mg", severity: "alert" as const, meta: "1-0-0 · ⚠ interaction" },
  { id: "sm2", label: "Crestor 10 mg", severity: "info" as const, meta: "0-0-1" },
  { id: "sm3", label: "Aspirin 81 mg", severity: "info" as const, meta: "1-0-0" },
]
export const summaryProblems = [
  { id: "sp1", label: "CKD stage 3 (N18.3)", severity: "alert" as const, meta: "since 2024" },
  { id: "sp2", label: "T2DM (E11.9)", severity: "info" as const, meta: "since 2023" },
  { id: "sp3", label: "GERD (K21.9)", severity: "info" as const, meta: "since 2025" },
]

export const fixtureFindings = [
  { id: "f1", label: "Monofilament — right foot", options: ["Intact", "Diminished", "Absent"] },
  { id: "f2", label: "Monofilament — left foot", options: ["Intact", "Diminished", "Absent"] },
  { id: "f3", label: "Pedal pulses", options: ["Present", "Diminished", "Absent"] },
  { id: "f4", label: "Skin integrity" },
  { id: "f5", label: "Foot deformity" },
  { id: "f6", label: "Nail care needed" },
]

export const fixtureDirectionCodes = [
  { code: "1-0-0", sig: "1 tab before breakfast" },
  { code: "1-0-1", sig: "1 tab morning and evening" },
  { code: "0-0-1", sig: "1 tablet at bedtime" },
  { code: "1xApply2", sig: "ทา - - วันละ 2 ครั้ง@เช้า-เย็น" },
  { code: "2xPO3", sig: "รับประทาน 2 เม็ด วันละ 3 ครั้ง" },
]

export interface DrugNode {
  id: string; label: string; level: 0 | 1 | 2 | 3; children?: DrugNode[]; warning?: boolean; sig?: string
}
export const fixtureDrugTree: DrugNode[] = [
  {
    id: "lipitor", label: "Lipitor", level: 0, children: [
      { id: "lip-oral", label: "Oral", level: 1, children: [
        { id: "lip-tab", label: "Tablet", level: 2, children: [
          { id: "lip-10", label: "10 mg", level: 3, sig: "[Disp: 30.00 Tablet Sig: 1 Q Day]" },
          { id: "lip-20", label: "20 mg", level: 3, sig: "[Disp: 30.00 Tablet Sig: 1 Q Day]" },
          { id: "lip-40", label: "40 mg", level: 3, warning: true, sig: "[Disp: 30.00 Tablet Sig: 1 Q Day]" },
          { id: "lip-80", label: "80 mg", level: 3, warning: true, sig: "[Disp: 30.00 Tablet Sig: 1 Q Day]" },
        ] },
      ] },
    ],
  },
  {
    id: "betadine", label: "Betadine", level: 0, children: [
      { id: "bet-top", label: "Topical", level: 1, children: [
        { id: "bet-sol", label: "Solution", level: 2, children: [
          { id: "bet-10", label: "10 mg/mL", level: 3, sig: "[Disp: 100.00 mL Sig: Apply bid]" },
        ] },
      ] },
    ],
  },
]

export const fixtureOrderSets = [
  { id: "os1", name: "HTN starter", items: ["Lisinopril 10 mg", "Lipid panel"] },
  { id: "os2", name: "DM annual", items: ["HbA1c", "Lipid panel", "Retinal exam"] },
  { id: "os3", name: "CKD q6m", items: ["Creatinine + eGFR", "CMP"] },
]

export interface LineItem {
  id: string; name: string; qty: number; unit: string; sig?: string; cost?: number; status?: "ok" | "warn"
}
export const fixtureLineItems: LineItem[] = [
  { id: "li1", name: "Lipitor 20 mg", qty: 30, unit: "Tablet", sig: "1 Q Day", cost: 210, status: "ok" },
  { id: "li2", name: "Betadine 10 mg/mL", qty: 1, unit: "Bottle", sig: "Apply bid", cost: 45, status: "warn" },
]

/** Staff directory (07 §3 — 6 staff with roles). */
export const fixtureDirectory = [
  { id: "u1", name: "Dr. Test Physician", role: "physician" },
  { id: "u2", name: "Dr. Example Doe", role: "physician" },
  { id: "u3", name: "Nurse Nit Noi", role: "nurse" },
  { id: "u4", name: "พยาบาล สมหญิง ใจดี", role: "nurse" },
  { id: "u5", name: "Pharm Phil Care", role: "pharmacist" },
  { id: "u6", name: "Front Desk Fay", role: "staff" },
] as const

/** Mixed message stream (07 §3): chat + quote + system + attachments. */
export type FixtureEntry =
  | { id: string; kind: "chat"; authorId: string; at: string; body: string; direction: "in" | "out"; status?: "sent" | "delivered" | "read"; attachments?: AttachmentRef[] }
  | { id: string; kind: "quote"; at: string; direction: "in" | "out"; header: { from: string; sent: string; to: string; subject: string }; body: string }
  | { id: string; kind: "system"; at: string; text: string; tone?: "info" | "warning" }
  | { id: string; kind: "divider"; at: string; label?: string }

export const fixtureThread: FixtureEntry[] = [
  { id: "t0", kind: "divider", at: "2026-09-27T00:00", label: "Yesterday" },
  { id: "t1", kind: "system", at: "2026-09-27T09:00", text: "LabCorp results received — GLUCOSE,FASTING 120 (H)", tone: "info" },
  {
    id: "t2", kind: "quote", at: "2026-09-27T09:05", direction: "in",
    header: { from: "Bang Bon Lab", sent: "Sep 27, 2026 09:02", to: "Dr. Test Physician", subject: "COMP METAB PANEL — MRN 000001" },
    body: "GLUCOSE,FASTING 120 H (70–99 mg/dL). Impaired (fasting): 100–125 mg/dL. All other analytes within reference range.",
  },
  { id: "t3", kind: "chat", authorId: "u1", at: "2026-09-27T09:20", body: "Fasting glucose is trending up. Let's recheck in 3 months and tighten the diet plan.", direction: "in" },
  { id: "t4", kind: "chat", authorId: "u6", at: "2026-09-27T09:24", body: "Understood — I'll book the follow-up and attach the lab file here.", direction: "out", status: "read", attachments: [{ id: "at1", kind: "file", name: "LabCorp Results.jpg", size: "412 KB", docId: "1970" }] },
  { id: "t5", kind: "chat", authorId: "u6", at: "2026-09-27T09:25", body: "And the chart reference for the visit:", direction: "out", status: "read", attachments: [{ id: "at2", kind: "chart", chartId: "9562", patient: "Smith, Michael A. Jr.", meta: "Male · Age: 46y" }] },
  { id: "t6", kind: "divider", at: "2026-09-28T00:00", label: "Unread" },
  { id: "t7", kind: "chat", authorId: "u3", at: "2026-09-28T08:30", body: "Patient arrived for the 09:00 follow-up. Vitals taken, BP 140/95.", direction: "in" },
]

// ——— wave 5: shell ———

/** Patient search corpus incl. the duplicate-name pair (the wrong-patient vector). */
export const patientCorpus: PatientIdentity[] = [
  patientA,
  patientB,
  { id: "C", mrn: "000003", name: { title: "นาย", given: "สมชาย", family: "ทดสอบ" }, dob: "1971-01-15", sex: "male" },
  { id: "D", mrn: "000004", name: { title: "นาย", given: "สมชาย", family: "ทดสอบ" }, dob: "1990-07-22", sex: "male" },
  { id: "E", mrn: "000005", name: { given: "Carly", family: "Kakasuleff" }, dob: "1988-11-03", sex: "female" },
  { id: "F", mrn: "000006", name: { given: "Test", family: "Patient" }, dob: "1996-05-30", sex: "female" },
]

export const moduleItemsData = [
  { id: "schedule", label: "Schedule", count: 12 },
  { id: "patients", label: "Patients" },
  { id: "messages", label: "Messages", count: 5 },
  { id: "documents", label: "Documents", count: 103 },
  { id: "billing", label: "Billing" },
  { id: "reports", label: "Reports" },
]

export const chartSections = [
  { id: "summary", label: "Summary" },
  { id: "vitals", label: "Vitals" },
  { id: "allergies", label: "Allergies", badge: 4 },
  { id: "history", label: "History" },
  { id: "problems", label: "Problems", badge: 4 },
  { id: "meds", label: "Medications", badge: 4 },
  { id: "labs", label: "Labs" },
  { id: "documents", label: "Documents" },
]

// ——— wave 6: schedule ———

export const scheduleResources = [
  { id: "r1", label: "Room 1 · Dr. Test", color: "var(--color-things-blue)" },
  { id: "r2", label: "Room 2 · Dr. Doe", color: "var(--color-things-teal)" },
  { id: "r3", label: "Lab", color: "var(--color-things-purple)" },
]

/** Grid slots derived from fixtureAppointments + week spread (09-28..10-02). */
export interface GridSlot {
  start: string
  end?: string
  resourceId: string
  appt: {
    id: string
    patient: { name: NameParts; age?: string; sex?: "male" | "female" }
    start: string
    end?: string
    type: string
    reason?: string
    location?: string
    status: "scheduled" | "confirmed" | "checked-in" | "in-room" | "checked-out" | "no-show"
    day: string
  }
}

export const fixtureGridSlots: GridSlot[] = [
  { start: "08:30", end: "09:00", resourceId: "r1", appt: { ...fixtureAppointments[0], start: "08:30", end: "09:00", day: "2026-09-28" } },
  { start: "08:00", end: "08:30", resourceId: "r1", appt: { ...fixtureAppointments[5], start: "08:00", end: "08:30", day: "2026-09-28" } },
  { start: "09:00", end: "09:30", resourceId: "r1", appt: { ...fixtureAppointments[1], start: "09:00", end: "09:30", day: "2026-09-28" } },
  { start: "09:30", end: "09:45", resourceId: "r2", appt: { ...fixtureAppointments[2], start: "09:30", end: "09:45", day: "2026-09-28" } },
  { start: "10:00", end: "10:20", resourceId: "r3", appt: { ...fixtureAppointments[3], start: "10:00", end: "10:20", day: "2026-09-28" } },
  { start: "11:00", end: "11:30", resourceId: "r2", appt: { ...fixtureAppointments[4], start: "11:00", end: "11:30", day: "2026-09-29" } },
  {
    start: "08:30", end: "09:00", resourceId: "r1",
    appt: {
      id: "a7", patient: { name: { given: "Walk", family: "Insomnia" }, age: "34y", sex: "female" }, start: "08:30", end: "09:00",
      type: "Walk-in", reason: "Sore throat", location: "Room 1", status: "checked-out", day: "2026-09-29",
    },
  },
  {
    start: "13:00", end: "13:30", resourceId: "r2",
    appt: {
      id: "a8", patient: { name: { title: "นาย", given: "ประยุทธ์", family: "ตัวอย่าง" }, age: "60y", sex: "male" }, start: "13:00", end: "13:30",
      type: "Follow-up", reason: "HTN f/u", location: "Room 2", status: "confirmed", day: "2026-09-30",
    },
  },
  {
    start: "14:00", end: "15:00", resourceId: "r2",
    appt: {
      id: "a9", patient: { name: { given: "Annual", family: "Physical" }, age: "41y", sex: "female" }, start: "14:00", end: "15:00",
      type: "Physical exam", location: "Room 2", status: "scheduled", day: "2026-10-01",
    },
  },
  {
    start: "09:30", end: "09:50", resourceId: "r3",
    appt: {
      id: "a10", patient: { name: { given: "Lipid", family: "Recheck" }, age: "52y", sex: "male" }, start: "09:30", end: "09:50",
      type: "Lab review", location: "Lab", status: "scheduled", day: "2026-10-02",
    },
  },
]

export const fixtureSummaryRows = [
  { status: "scheduled" as const, mine: 2, total: 5 },
  { status: "checked-in" as const, mine: 1, total: 3 },
  { status: "checked-out" as const, mine: 3, total: 7 },
  { status: "no-show" as const, mine: 0, total: 1 },
]

export const fixtureResourceGroups = [
  { id: "providers", label: "Providers", items: [
    { id: "r1", label: "Dr. Test Physician", color: "var(--color-things-blue)", count: 3 },
    { id: "r2", label: "Dr. Example Doe", color: "var(--color-things-teal)", count: 4 },
  ] },
  { id: "rooms", label: "Rooms", items: [
    { id: "r3", label: "Lab", color: "var(--color-things-purple)", count: 2 },
  ] },
]

// ——— wave 7: paper & documents ———

export const fixturePrescriber = { doctor: "Dr. Test Physician", clinic: "Siri Clinic — ตัวอย่าง", license: "TH-DOC-000042" }
export const fixturePharmacy = { name: "Siri Pharmacy", address: "ถ.ประชาอุทิศ แขวงบางบอน จ.กรุงเทพฯ 10150" }
export const fixtureRx = {
  drug: "Lipitor 20 mg tablet",
  sig: "1 tab PO qAM (เช้า 1 เม็ด)",
  dispense: "30.00 Tablet",
  refills: "3",
  voidUntil: "2026-12-28",
  diagnosis: "E78.5 Hyperlipidemia",
}

export const fixtureReportHeader = {
  requisition: "RQ-000118",
  accession: "26-98765",
  collectedAt: "2026-09-21 08:10",
  reportedAt: "2026-09-21 09:40",
  patient: { nameLine: "Smith, Michael A. Jr.", dob: "1980-03-15", mrn: "000001" },
}

export const fixtureHl7 = `MSH|^~\\&|LABCORP|BBN|SIRI|CLINIC|202609210940||ORU^R01|000118|P|2.3
PID|1||000001^^^SIRI^MR||Smith^Michael^A^Jr.||19800315|M
OBR|1|RQ-000118|26-98765|GLU^GLUCOSE,FASTING|||202609210810
OBX|1|NM|GLU^GLUCOSE,FASTING|120|mg/dL|70-99|H||F|||202609210810`

export const fixtureSocSections = [
  {
    label: "Patient",
    rows: [
      { label: "Name", value: "Smith, Michael A. Jr." },
      { label: "DOB / Sex", value: "1980-03-15 · Male" },
      { label: "MRN", value: "000001" },
      { label: "Address", value: "128/3 Moo 5, Pracha Uthit Rd, Bang Bon, Bang Khae, Bangkok 10150", span: 2 as const },
    ],
  },
  {
    label: "Problems",
    rows: [
      { label: "Active", value: "N18.3 CKD stage 3 · E11.9 T2DM · K21.9 GERD", span: 2 as const },
    ],
  },
  {
    label: "Medications",
    rows: [
      { label: "2026", value: "Aspirin 81 mg · Lisinopril 30 mg · Crestor 10 mg", span: 2 as const },
      { label: "2024–2026", value: "Metformin 1,000 mg (stopped 2026-04-02)", span: 2 as const },
    ],
  },
  {
    label: "Allergies",
    rows: [
      { label: "Alerts", value: "Ace Inhibitors (rash) · Amoxicillin (body rash) · Latex (hives)", span: 2 as const },
    ],
  },
]

export const fixtureDocTree = [
  { id: "lab", label: "Lab Reports", count: 14, children: [
    { id: "lab-cmp", label: "COMP METAB PANEL", count: 6 },
    { id: "lab-lipid", label: "Lipid panels", count: 5 },
    { id: "lab-a1c", label: "HbA1c", count: 3 },
  ] },
  { id: "rad", label: "Radiology", count: 2, children: [
    { id: "rad-cxr", label: "Chest X-ray", count: 2 },
    { id: "rad-dicom", label: "DICOM", count: 0 },
  ] },
  { id: "consent", label: "Consents", count: 3 },
  { id: "referral", label: "Referrals", count: 5 },
]

/** Minimap buckets — monthly event counts over 2 years (deterministic). */
export const fixtureMinimapBuckets: Array<{ at: string; count: number }> = [
  { at: "2024-09-01", count: 3 }, { at: "2024-10-01", count: 5 }, { at: "2024-11-01", count: 2 },
  { at: "2024-12-01", count: 7 }, { at: "2025-01-01", count: 4 }, { at: "2025-02-01", count: 3 },
  { at: "2025-03-01", count: 8 }, { at: "2025-04-01", count: 5 }, { at: "2025-05-01", count: 2 },
  { at: "2025-06-01", count: 6 }, { at: "2025-07-01", count: 4 }, { at: "2025-08-01", count: 3 },
  { at: "2025-09-01", count: 6 }, { at: "2025-10-01", count: 5 }, { at: "2025-11-01", count: 2 },
  { at: "2025-12-01", count: 4 }, { at: "2026-01-01", count: 9 }, { at: "2026-02-01", count: 6 },
  { at: "2026-03-01", count: 5 }, { at: "2026-04-01", count: 3 }, { at: "2026-05-01", count: 7 },
  { at: "2026-06-01", count: 5 }, { at: "2026-07-01", count: 8 }, { at: "2026-08-01", count: 11 },
  { at: "2026-09-01", count: 9 },
]

/** Launcher groups — clinic module families shown in the waffle flyout. */
export const fixtureLauncherGroups = [
  { id: "clinical", label: "Clinical" },
  { id: "documents", label: "Documents" },
  { id: "operations", label: "Operations" },
  { id: "admin", label: "Admin" },
]

/** Launcher apps — one tile per clinic module; category drives the tint. */
export const fixtureLauncherApps: LauncherApp[] = [
  { id: "chart", label: "Chart", icon: Stethoscope, category: "notes", group: "clinical" },
  { id: "schedule", label: "Schedule", icon: CalendarDays, category: "appointments", group: "clinical" },
  { id: "vitals", label: "Vitals", icon: HeartPulse, category: "vitals", group: "clinical" },
  { id: "orders", label: "Orders", icon: ClipboardList, category: "orders", group: "clinical" },
  { id: "problems", label: "Problems", icon: ShieldAlert, category: "problems", group: "clinical" },
  { id: "results", label: "Results", icon: FlaskConical, category: "labs", group: "documents" },
  { id: "notes", label: "Notes", icon: NotebookPen, category: "notes", group: "documents" },
  { id: "imaging", label: "Imaging", icon: Scan, category: "documents", group: "documents" },
  { id: "rx", label: "Prescriptions", icon: PillBottle, category: "medications", group: "documents" },
  { id: "messages", label: "Messages", icon: Mail, category: "communications", group: "operations" },
  { id: "billing", label: "Billing", icon: Receipt, category: "alerts", group: "operations" },
  { id: "reports", label: "Reports", icon: BarChart3, category: "orders", group: "operations" },
  { id: "tasks", label: "Tasks", icon: ListChecks, category: "notes", group: "operations" },
  { id: "directory", label: "Directory", icon: Users, category: "communications", group: "admin" },
  { id: "immunizations", label: "Immunizations", icon: Syringe, category: "immunizations", group: "admin" },
  { id: "settings", label: "Settings", icon: Settings, category: "notes", group: "admin" },
]

/** Default rail shortcuts (5 — the daily modules). */
export const fixtureLauncherPinned = ["chart", "schedule", "messages", "results", "rx"]

/** Reconciliation — mixed decisions across the three sections. */
export const fixtureReconItems: ReconciliationItem[] = [
  { id: "m1", kind: "medication", label: "Metformin 500 mg", detail: "2× daily, oral · refills 3", decision: "keep" },
  { id: "m2", kind: "medication", label: "Lisinopril 10 mg", detail: "1× daily, oral", decision: "keep" },
  { id: "m3", kind: "medication", label: "Ibuprofen 400 mg", detail: "PRN pain · duplicates lisinopril-HCTZ concern", decision: "stop" },
  { id: "m4", kind: "medication", label: "Hydrochlorothiazide 25 mg", detail: "1× daily — possible duplicate therapy", decision: "undecided" },
  { id: "m5", kind: "medication", label: "Albuterol inhaler", detail: "PRN dyspnea · last filled 2023", decision: "inactivate" },
  { id: "a1", kind: "allergy", label: "Penicillin", detail: "rash · documented 2019", decision: "keep" },
  { id: "a2", kind: "allergy", label: "Sulfa drugs", detail: "reported by patient, unverified", decision: "undecided" },
  { id: "p1", kind: "problem", label: "Type 2 diabetes", detail: "ICD-10 E11.9 · since 2018", decision: "keep" },
  { id: "p2", kind: "problem", label: "Seasonal allergic rhinitis", detail: "resolved 2024", decision: "inactivate" },
]

/** Note history — newest first. */
export const fixtureNoteHistory: NoteHistoryEntry[] = [
  { id: "h1", at: "2026-09-21 14:32", author: "Dr. A. Chen", note: "Reconciled against discharge summary from St. Mary's; stopped duplicate NSAID." },
  { id: "h2", at: "2026-09-15 09:05", author: "Nurse P. Rivera", note: "Patient reports OTC ibuprofen use 2–3×/week for knee pain." },
  { id: "h3", at: "2026-08-30 16:47", author: "Dr. A. Chen", note: "Inactivated albuterol — no rescue use in 18 months, spirometry normal." },
  { id: "h4", at: "2026-08-02 11:12", author: "Pharmacist T. Okafor", note: "Verified metformin dose against pharmacy fill history." },
]

/** Superbill code groups — Procedures / Diagnoses / Injections. */
export const fixtureCodeGroups: CodeGroup[] = [
  { id: "proc", label: "Procedures (CPT)", codes: [
    { code: "99213", label: "Office visit, established, 20–29 min", selected: true },
    { code: "99214", label: "Office visit, established, 30–39 min" },
    { code: "36415", label: "Venipuncture, routine" },
    { code: "83036", label: "Hemoglobin A1c" },
    { code: "90471", label: "Vaccine administration, single" },
  ] },
  { id: "dx", label: "Diagnoses (ICD-10)", codes: [
    { code: "E11.9", label: "Type 2 diabetes, without complications", selected: true },
    { code: "I10", label: "Essential hypertension", selected: true },
    { code: "J30.9", label: "Allergic rhinitis, unspecified" },
    { code: "M17.11", label: "Osteoarthritis, right knee" },
  ] },
  { id: "inj", label: "Injections / Supplies", codes: [
    { code: "J1100", label: "Dexamethasone 1 mg" },
    { code: "20610", label: "Arthrocentesis, major joint" },
  ] },
]

/** Documentation templates + the derived summary a template produces. */
export const fixtureTemplates = [
  { id: "awv", label: "Annual Wellness Visit" },
  { id: "ccf", label: "Chronic Care Follow-up" },
  { id: "preop", label: "Pre-Op Clearance" },
]

export const fixtureSummarySegments: SummarySegment[] = [
  { id: "s1", text: "63-year-old male presents for chronic care follow-up. " },
  { id: "s2", text: "Blood pressure today 128/78 mmHg", controlId: "bp" },
  { id: "s3", text: ", consistent with goal <130/80. " },
  { id: "s4", text: "Diabetes managed with metformin 500 mg twice daily", controlId: "meds" },
  { id: "s5", text: "; " },
  { id: "s6", text: "HbA1c 6.8%", controlId: "a1c" },
  { id: "s7", text: " (goal <7.0). Continue current regimen; recheck A1c in 6 months", controlId: "plan" },
  { id: "s8", text: "." },
]

/** Audit provenance (history reuses fixtureNoteHistory). */
export const fixtureAudit = {
  createdBy: "Dr. A. Chen",
  createdAt: "2026-08-02T11:12:00Z",
  modifiedBy: "Nurse P. Rivera",
  modifiedAt: "2026-09-15T09:05:00Z",
  revision: 4,
}

/** Portal inbox tiles — Messages 0 / Chart 3 / Appointments 1 / Announcements 0. */
export const fixtureInboxTiles = [
  { icon: Mail, title: "Messages", count: 0, emptyLabel: "No New Messages" },
  { icon: FileText, title: "Chart", count: 3, previews: [
    { id: "p1", at: "09/12", label: "Lab result — COMP METAB PANEL", sourceTag: "(MH)" },
    { id: "p2", at: "09/08", label: "Visit summary — Dr. Chen" },
  ] },
  { icon: CalendarDays, title: "Appointments", count: 1, previews: [
    { id: "p3", at: "10/03", label: "Follow-up, 9:30 AM" },
  ] },
  { icon: Megaphone, title: "Announcements", count: 0, emptyLabel: "No New Announcements" },
]

/** Inbox groups — internal mail dialect; group headers are date ranges. */
export const fixtureMessageGroups = [
  { label: "Date: Today", rows: [
    { sender: "St. Mary's Lab", subject: "Re: CMP — Smith, Michael", at: "08:42", read: false, hasAttachment: true },
    { sender: "Front Desk", subject: "Check-in note for 9:30", at: "08:15", read: false },
    { sender: "Wellspring Pharmacy", subject: "Rx refill request: Metformin", at: "07:58", read: true },
  ] },
  { label: "Date: 3 Weeks Ago", rows: [
    { sender: "Dr. L. Nguyen", subject: "Curbside consult — abx choice", at: "Sep 06", read: true },
    { sender: "Billing Office", subject: "Claim 2026-09-0011 adjusted", at: "Sep 05", read: true, hasAttachment: true },
  ] },
]

/** Ops series — visibility-bound chart series (colors via category vars). */
export const fixtureOpsSeries = [
  { id: "visits", label: "Visits", color: "var(--color-things-blue)" },
  { id: "procedures", label: "Procedures", color: "var(--color-things-teal)" },
  { id: "noshows", label: "No-shows", color: "var(--color-things-gold)" },
]

/** Ops chart — 12 deterministic months. */
export const fixtureOpsChart = [
  { month: "Oct 25", visits: 388, procedures: 151, noshows: 19 },
  { month: "Nov 25", visits: 402, procedures: 160, noshows: 24 },
  { month: "Dec 25", visits: 351, procedures: 138, noshows: 31 },
  { month: "Jan 26", visits: 409, procedures: 166, noshows: 22 },
  { month: "Feb 26", visits: 397, procedures: 158, noshows: 18 },
  { month: "Mar 26", visits: 421, procedures: 173, noshows: 20 },
  { month: "Apr 26", visits: 430, procedures: 178, noshows: 17 },
  { month: "May 26", visits: 415, procedures: 170, noshows: 26 },
  { month: "Jun 26", visits: 436, procedures: 182, noshows: 15 },
  { month: "Jul 26", visits: 428, procedures: 175, noshows: 21 },
  { month: "Aug 26", visits: 442, procedures: 186, noshows: 19 },
  { month: "Sep 26", visits: 418, procedures: 169, noshows: 23 },
]

export const fixtureReportPeriods = [
  { id: "mtd", label: "Month to date" },
  { id: "q3", label: "Q3 2026" },
  { id: "ytd", label: "Year to date" },
]

/** Top-5 downtime, ranked bars + sync-highlighted events. */
export const fixtureTopDowntime = [
  { id: "net", label: "Network outage", count: 9, events: [
    { at: "09/18 14:02", label: "Switch closet B — 26 min" },
    { at: "08/30 09:11", label: "ISP failover — 12 min" },
  ] },
  { id: "power", label: "Power event", count: 6, events: [
    { at: "09/02 16:40", label: "UPS transfer — 8 min" },
  ] },
  { id: "ehr", label: "EHR slowdown", count: 5, events: [
    { at: "09/22 10:05", label: "Search index rebuild — 40 min" },
  ] },
  { id: "labiface", label: "Lab interface", count: 3, events: [
    { at: "09/11 07:30", label: "HL7 queue stall — 15 min" },
  ] },
  { id: "printer", label: "Check-in printer", count: 2, events: [
    { at: "09/25 08:20", label: "Kiosk 2 offline — 10 min" },
  ] },
]

/** Active ops alerts (clinic use: critical labs, unsigned notes). */
export const fixtureOpsAlerts: OpsAlert[] = [
  { id: "al1", severity: "critical", label: "Freezer A temp out of range", count: 3, at: "09/28 06:12" },
  { id: "al2", severity: "critical", label: "Lab interface queue > 500", count: 1, at: "09/28 05:48" },
  { id: "al3", severity: "warn", label: "Unsigned notes ≥ 10", count: 12, at: "09/27 22:00" },
  { id: "al4", severity: "warn", label: "Disk usage 82%", count: 4, at: "09/27 18:30" },
]

/** Site scorecard KPIs. */
export const fixtureKpiMetrics = [
  { label: "Visits today", value: "38", at: "09/28" },
  { label: "Avg wait", value: "12", unit: "min" },
  { label: "Rooms in use", value: "6 / 9" },
]
export const fixtureKpiRows = [
  { label: "Completed visits", value: "31" },
  { label: "No-shows", value: "3", tone: "warn" as const },
  { label: "Critical lab alerts open", value: "0", tone: "ok" as const },
]

/** Meaningful Use board — 4 categories × 3 measures. */
export const fixtureComplianceTiers = ["Measure 1", "Measure 2", "Measure 3"]
export const fixtureCompliance: ComplianceCategory[] = [
  { id: "cpoe", label: "Computerized Provider Order Entry", tiers: [
    { status: "met", detail: ">60% of orders electronic" },
    { status: "met" },
    { status: "na" },
  ] },
  { id: "erx", label: "e-Prescribing", tiers: [
    { status: "met" },
    { status: "partial", detail: "Renewals still paper" },
    { status: "unmet", detail: "Controlled substances pending EPCS" },
  ] },
  { id: "records", label: "Patient Electronic Access", tiers: [
    { status: "met" },
    { status: "met" },
    { status: "partial", detail: "Portal invite accepted by 41%" },
  ] },
  { id: "care", label: "Care Coordination", tiers: [
    { status: "partial" },
    { status: "met" },
    { status: "unmet", detail: "CCD exchange not live with St. Mary's" },
  ] },
]

/** E/M 5×5 — problem axis × risk axis. */
export const fixtureEmRows = [
  "Self-limited problem",
  "Two+ self-limited problems",
  "Undiagnosed problem, uncertain",
  "Acute illness with systemic risk",
  "Chronic with exacerbation / threat",
]
export const fixtureEmCols = [
  "Minimal risk",
  "Low risk",
  "Moderate risk",
  "High risk",
  "Life-threatening",
]

/** Fishbone panels — one flagged value per panel. */
export const fixtureFishboneChem7: Record<string, FishboneValue> = {
  na: { value: "140" }, k: { value: "4.0" }, cl: { value: "102" },
  hco3: { value: "24" }, bun: { value: "16" }, cr: { value: "1.0" },
  glu: { value: "118", flag: "H" },
}
export const fixtureFishboneCbc: Record<string, FishboneValue> = {
  wbc: { value: "6.5" }, hgb: { value: "13.5" }, hct: { value: "41" },
  plt: { value: "118", flag: "L" },
}

/** Body annotations — foot-exam + cardiology mix. */
export const fixtureBodyMarkers: BodyMarker[] = [
  { id: "bm1", regionId: "shin-clinical-r", note: "Neuropathy, monofilament 8/10 sites", tone: "critical" },
  { id: "bm2", regionId: "chest", note: "Murmur, 2/6 systolic", tone: "warn" },
  { id: "bm3", regionId: "forearm-clinical-l", note: "AV fistula, thrills intact", tone: "ok" },
]

/** Vessel regions for the anatomy inspector (silhouette coordinates). */
export const fixtureAnatomyRegions: AnatomyRegion[] = [
  { id: "carotid-l", label: "Carotid (L)", cx: 88, cy: 40 },
  { id: "carotid-r", label: "Carotid (R)", cx: 112, cy: 40 },
  { id: "aorta", label: "Aorta", cx: 100, cy: 80 },
  { id: "coronary", label: "Coronary", cx: 86, cy: 64 },
  { id: "radial-l", label: "Radial (L)", cx: 46, cy: 86 },
  { id: "radial-r", label: "Radial (R)", cx: 154, cy: 86 },
  { id: "femoral-l", label: "Femoral (L)", cx: 80, cy: 156 },
  { id: "femoral-r", label: "Femoral (R)", cx: 120, cy: 156 },
]

/** Immunizations — series × doses (some pending). */
export const fixtureVaccineSeries: VaccineSeries[] = [
  { id: "v-inf", vaccine: "Influenza", doses: [
    { id: "v-inf-1", dose: "Annual 2025", dateGiven: "2025-10-14", site: "L deltoid", route: "IM" },
    { id: "v-inf-2", dose: "Annual 2026", nextDue: "2026-10-01" },
  ] },
  { id: "v-cov", vaccine: "COVID-19", doses: [
    { id: "v-cov-1", dose: "Primary 1", dateGiven: "2021-04-02", site: "R deltoid", route: "IM" },
    { id: "v-cov-2", dose: "Primary 2", dateGiven: "2021-05-08", site: "L deltoid", route: "IM", reaction: "Myalgia ×2 days" },
    { id: "v-cov-3", dose: "Booster 2025", dateGiven: "2025-11-03", site: "R deltoid", route: "IM" },
  ] },
  { id: "v-tdap", vaccine: "Tdap", doses: [
    { id: "v-tdap-1", dose: "Booster", dateGiven: "2020-08-19", site: "L deltoid", route: "IM", nextDue: "2030-08-19" },
  ] },
  { id: "v-pcv", vaccine: "Pneumococcal", doses: [
    { id: "v-pcv-1", dose: "PCV20", nextDue: "2026-10-15" },
  ] },
]

/** Reporting query — fields, a seeded rule, results. */
export const fixtureQueryFields = [
  { id: "name", label: "Patient name", type: "text" as const },
  { id: "mrn", label: "MRN", type: "text" as const },
  { id: "age", label: "Age", type: "number" as const },
  { id: "lastVisit", label: "Last visit", type: "date" as const },
  { id: "pcp", label: "Primary care", type: "select" as const, options: ["Dr. Chen", "Dr. Nguyen", "Dr. Okafor"] },
]
export const fixtureQueryRulesSeed = [
  { id: "q1", fieldId: "pcp", op: "is", value: "Dr. Chen" },
  { id: "q2", fieldId: "age", op: "≥", value: "60" },
]
export const fixtureQueryResults: Array<Record<string, string>> = [
  { id: "r1", name: "Michael A. Smith", mrn: "000001", age: "46", lastVisit: "2026-09-15", pcp: "Dr. Chen" },
  { id: "r2", name: "วรวุฒิ ศิริธรรม", mrn: "000002", age: "42", lastVisit: "2026-09-21", pcp: "Dr. Chen" },
  { id: "r3", name: "Ana B. Cruz", mrn: "000003", age: "67", lastVisit: "2026-08-30", pcp: "Dr. Chen" },
]
export const fixtureQueryActions = [
  { id: "export", label: "Export CSV" },
  { id: "task", label: "Create care task" },
]

/** Cohort — 6 patients, mixed categories over ~2 years. */
export const fixtureCohortPatients: CohortPatient[] = [
  { id: "c1", name: "Smith, Michael", events: [
    { at: "2025-02-11", category: "medications", label: "Started metformin" },
    { at: "2025-09-02", category: "labs", label: "HbA1c 7.4" },
    { at: "2026-03-18", category: "appointments", label: "Follow-up" },
    { at: "2026-08-27", category: "labs", label: "HbA1c 6.8" },
  ] },
  { id: "c2", name: "ศิริธรรม, วรวุฒิ", events: [
    { at: "2025-01-20", category: "problems", label: "HTN diagnosed" },
    { at: "2025-06-30", category: "medications", label: "Lisinopril" },
    { at: "2026-05-12", category: "appointments", label: "Nephrology referral" },
  ] },
  { id: "c3", name: "Cruz, Ana", events: [
    { at: "2025-04-04", category: "notes", label: "AWV" },
    { at: "2025-11-19", category: "labs", label: "Lipid panel" },
    { at: "2025-11-19", category: "communications", label: "Care-gap call" },
    { at: "2026-07-08", category: "immunizations", label: "PCV20" },
  ] },
  { id: "c4", name: "Doe, Kari", events: [
    { at: "2025-08-15", category: "communications", label: "Portal message" },
    { at: "2026-02-02", category: "appointments", label: "Dermatology" },
    { at: "2026-09-09", category: "notes", label: "Episode visit" },
  ] },
  { id: "c5", name: "Emeka, Tobi", events: [
    { at: "2026-01-27", category: "problems", label: "Type 2 diabetes" },
    { at: "2026-06-14", category: "medications", label: "GLP-1 started" },
    { at: "2026-06-14", category: "notes", label: "Diabetes education" },
  ] },
  { id: "c6", name: "Fischer, Rya", events: [
    { at: "2025-05-05", category: "labs", label: "CMP" },
    { at: "2025-12-23", category: "appointments", label: "Cardiology" },
    { at: "2026-04-30", category: "communications", label: "Refill request" },
  ] },
]
