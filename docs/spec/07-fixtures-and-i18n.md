# 07 — Fixtures & i18n

Demo data is a repo deliverable (`AGENTS.md`: realistic content, never invent
UI strings the spec doesn't define). This file fixes the content plan so every
implementer writes the same fixtures once.

---

## 1. Location and shape

- **File:** `app/frontend/fixtures/clinic.ts` (the `fixtures/` module already
  exists for the task-app stories).
- **Deterministic literals only.** No fetches, no `Math.random()`, no
  `Date.now()` — screenshots and future visual regression must be stable. Use
  fixed ISO strings.
- **Typed against the catalog.** Fixtures import the shared types from
  `components/clinic/types.ts` so drift fails `tsc`, not a story.
- **Not `data.ts`.** That file is the Things clone's sample data; clinic
  fixtures live separately.

## 2. The no-PHI rule

**No PHI, ever** — not even fake-but-plausible national ID numbers in a shape
that could validate. Use obviously synthetic values:

- National ID: `1-0000-00000-00-0` (shape without substance)
- Phone: `(317) 555-01xx` range only
- MRN/CN: `000001`, `000002` — as the source itself uses
- No real drug-allergy combinations that look like a real chart; the fixture
  patients are obviously synthetic (Smith/Test/ตัวอย่าง).

## 3. Required fixture set

Two primary patients thread through almost every story:

### Patient A — English chart ("Michael Smith-like", 46y male)
- Problems: Chronic Kidney Disease, Diabetes Type II, Esophageal Reflux,
  Asthma (ICD-10 codes as literals)
- Allergies: Ace Inhibitors (rash), Amoxicillin (body rash), Latex (hives),
  Peanut (dizziness)
- Medications: aspirin 81 mg, lisinopril 30 mg, metformin 1,000 mg (one
  terminated span for `MedicationTimeline`), Crestor 10 mg
- Vitals: full strip with one abnormal (BP 140/95) and one missing cell
- Labs: COMP METAB PANEL (GLUCOSE,FASTING 120 **H** + interpretive note;
  12 normal analytes with ranges + UOM) + lipid panel with bilingual names
  ("Cholesterol / ไขมันในเลือด")
- Timeline: 6 lanes × 3–6 events over ~2 months; one event with rich detail
  (regimen 1-0-0, episode link, ATC code) for `EventDetailPopover`
- BP trend points spanning 2y for `TrendChart` + `RangeToggle`
- Messages: a mixed stream — 2 chat turns, 1 quote block (From/Sent/To/Subject),
  1 system marker, 1 file attachment ("Doc ID #1970: LabCorp Results.jpg") and
  1 chart-ref attachment ("Chart #9562; Smith, Michael; Male; Age: 46y")

### Patient B — Thai chart (วรวุฒิ ศิริธรรม, 42y — reused across banner, queue,
SOAP, prescription stories to prove Thai rendering)
- Name parts: `{ title: "นาย", given: "วรวุฒิ", family: "ศิริธรรม" }`
- Age composite: `{ years: 42, months: 6, days: 8 }`
- Address: ประชาอุทิศ บางบอน เขตบางขวาง? — use the source's shape:
  ถ.ประชาอุทิศ แขวงบางบอน เขตบางแขก จ.กรุงเทพฯ 10180
- SOAP note in Thai; sig "ทา - - วันละ 2 ครั้ง@เช้า-เย็น"; lab
  "ไขมันในเลือด / ไขมันในเลือดสูง"
- Queue rows: 4 entries across all status tones, incl. นาย สมคิด สอนประเสริฐ

### Shared sets
- **Queue:** 5 rows covering arrived / accepted / held / done / cancelled
- **Schedule:** one week, 3 visit types mapped to 3 category tones, Thai + EN
  patient names mixed
- **Directory:** 6 staff with roles (physician, nurse/พยาบาล, pharmacist) for
  `RecipientPicker`
- **Diagnoses:** ICD-10 trio; **drugs:** Lipitor tree (4 strengths, one flagged
  branch) + Betadine line for the sig fixture
- **Superbill:** alphabet-grouped patients (A/B/C) with visit rows

## 4. i18n key plan

Every user-visible string a clinic component renders lives in
`app/frontend/i18n/{en,th,ja}.json` — **all three files, same change**. Key
conventions:

```jsonc
{
  "clinic.vitals.bp.abbr": "BP",              // identical in all three locales
  "clinic.vitals.bp.full": "Blood pressure",  // "ความดันโลหิต" / "血圧"
  "clinic.allergy.noKnown": "No known drug allergies",   // "ไม่มีประวัติแพ้ยา"
  "clinic.allergy.notRecorded": "Allergy status not recorded",
  "clinic.allergy.record": "Record allergies",
  "clinic.queue.arrived": "Arrived",          // มา
  "clinic.queue.accepted": "Accepted",        // รับ
  "clinic.queue.held": "Held",                // อั้น
  "clinic.queue.waitMinutes": "Wait {minutes} min",
  "clinic.rx.interactionsPending": "Interactions pending",
  "clinic.common.none": "— None"              // the none sentinel leads every optional picklist
}
```

Rules:

- **Clinical abbreviations are identical keys in all three locales** (02 §6.4)
  — only the `.full` expansions translate.
- Components accept `label`/`placeholder` props for fixture-driven text; they
  read i18n only for built-in vocabulary (states, tones, empty states).
- Thai fixtures must appear in the same story as English wherever feasible —
  that is what proves wrapping, clipping, and the `:lang(th)` density guard.
- Dates render through `lib/dates.ts` `Intl` conventions; decide Buddhist era
  (`th-TH-u-ca-buddhist`) once and state it in the UI (02 §6.2).

## 5. Fixture checklist per phase

| Phase | Fixtures needed |
|---|---|
| 0 | types + empty scaffolding |
| 1 | none beyond primitives |
| 2 | Patient A + B identity, alerts |
| 3 | queue (5 tones), directory, mini-schedule week |
| 4 | meds + spans, labs + panels, timeline events, BP points, messages stream, SOAP texts (EN/TH), drug tree, order sets |
| 5 | superbill groups, vaccine schedule, document tree |
