// Design study — scenario data. Deterministic (seeded PRNG, fixed ISO dates)
// and PHI-free, per the repo's fixture rule: no Date.now(), no Math.random().
// One dataset feeds all three design variants so the comparison is fair.

import type { AllergyRecord, CodedConcept, NameParts, Urgency, VisitStatus } from "@/components/clinic/types"
import { FIXTURE_AS_OF, codedIcd10 } from "@/fixtures/clinic"

export const TODAY = FIXTURE_AS_OF // "2026-09-28"

/** mulberry32 — tiny deterministic PRNG so the registry is the same every run. */
function prng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Scheme = "UC" | "SSO" | "CSMBS" | "Private" | "Self-pay"
export const SCHEMES: Scheme[] = ["UC", "SSO", "CSMBS", "Private", "Self-pay"]

export const PROVIDERS = ["Dr. Test Physician", "Dr. Example Doe", "Dr. Sample Sam", "Dr. Demo Nakamura"] as const
export type Provider = (typeof PROVIDERS)[number]

/** Today's visit status; `null` = registered patient with no visit today. */
export type TodayStatus = Extract<VisitStatus, "arrived" | "in-room" | "done" | "held" | "cancelled"> | null

export interface RegPatient {
  id: string
  mrn: string
  name: NameParts
  dob: string
  sex: "male" | "female"
  phone: string
  scheme: Scheme
  provider: Provider
  lastVisit: string
  visitCount: number
  /** Outstanding balance in THB. */
  balance: number
  allergies: AllergyRecord[]
  status: TodayStatus
  urgency: Urgency
  arrivedAt?: string
  waitMinutes?: number
}

const TH_GIVEN_M = ["วรวุฒิ", "สมคิด", "ธนากร", "ปิยะ", "อนุชา", "กิตติพงษ์", "ณัฐวุฒิ", "ประเสริฐ"]
const TH_GIVEN_F = ["สุดารัตน์", "พิมพ์ชนก", "กัญญา", "วิภาวดี", "นภัสสร", "อรุณี", "ศิริพร", "จันทร์เพ็ญ"]
const TH_FAMILY = ["ศิริธรรม", "สอนประเสริฐ", "วงศ์สวัสดิ์", "ทองดี", "แสงอรุณ", "มั่นคง", "ศรีสุข", "บุญมา", "พรหมวงศ์", "รักษ์ไทย"]
const EN_GIVEN_M = ["Michael", "James", "Daniel", "Oliver", "Henry"]
const EN_GIVEN_F = ["Carly", "Emma", "Grace", "Sophie", "Hannah"]
const EN_FAMILY = ["Smith", "Kakasuleff", "Turner", "Walsh", "Bennett", "Reyes"]
const JA_GIVEN_M = ["Haruto", "Ren", "Sota"]
const JA_GIVEN_F = ["Yui", "Aoi", "Sakura"]
const JA_FAMILY = ["Tanaka", "Suzuki", "Watanabe", "Kobayashi"]

const ALLERGY_POOL: AllergyRecord[] = [
  { allergen: "Penicillin", reaction: "rash", severity: "moderate", recordedAt: "2024-01-10" },
  { allergen: "Ace Inhibitors", reaction: "angioedema", severity: "severe", recordedAt: "2022-06-02" },
  { allergen: "Sulfonamides", reaction: "hives", severity: "moderate", recordedAt: "2021-03-14" },
  { allergen: "NSAIDs", reaction: "wheeze", severity: "moderate", recordedAt: "2020-11-30" },
  { allergen: "Latex", reaction: "contact dermatitis", severity: "mild", recordedAt: "2019-05-21" },
]

const pick = <T,>(r: () => number, xs: readonly T[]) => xs[Math.floor(r() * xs.length)]
const pad = (n: number, w: number) => String(n).padStart(w, "0")
const isoDay = (y: number, m: number, d: number) => `${y}-${pad(m, 2)}-${pad(d, 2)}`

