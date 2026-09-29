# 01 — Source analysis (adjudicated)

Every file in the analyzed screenshot collection (**41 images** across 3 folders),
what it shows, and what it contributes. Where the two parent packages read the
same low-res Thai text differently, the reading below was **verified by opening
the screenshot**; disputes are marked ⚖️ with the outcome.

Three products at three maturity levels — that gap is the method:

| Set | Product | Era / stack | What we take from it |
|---|---|---|---|
| Set A (Thai VB6 product) | an unnamed 2006-era Thai clinic product | VB6, Windows, Thai | **Workflow.** Which screens a small Thai clinic needs, in what order |
| Set B (English WinForms EMR) | an unnamed 2014-era English WinForms EMR | WinForms desktop, English | **Data structures.** 27 screens of grids, flowsheets, timelines, code pickers |
| Set C (mixed sources) | open-source EMRs, timeline tools, portal UIs, a cardiology cath-lab system, a SCADA dashboard | Mixed | **Visualisation + the modern target look** |

---

## 1. Set A (Thai VB6 product) — the workflow spine (6 screens)

Filenames encode the clinic's stage order — the most useful fact in the folder:
`01.x` = front desk, `02.x` = doctor's room, `02.1–02.4` = tabs *within* one
encounter.

### `01.1 ประวัติ.png` — Registration / patient record

Split screen. Left: search bar (CN / ชื่อ / สกุล + ค้นชื่อ-สกุล) above the
registration form (CN, คำนำหน้า title, ชื่อ/สกุล name, เพศ sex radios, วันเกิด
DOB + auto-computed age ปี/ด/ว, address cascade ที่อยู่→ตำบล→อำเภอ→จังหวัด,
รหัสไปรษณีย์, อาชีพ occupation, โทร phone). Below it an entitlement group
(สถานะ status — value reads like บัตรทอง "Gold Card", a second scheme select,
หน่วยงาน service-unit dropdown). ⚖️ *One parent package described this group as
"message to doctor with ด่วน-ไม่ด่วน urgency"; the screenshot shows an
entitlement-shaped group (scheme selects + หน่วยงาน dropdown) — the entitlement
reading stands; an urgency select at low confidence.* Bottom: the action bar
(นำเข้า?, disabled ประวัติ/สั่งตรวจ, ค้นหา…, ยกเลิก disabled, พิมพ์ OPD,
ปิด/Esc) with disabled states visible and an Esc suffix. Right: **คิวตรวจ**
waiting queue.

⚖️ **The queue legend reads มา (arrived) · รับ (accepted) · อั้น (held)** — a
*queue-processing* legend, **not triage levels** (one parent package misread it
as ปกติ/รีบ/ด่วน; the pixels show มา/รับ/อั้น). The grid: CN | ชื่อ-สกุล | เวลา |
หมายเหตุ, one green-dot row, green progress scrollbar. Below, the patient photo
panel (ภาพ) with เลือกภาพ / ลบภาพ.

**Contributes:** registration-form fields (→ `FormGrid` demo), `AddressCascade`
(screen-local), `StatusDot`/`StatusLegend` (queue tones), `QueueTable`,
`PatientIdentityCard` (photo panel), `FormActionBar`, `PatientPickerDialog`
trigger chain.

### `01.2 ค้นประวัติ.png` — Patient search modal

Modal ค้นหาผู้ป่วย over the registration screen: branded header band, results
table (CN | ชื่อ-สกุล | อายุ | ที่อยู่), blue full-row selection, เลือก / ยกเลิก
footer.

**Contributes:** `PatientPickerDialog` (grid + Select/Cancel footer), row
selection semantics for `DataTable`.

### `02.1 ห้องแพทย์ SOAP.png` — Exam room, history & diagnosis

The densest screen in the set and the template for the encounter workspace:

- **ข้อมูลพื้นฐาน** header: CN, name, age (ปี/ด/ว), address, national ID
  (`1-2341-23412-34-1` — dash-grouped, masked entry).