function buildRegistry(count: number): RegPatient[] {
  const r = prng(20260928)
  const out: RegPatient[] = []
  for (let i = 0; i < count; i++) {
    const sex: "male" | "female" = r() < 0.5 ? "male" : "female"
    const culture = r()
    let name: NameParts
    if (culture < 0.62) {
      name = {
        title: sex === "male" ? "นาย" : r() < 0.5 ? "นาง" : "นางสาว",
        given: pick(r, sex === "male" ? TH_GIVEN_M : TH_GIVEN_F),
        family: pick(r, TH_FAMILY),
      }
    } else if (culture < 0.85) {
      name = { given: pick(r, sex === "male" ? EN_GIVEN_M : EN_GIVEN_F), family: pick(r, EN_FAMILY) }
    } else {
      name = { given: pick(r, sex === "male" ? JA_GIVEN_M : JA_GIVEN_F), family: pick(r, JA_FAMILY) }
    }
    const year = 1946 + Math.floor(r() * 74)
    const dob = isoDay(year, 1 + Math.floor(r() * 12), 1 + Math.floor(r() * 28))
    const lastMonth = 1 + Math.floor(r() * 9)
    const lastVisit = isoDay(2026, lastMonth, 1 + Math.floor(r() * 27))
    const allergies = r() < 0.22 ? [ALLERGY_POOL[Math.floor(r() * ALLERGY_POOL.length)]] : []
    const today = r()
    // ~30% of the registry has a visit today; the rest are "not today".
    let status: TodayStatus = null
    if (today < 0.12) status = "arrived"
    else if (today < 0.17) status = "in-room"
    else if (today < 0.26) status = "done"
    else if (today < 0.28) status = "held"
    else if (today < 0.30) status = "cancelled"
    const hasVisit = status !== null
    const arrivalMin = 7 * 60 + 30 + Math.floor(r() * 150)
    const urgencyRoll = r()
    out.push({
      id: `p${pad(i + 3, 4)}`,
      mrn: pad(100003 + i * 7, 6),
      name,
      dob,
      sex,
      phone: `08${Math.floor(r() * 10)}-${pad(Math.floor(r() * 1000), 3)}-${pad(Math.floor(r() * 10000), 4)}`,
      scheme: pick(r, SCHEMES),
      provider: pick(r, PROVIDERS),
      lastVisit: hasVisit ? TODAY : lastVisit,
      visitCount: 1 + Math.floor(r() * 24),
      balance: r() < 0.18 ? Math.round(r() * 48) * 50 : 0,
      allergies,
      status,
      urgency: urgencyRoll < 0.8 ? "routine" : urgencyRoll < 0.94 ? "rush" : "urgent",
      arrivedAt: hasVisit ? `${pad(Math.floor(arrivalMin / 60), 2)}:${pad(arrivalMin % 60, 2)}` : undefined,
      waitMinutes: status === "arrived" || status === "held" ? 2 + Math.floor(r() * 55) : undefined,
    })
  }
  return out
}

/** The scenario's featured patient: Thai chart, penicillin allergy — the
 *  amoxicillin order on page 3 trips the allergy check in every variant. */
export const featuredPatient: RegPatient = {
  id: "p0001",
  mrn: "000002",
  name: { title: "นาย", given: "วรวุฒิ", family: "ศิริธรรม" },
  dob: "1984-03-20",
  sex: "male",
  phone: "081-234-5678",
  scheme: "SSO",
  provider: "Dr. Test Physician",
  lastVisit: TODAY,
  visitCount: 9,
  balance: 0,
  allergies: [{ allergen: "Penicillin", reaction: "ผื่น (rash)", severity: "moderate", recordedAt: "2024-01-10" }],
  status: "arrived",
  urgency: "rush",
  arrivedAt: "08:10",
  waitMinutes: 18,
}

const secondPatient: RegPatient = {
  id: "p0002",
  mrn: "000001",
  name: { given: "Michael", middle: "A.", family: "Smith", suffix: "Jr." },
  dob: "1980-03-15",
  sex: "male",
  phone: "089-555-0102",
  scheme: "Private",
  provider: "Dr. Example Doe",
  lastVisit: TODAY,
  visitCount: 14,
  balance: 1250,
  allergies: [{ allergen: "Ace Inhibitors", reaction: "angioedema", severity: "severe", recordedAt: "2022-06-02" }],
  status: "in-room",
  urgency: "routine",
  arrivedAt: "07:52",
}

export const REGISTRY: RegPatient[] = [featuredPatient, secondPatient, ...buildRegistry(186)]

export function formatName(n: NameParts): string {
  const isThai = /[฀-๿]/.test(n.given)
  if (isThai) return [n.title, n.given, n.family].filter(Boolean).join(" ")
  return [`${n.family},`, n.given, n.middle, n.suffix].filter(Boolean).join(" ")
}

export function ageOf(dob: string, asOf = TODAY): number {
  const [y, m, d] = dob.split("-").map(Number)
  const [ay, am, ad] = asOf.split("-").map(Number)
  return ay - y - (am < m || (am === m && ad < d) ? 1 : 0)
}

export const STATUS_LABEL: Record<Exclude<TodayStatus, null>, string> = {
  arrived: "Waiting",
  "in-room": "In exam",
  done: "Completed",
  held: "On hold",
  cancelled: "Cancelled",
}

/* ——— visit history (page 2 inspector) ———————————————————————— */

export interface PastVisit {
  id: string
  date: string
  provider: Provider
  dx: CodedConcept
  bp: [number, number]
  weight: number
  charge: number
}

export function visitHistory(p: RegPatient): PastVisit[] {
  const r = prng(Number(p.mrn) + 17)
  const n = Math.min(8, Math.max(3, p.visitCount))
  const out: PastVisit[] = []
  let month = 9
  let year = 2026
  for (let i = 0; i < n; i++) {
    month -= 1 + Math.floor(r() * 3)
    if (month < 1) {
      month += 12
      year -= 1
    }
    out.push({
      id: `${p.id}-v${i}`,
      date: isoDay(year, month, 1 + Math.floor(r() * 27)),
      provider: pick(r, PROVIDERS),
      dx: pick(r, codedIcd10),
      bp: [118 + Math.floor(r() * 34), 74 + Math.floor(r() * 20)],
      weight: Math.round((68 + r() * 22) * 10) / 10,
      charge: 300 + Math.round(r() * 30) * 50,
    })
  }
  return out
}

/* ——— drug catalogue (page 3) ——————————————————————————————— */

export type DrugClass =
  | "penicillin" | "cephalosporin" | "macrolide" | "quinolone" | "ace-inhibitor" | "arb"
  | "ccb" | "statin" | "biguanide" | "sulfonylurea" | "nsaid" | "analgesic" | "ppi"
  | "antihistamine" | "bronchodilator" | "corticosteroid" | "antiemetic" | "supplement"

export interface Drug {
  code: string
  name: string
  localName: string
  strength: string
  form: "tab" | "cap" | "syrup" | "inhaler"
  cls: DrugClass
  /** Price per unit, THB. */
  price: number
  defaultFreq: FreqCode
}