- **แพ้ยา** banner in red — here reading **ไม่มีประวัติแพ้ยา** ("no known drug
  allergy") *in the same red used for real allergies* — a defect we fix with a
  three-state banner (see 02 §4.3).
- Vitals strip: BW · H · BP (two fields) · Pulse · BMI · IBW, with computed
  fields tinted; **CC** chief-complaint full-width.
- Action bar with F-key hints baked into labels: ประวัติการรักษา/F2 · Alert/F3 ·
  รับ OPD · ประวัติเก่า/F1 · ออก/Esc.
- ⚖️ Encounter tabs (merged reading from both parents + re-read):
  **ประวัติ-วินิจฉัย [F5] · สั่งยา [F6] · สั่ง LAB [F7] · โปรแกรมอื่นๆ [F8] ·
  ข้อมูลภาพ · คิดเงิน [F9]** — "สั่งยา" and "คิดเงิน" confirmed; "โปรแกรมอื่นๆ"
  confirmed (the other parent's "ใบรับรองแพทย์" is not on the pixels); the
  fifth tab is low-confidence.
- Inside the tab: **PI / PE / Note** stacked labeled textareas left; right a
  diagnosis autocomplete ("type a partial name, press Enter") writing into a
  รหัสโรค / ชื่อโรค coded table.
- The queue panel persists on the right across every tab — that persistence is
  the feature.

**Contributes:** `PatientHeaderBar`, `AllergyBanner`, `VitalsStrip`,
`KeyHintButton` (F-hints), `CodedSearchInput`, coded items table (→
`LineItemTable`), context-pane persistence rule.

### `02.2` / `02.3 ห้องแพทย์ Prescription.png` — Prescribing

`02.2`: the drug autocomplete open — a flat alphabetical English drug file
(Acetylcysteine Syrup … Cephalexin Syrup Y; "Alprazolam 0.5 mg" highlighted),
with order-line fields รหัสยา / ชื่อยา / ชื่อการค้า / สรรพคุณ / วิธีใช้ยา /
คำเตือน / จำนวน. `02.3`: the filled row — BTD1 / Betadine Solution / Betadine,
direction code **`1xApply2` auto-expanding to the Thai sig "ทา - - วันละ 2
ครั้ง@เช้า-เย็น"** (apply twice daily, morning–evening; the field stays
editable), warning picklist, quantities 16 / 10 หน่วย, items row with green
dot, Generic-vs-TradName radios.

⚖️ **The four buttons are บันทึก (save) · สั่งสูตร (apply order set) ·
บันทึกสูตร (save as order set) · ลบ (delete)** — confirmed on the pixels. One
parent package missed the order-set pair entirely; the other parent caught it.
Order sets/templates are therefore a first-class pattern (pattern #5).

**Contributes:** `OrderEntryForm(kind="drug")`, `SigBuilder` (code → human
sentence, editable), `OrderSetButtons`, `LineItemTable`, and the insight that
**drug entry is code-first, name-second**.

### `02.4 ห้องแพทย์ Lab Order.png` — Lab order

Same shell, LAB tab. The item row reads clearly:
**รหัส 004 · ชื่อ Lab = Cholesterol · Thai name ไขมันในเลือด · ค่าปกติ 0 ถึง 35
(normal range) · ค่าอันตราย 150 (critical value) · ทุน 250 (cost)**, a
result-type select (ตัวเลข numeric), a related-problem dropdown
(ไขมันในเลือดสูง = hyperlipidemia). Buttons บันทึก / ลบ / Print. Result grid:
รหัส Lab | ชื่อ Lab มาตรฐาน | ชื่อ Lab ภาษาไทย | ถึง | ค่าตรวจ | ผล | Normal |
อธิบาย. Footer: ค่าธรรมเนียม LAB 35 · ราคารวม LAB 150 · ☐ คิด LAB แบบรวม
(bundle billing).

⚖️ **The critical value (ค่าอันตราย 150) is real** — one parent package
misread the row as cost/price/result and dropped the critical value from its
order form; the pixels and the grid columns confirm normal-range + critical +
cost. The safety pattern survives into `OrderEntryForm(kind="lab")`.

**Contributes:** `OrderEntryForm(kind="lab")` with `normalRange` +
`criticalValue` + `showCost` (Thai market: cost lives on the clinical row),
`LineItemTable` totals footer with bundle checkbox, bilingual item naming.

---

## 2. Set B (English WinForms EMR) — the data-structure library (27 screens)

All 27 share one chrome, documented once; then only what each screen adds.

### The shared shell (visible on ~22)

Left **task rail**: "My Tasks" with live counts — Communication (8), Health
Exchange (0), Orders (69), Superbill (149), Soap Notes (368), eDocuments (9),
Refills (9), Reminder (3), Patient Portal (22), Fax (3) — then a mini month
calendar (today amber), then collapsible filter panels, then a **module
switcher** (Administration, Setup, Reports, EMR, iScheduler, Billing,
eDocuments, Desktop). Second column: collapsible panels — *Clinician's
Schedule* (status table Scheduled/Checked-In/Checked-Out/No-Shows × Mine|Total,
then appointment cards), *Facility Rounds*. Main column: icon toolbar with
split-button dropdowns. Right rail: *Patient Photograph*, *Chart Tabs* (vertical
nav, active item amber), *Quick Picks*, *E/M Coding*. Top-right: **patient
header** — `Smith, Michael  Born 11-Mar-1968(46y)  Gender Male` + red alert
glyph. Bottom: status bar (Logout · Session Timer · Current User).

`EHR-Medication-Reconciliation.png` shows the same rail **collapsed to an icon
strip** with count badges and a vertical "Chart Navigation" label — the
compact/responsive state, already designed for us.

**Contributes:** `AppShell`, `ModuleRail`, `TaskCountList`, `CollapsiblePanel`,
`PanelStack`, `ChartTabNav`, `PatientHeaderBar`, `StatusBar`, `ActionToolbar`,
`MiniCalendar`, `ScheduleSummaryTable`.

### Per-screen additions

| File | Adds |
|---|---|
| `EHR-Daily-Schedule.png` | `AppointmentCard` (name + age, time range, status lines, sex glyph, ✓ checked-in); right-click **context menu** (Completed / Not Completed / Discharged / Edit / Map Patient Address / Collapse All Groups); a horizontal **event timeline strip** (date ticks + dot markers + "Today"); floating browser frame (map) |
| `EHR-Patient-Timeline.png` | Three "Reviewed \<date\>" attested summary panels (Allergies / Medications / Problems) side by side; **`EventTimeline`** — swimlanes (Medications, Notes, Order Results, Communications, eDocuments, Vitals) × date axis, one glyph per event, "Today" band pinned right, horizontal scroll |
| `EHR-Vitals-Analysis.png` | **Richest single screen.** `VitalsList` (label/value/date); **`FishboneCard`** — CHEM-7 and CBC skeleton diagrams; **`MetricTile`** (Blood Pressure / 120/80 / April 24, 2014); **`TrendChart`** with `RangeToggle` (3m·6m·1y·2y·All); **`MedicationTimeline`** — Gantt of Aspirin/Crestor/Glucophage/Lisinopril/Prilosec with round start caps, arrow end caps for ongoing, grey ✕-capped bars for discontinued |
| `EHR-Chart-Notes.png` | `TemplateSelect` + generated-narrative `GeneratedSummaryPanel` with underlined field links; **`FindingsChecklistGroup`** — checkbox groups with an "All Normal" master and per-row `Abnx` dropdowns; **`BodyMapAnnotator`** — a foot diagram with ⊕/⊖ markers at anatomical sites |
| `EHR-EM-Coding-Engine.png` | Multi-column checkbox HPI form; **`EMLevelMatrix`** — selectable 5×5 decision grid (99215…99211 × Problem/Data/Risk/Complexity); `LevelMeter` bar widget in the rail |
| `EHR-Flow-Sheets.png` | **`FlowsheetGrid`** — flowsheet selector, date-range inputs, Summary/Flow Sheet toggle, pivoted matrix: numbered rows grouped under bold section rows (Blood Pressure, Tobacco, Lab Results), columns = encounter datetimes, abnormal values red (`7.9%`, `9.9%`), "Row 0 of 12" pager |
| `EHR-Orders-and-Labs.png` | `ResultReport` — a Quest lab report in its own window: identity grid header, Name/Value/Flag/Range/UOM/Status/Date/Lab, **abnormal row tinted with an `H` flag**, monospace interpretive sub-notes indented under the row, page footer, "View HL7 File" link |
| `EHR-Medications.png` | `MedicationList` (Status/Action/Start Date/!/Drug and Dosage/Refilled) with per-row warning icons and "Row 1 of 4"; drug-info dialog with a left category list (Allergy/Drug/Disease Interactions, Patient Education, Provider Guidelines, Web Links) + numbered guidance + disclaimer |
| `EHR-ePrescribing.png` | **`DrugSearchTree`** — hierarchical Lipitor → oral → tablet → 10/20/40/80 mg, warning triangles, filter checkboxes (Route/Dosage/Strength/Auto Expand) + Max Rows; **`PrescriptionPreview`** — the yellow "paper" Rx (Patient/Drug/Sig/Dispense/Refills/Pharmacy/Diagnosis + footer Coverage · Save · Print · Send, warning watermark) |
| `EHR-Allergies.png` | `AllergyList` ("Ace Inhibitors: rash") + allergen dialog with Symptom #1–#5 lookup fields, comment, "Remove Allergen", "Always display window on new allergen" |
| `EHR-Problem-Lists.png` | `ProblemTable` (Alert/P/Code/Description/Onset/Modified/Note); `EditProblemDialog` — required asterisks, SNOMED + ICD9 lookup fields with read-back, Priority/Status/Chronic, Onset/Resolution, and an **append-only note-history table** (Date/Note/Created By) |
| `EHR-Immunizations.png` | `VaccineScheduleTable` — series rows (DTP-1…4, Td 1–4, Hep B 1–3, MMR, Varicella, Influenza) × Date Given/Next Due/Location/Type/Reaction; two-column vaccine dialog (lot, expiration, VFC eligibility, funding source, site, route) |
| `EHR-Medication-Reconciliation.png` | **`ReconciliationList`** — Action column of `Keep` (green) / `Stop` (red) / `Inactivate` against Allergen/Medication/Problem sections with Date + Source; footer "Mark as Reviewed" + Preview/Save |
| `EHR-Clinical-Decision-Support.png` | **`CareGapTable`** — protocol rows grouped by measure (Blood Pressure, Tobacco, Foot Exam, Immunizations, Lab Results), **Check interval red when due** ("every 1y", "every 6m"), Today's vs Previous Results + Previous Date, ⚠/✓ section status |
| `EHR-Encounters-Safety-Net.png` | Alphabet-grouped worklist (A/B/C letter headers, patient header rows, visit child rows); **`CodePickerAccordion`** — two columns of accordion groups (Procedures: OV Minimal 99211…; Diagnosis: V70.5…) with ✓ on picked codes + Lookup; charge `LineItemTable` with Copy/Delete, Units/Charge/Amount, Total row |
| `EHR-Integrated-EHR-Billing-Software.png` | **`ScheduleGrid`** — 5-day resource calendar, colored appointment blocks (green/yellow/orange/purple/blue = appointment type), `ResourceFilterList` of providers, "Search for Patient" combo |
| `EHR-Automated-Workflows.png` | Numbered **step tabs** (1 Receipt · 2 Claim · 3 Orders · 4 Prescription · 5 Letters · 6 Print Queue) → `StepTabs`; grouped open-orders list (Labs/Scheduling/Referrals); order detail field sheet |
| `EHR-Clinical-Reporting.png` | **`QueryBuilder`** — Field/Operator/Value rows (`= {Equal to}`, `like {Match using %}`), OR'd Criteria #1–#5 chips, reorder toolbar, results grid with bulk actions (Send Letter · Send Reminder · Export Results) + "(7 Patients)" count |
| `EHR-Letters.png` | `LetterEditor` (screen composition) — template + metadata row (Saved By/Status/Letter Date/Revision), full rich-text toolbar, WYSIWYG letterhead with inline signature |
| `EHR-Direct-Secure-Email.png` | `SummaryOfCareTable` — the CCD as a striped label/value table (Patient, DOB, Sex, Race, Ethnicity, Contact info, Patient IDs, Preferred Language, Document Id…); Formatted/Unformatted radio; Preview/Export/Send |
| `EHR-Health-Information-Exchange.png` | Exchange inbox table (Exchange/Received/Location/Type/Subtype/Review) above a rendered external transcription document; accept/reject toolbar |
| `EHR-Secure-Communication-Hub.png` | **`MessageComposer`** — To/Subject/**Attached** (chart + document chips), Send/Task/Importance/Attach toolbar, `onConvertToTask`; a quoted `MessageThread` block (From/Sent/To/Subject on a tinted panel, stacked newest-first) |
| `EHR-Electronic-Faxing.png` | `GroupedListPanel` — fax inbox grouped by "Date: 3 Weeks Ago"/"Date: Older" with page counts, "3 Items" footer, disabled "Resend Fax", red Delete; `DocumentViewer` on a transmittal sheet |
| `Billing-Scheduling-eDocument-Management.png` | **`DocumentTree`** — Patient Docs with per-folder counts (Insurance (1), Images (5), Lab Results (3), DICOM (1), Video (0), MRI (0)); `DocumentViewer` with zoom/rotate/crop toolbar and footer (filename, size, ID, zoom %) |
| `EHR-Meaningful-Use.png` | **`ComplianceBoard`** — 2×3 matrix (Core / Menu Set × Observe/Diagnose/Share) of green (met) / red (unmet) status chips |
| `EHR-Patient-Portal.png` | **The only patient-facing screen** — much cleaner: green identity card, inline demographic sentence (46 year old, 6 ft 1 in, 203.0 lbs), Allergies/Conditions/Medications `+` lists, two trend charts, 4-up icon tile row (**Messages (0) / Chart (3) / Appointments (1) / Announcements (0)** with dated previews and source tags "(MH)") → `InboxTile` |

---

## 3. Set C (mixed sources) — visualisation and the modern target (8 screens)

### `ระบบเวชระเบียนโรคหัวใจ 1.jpg` / `2.jpg` — cardiology cath-lab record

**The visual north star.** Dark slate rail (Patient Management, Case List,
Patient Info, Anatomy, Prior Findings, Procedure Entry, Documentation) with the
active item in cyan, a user block at the bottom, a collapse chevron. Centre: a
**stack of procedure cards** — colored left accent bar keyed to procedure type,
header (`Angiogram: Left Upper Extremity Angiogram`) with type glyph, 2-column
meta grid (Catheter Tip Location / Type / Diagnostic Catheter / Guide Wire)
with edit + delete icons, nested sub-panels (`FINDINGS`, `COMPLICATIONS` with
`+ ADD/EDIT` ghost buttons), finding rows with severity accent bars and
`A → B` location notation, tinted metric chips (`90% Pre-Intervention` red ·
`0% Post-Intervention` green · `TIMI 2`). Access-site headers carry an on/off
switch (arterial/venous). Right: a large interactive **vessel map** with placed
markers and a floating `AnatomyInspector` (body silhouette + zoom box +
Arterial/Venous segmented control + region rows). Ledger rows and map markers
are synchronized.

**Contributes:** `ProcedureEntryCard`, `MetaGrid`, `NestedPanel`,
`InlineMetricChip`, `AnatomyInspector` — and the card-stack information
architecture the 2006 screens should be rebuilt into.

### `an open-source EMR-EMR_timeline.png` — EMR timeline

Category tree with checkboxes (Documents, Encounters, Episodes, Health issues,
Hospital stays, Life events, Procedures, Substances, Vaccinations), each
color-keyed, plus a legend and "View Categories Individually". The canvas draws
**colored event pills** on an era axis (20/21 century, decade ticks), with a
rich hover/detail card (substance, ATC code, regimen 1-0-0, aim, episode,
revision). Top: red `Caveat  Penicillin… (2013 Nov)` allergy banner. Bottom: a
horizontal tab bar of chart sections.

**Contributes:** `TimelinePill`, `CategoryLegend` (color + visibility toggle),
`EventDetailPopover` (the balloon), and confirmation that the allergy caveat
belongs in the patient header.

### `a timeline tool.png` — cohort timeline (HCIL, U. Maryland)

Multi-patient view: each record ID a collapsible group, each condition category
a swimlane, events as colored triangles on a shared year axis. *Align by… / Rank
by… / Filter by…* operator panel; legend with per-category checkboxes;
"Records 133/133" count.

**Contributes:** `CohortTimeline` (P3), and the align/rank/filter vocabulary for
population views.

### `a portal UI Timeline.jpg` — Japanese hospital portal (photo of a monitor)

Dense **timeline matrix**: row-header tree grouped into collapsible bands
(診療 / 検査 / 画像 / 処置…), date columns across the top, cells containing
**inline imaging thumbnails**; a density histogram above acting as a time
minimap/brush; hover detail card; count badges "(11件)".

**Contributes:** the `thumbnail` variant of `EventTimeline` (a cell can be an
image preview), `TimelineMinimap` (P3).

### `UNADJUSTEDNONRAW_thumb_6a62 / 6a64 / 6a6e.jpg` — SCADA plant dashboard

**Not clinical** — a solar plant monitoring system (Angthong 1). Included as a
*dashboard* reference. Worth taking: the labeled icon tab bar, the right-hand
"Site Scorecard" (two large percentages + cumulative label→value rows with
green/red value colors), the report-configuration panel (calendar + time range +
measure checkboxes + Process), the reusable **report frame** (title + Print +
period dropdown + config rail + chart canvas, flexing across three report
types), Gantt-style per-device status bars with a dual-handle time slider, a
"Top Five" ranked bar card + event table, and the persistent **alarm ticker
footer** (timestamp/tag/group/description/state, Ack Top/Ack All, counters).

**Contributes (P3, operations-dashboard family):** `ReportFrame`, `SeriesToggle`,
`TopNCard`, `AlertTicker`, `KpiScorecard`. Deliberately deferred — good patterns
from a non-clinical product; build only when an operations dashboard is
scheduled.

---

## What the sources agree on

Patterns appearing in **all three** clinical products independently —
highest-confidence, highest-priority:

1. **A persistent patient identity banner** that never scrolls away (Advance
   Clinic ข้อมูลพื้นฐาน · WinForms EMR top-right header · cardiology rail user block ·
   an open-source EMR banner).
2. **An allergy/safety alert visually louder than everything else** (แพ้ยา in
   red · WinForms EMR red alert glyph · an open-source EMR `Caveat`).
3. **Date-across-the-top, measure-down-the-side matrices** (Thai VB6 product
   result tables · WinForms EMR flowsheet + timeline · PSP matrix · a timeline tool).
4. **Code-first pickers** — type a code or partial name, get a coded concept
   back (Thai VB6 product drug/lab/ICD · WinForms EMR SNOMED/ICD9/drug tree/superbill).
5. **Order sets / templates as first-class** (⚖️ Thai VB6 product
   สั่งสูตร-บันทึกสูตร, verified · WinForms EMR Template select + Quick Picks +
   Favorites).
6. **Keyboard-first operation** — F-key hints on buttons and tabs (Advance
   Clinic); desktop clinic staff are keyboard-driven (→ `KeyHintButton`).
7. **Coded values expand to human text** (`1xApply2` → Thai sig; ICD9 →
   description read-back) — code assists, never locks.

## What the sources get wrong (do not copy)

- **Gradient chrome and beveled everything.** Flatten to a hairline + weight
  change.
- **Colour as the only signal.** Triage/queue dots and abnormal values rely on
  hue alone; ~8% of men have red–green deficiency. Every severity indicator
  gets a second channel (02 §4.1).
- **"No known allergy" styled identically to a real allergy** (02.1's red
  `ไม่มีประวัติแพ้ยา`). Three states instead — 02 §4.3.
- **Modal stacking.** WinForms EMR opens dialogs over dialogs over an IE window. One
  modal level; inner dialogs become sheets or inline expansion.
- **Truncation without recourse.** `Smith, Tom 06/20/1960(53y... 12-A` — never
  truncate mid-identifier; expose the full value on hover.
- **Untranslated abbreviations without labels.** `BW/BP/BMI/CC/PI/PE` stay
  (clinicians expect them) but get accessible expansions — 02 §6.4.
- **Garbled Thai menu bars** (the `?????` rows in Thai VB6 product — a live
  font-encoding failure). Lesson: every story renders Thai fixtures under the
  real font stack.
- **No empty, loading, or dirty states.** Not one source screen shows them; our
  spec requires all three everywhere, plus an unsaved-changes marker on forms.