export const DRUGS: Drug[] = [
  { code: "AMX500", name: "Amoxicillin", localName: "อะม็อกซีซิลลิน", strength: "500 mg", form: "cap", cls: "penicillin", price: 3, defaultFreq: "TID" },
  { code: "AMC625", name: "Amoxicillin + clavulanate", localName: "อะม็อกซี-คลาวูลาเนต", strength: "625 mg", form: "tab", cls: "penicillin", price: 18, defaultFreq: "BID" },
  { code: "DCX250", name: "Dicloxacillin", localName: "ไดคลอกซาซิลลิน", strength: "250 mg", form: "cap", cls: "penicillin", price: 4, defaultFreq: "QID" },
  { code: "CPX500", name: "Cephalexin", localName: "เซฟาเลกซิน", strength: "500 mg", form: "cap", cls: "cephalosporin", price: 5, defaultFreq: "QID" },
  { code: "AZM250", name: "Azithromycin", localName: "อะซิโทรมัยซิน", strength: "250 mg", form: "tab", cls: "macrolide", price: 22, defaultFreq: "OD" },
  { code: "CIP500", name: "Ciprofloxacin", localName: "ซิโปรฟลอกซาซิน", strength: "500 mg", form: "tab", cls: "quinolone", price: 8, defaultFreq: "BID" },
  { code: "LSN10", name: "Lisinopril", localName: "ลิซิโนพริล", strength: "10 mg", form: "tab", cls: "ace-inhibitor", price: 4, defaultFreq: "OD" },
  { code: "LOS50", name: "Losartan", localName: "โลซาร์แทน", strength: "50 mg", form: "tab", cls: "arb", price: 6, defaultFreq: "OD" },
  { code: "AML5", name: "Amlodipine", localName: "แอมโลดิปีน", strength: "5 mg", form: "tab", cls: "ccb", price: 2, defaultFreq: "OD" },
  { code: "AML10", name: "Amlodipine", localName: "แอมโลดิปีน", strength: "10 mg", form: "tab", cls: "ccb", price: 3, defaultFreq: "OD" },
  { code: "ATV20", name: "Atorvastatin", localName: "อะทอร์วาสแตติน", strength: "20 mg", form: "tab", cls: "statin", price: 6, defaultFreq: "HS" },
  { code: "ATV40", name: "Atorvastatin", localName: "อะทอร์วาสแตติน", strength: "40 mg", form: "tab", cls: "statin", price: 9, defaultFreq: "HS" },
  { code: "SIM20", name: "Simvastatin", localName: "ซิมวาสแตติน", strength: "20 mg", form: "tab", cls: "statin", price: 2, defaultFreq: "HS" },
  { code: "MET500", name: "Metformin", localName: "เมทฟอร์มิน", strength: "500 mg", form: "tab", cls: "biguanide", price: 1, defaultFreq: "BID" },
  { code: "MET850", name: "Metformin", localName: "เมทฟอร์มิน", strength: "850 mg", form: "tab", cls: "biguanide", price: 2, defaultFreq: "BID" },
  { code: "GLP5", name: "Glipizide", localName: "กลิพิไซด์", strength: "5 mg", form: "tab", cls: "sulfonylurea", price: 2, defaultFreq: "OD" },
  { code: "IBU400", name: "Ibuprofen", localName: "ไอบูโพรเฟน", strength: "400 mg", form: "tab", cls: "nsaid", price: 2, defaultFreq: "TID" },
  { code: "NPX250", name: "Naproxen", localName: "นาพรอกเซน", strength: "250 mg", form: "tab", cls: "nsaid", price: 3, defaultFreq: "BID" },
  { code: "PCM500", name: "Paracetamol", localName: "พาราเซตามอล", strength: "500 mg", form: "tab", cls: "analgesic", price: 1, defaultFreq: "PRN" },
  { code: "OMP20", name: "Omeprazole", localName: "โอเมพราโซล", strength: "20 mg", form: "cap", cls: "ppi", price: 3, defaultFreq: "OD" },
  { code: "CTZ10", name: "Cetirizine", localName: "เซทิริซีน", strength: "10 mg", form: "tab", cls: "antihistamine", price: 1, defaultFreq: "HS" },
  { code: "LRT10", name: "Loratadine", localName: "ลอราทาดีน", strength: "10 mg", form: "tab", cls: "antihistamine", price: 2, defaultFreq: "OD" },
  { code: "SAL100", name: "Salbutamol inhaler", localName: "ซัลบูทามอล พ่นสูด", strength: "100 mcg/puff", form: "inhaler", cls: "bronchodilator", price: 95, defaultFreq: "PRN" },
  { code: "PRD5", name: "Prednisolone", localName: "เพรดนิโซโลน", strength: "5 mg", form: "tab", cls: "corticosteroid", price: 1, defaultFreq: "OD" },
  { code: "DMP10", name: "Domperidone", localName: "ดอมเพอริโดน", strength: "10 mg", form: "tab", cls: "antiemetic", price: 1, defaultFreq: "TID" },
  { code: "FES200", name: "Ferrous sulfate", localName: "เฟอรัสซัลเฟต", strength: "200 mg", form: "tab", cls: "supplement", price: 1, defaultFreq: "OD" },
]

export type FreqCode = "OD" | "BID" | "TID" | "QID" | "HS" | "PRN"
export const FREQS: Array<{ code: FreqCode; label: string; perDay: number }> = [
  { code: "OD", label: "Once daily", perDay: 1 },
  { code: "BID", label: "Twice daily", perDay: 2 },
  { code: "TID", label: "Three times daily", perDay: 3 },
  { code: "QID", label: "Four times daily", perDay: 4 },
  { code: "HS", label: "At bedtime", perDay: 1 },
  { code: "PRN", label: "As needed (max 4/day)", perDay: 4 },
]
export const ROUTES = ["Oral", "Inhaled", "Topical"] as const

export const drugLabel = (d: Drug) => `${d.name} ${d.strength} ${d.form}`

/** Allergen text → drug classes it contraindicates (hard stop), plus classes
 *  with known cross-reactivity (warning, override with a reason). */
const ALLERGY_CLASSES: Record<string, { stop: DrugClass[]; caution: DrugClass[] }> = {
  penicillin: { stop: ["penicillin"], caution: ["cephalosporin"] },
  amoxicillin: { stop: ["penicillin"], caution: ["cephalosporin"] },
  "ace inhibitors": { stop: ["ace-inhibitor"], caution: ["arb"] },
  sulfonamides: { stop: [], caution: ["sulfonylurea"] },
  nsaids: { stop: ["nsaid"], caution: [] },
}

export interface AllergyHit {
  level: "critical" | "warn"
  allergen: string
  message: string
}

export function allergyCheck(drug: Drug, allergies: AllergyRecord[]): AllergyHit | null {
  for (const a of allergies) {
    const rule = ALLERGY_CLASSES[a.allergen.toLowerCase()]
    if (!rule) continue
    if (rule.stop.includes(drug.cls))
      return { level: "critical", allergen: a.allergen, message: `${drug.name} is a ${drug.cls} — documented ${a.allergen} allergy (${a.reaction ?? "reaction not recorded"}).` }
    if (rule.caution.includes(drug.cls))
      return { level: "warn", allergen: a.allergen, message: `Possible cross-reactivity: ${drug.cls} with documented ${a.allergen} allergy.` }
  }
  return null
}

/* ——— current medications (page 3 reconciliation) ———————————————— */

export type MedDecision = "continue" | "hold" | "stop"
export interface CurrentMed {
  id: string
  drug: string
  dose: string
  sig: string
  since: string
  prescriber: Provider
  decision: MedDecision
}

export function currentMeds(p: RegPatient): CurrentMed[] {
  if (p.id === featuredPatient.id)
    return [
      { id: "cm1", drug: "Amlodipine", dose: "5 mg", sig: "1 tab once daily", since: "2025-03-15", prescriber: "Dr. Test Physician", decision: "continue" },
      { id: "cm2", drug: "Atorvastatin", dose: "20 mg", sig: "1 tab at bedtime", since: "2026-01-20", prescriber: "Dr. Example Doe", decision: "continue" },
      { id: "cm3", drug: "Metformin", dose: "500 mg", sig: "1 tab twice daily", since: "2024-06-10", prescriber: "Dr. Test Physician", decision: "continue" },
      { id: "cm4", drug: "Omeprazole", dose: "20 mg", sig: "1 cap before breakfast", since: "2026-08-12", prescriber: "Dr. Sample Sam", decision: "continue" },
    ]
  const r = prng(Number(p.mrn) + 101)
  const n = 1 + Math.floor(r() * 4)
  const pool = DRUGS.filter((d) => ["ccb", "statin", "biguanide", "ppi", "arb", "antihistamine"].includes(d.cls))
  return Array.from({ length: n }, (_, i) => {
    const d = pick(r, pool)
    return {
      id: `cm${i}`,
      drug: d.name,
      dose: d.strength,
      sig: FREQS.find((f) => f.code === d.defaultFreq)!.label.toLowerCase(),
      since: isoDay(2025, 1 + Math.floor(r() * 12), 1 + Math.floor(r() * 27)),
      prescriber: pick(r, PROVIDERS),
      decision: "continue" as const,
    }
  })
}

export const ICD10 = codedIcd10
export const PHARMACY = "Siri Pharmacy (in-house)"
