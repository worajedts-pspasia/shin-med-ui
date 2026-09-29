# 05 — Screen blueprints

Nine screens, each written as a composition of catalog components. These are
**not** components — nobody builds `<ExamRoomScreen>`. They live in
`app/frontend/views/clinic/` alongside the existing `views/Today.tsx` etc., and
they are assembly only: fetch data, compose, wire handlers.

Notation: `Component` = from the catalog · *italic* = a screen-local composition.

---

## 1. Front desk — registration & queue

**Sources** `01.1 ประวัติ.png`, `01.2 ค้นประวัติ.png`
**Route** `/clinic/reception` · **Density** `comfortable` (form) + `compact` (queue)

```
AppShell
├─ rail      ModuleRail
├─ header    PatientHeaderBar            (only once a patient is loaded)
├─ context   CollapsiblePanel "Waiting queue"
│            ├─ StatusLegend  (with counts → doubles as a filter; tones มา/รับ/อั้น)
│            ├─ QueueTable
│            └─ PaginationFooter
├─ workspace CollapsiblePanel "Find patient"
│            ├─ PatientSearchCombobox → PatientPickerDialog
│            CollapsiblePanel "Patient record"
│            ├─ *RegistrationForm*  — FormGrid + ui/field
│            │   ├─ identity   : title select · PatientName parts · sex · national ID (masked)
│            │   ├─ birth      : DOB + PatientAge (derived, read-only)
│            │   ├─ contact    : *AddressCascade* (ตำบล→อำเภอ→จังหวัด→รหัสไปรษณีย์) · phone
│            │   └─ visit      : status select · urgency select (low-confidence in source) · note
│            ├─ PatientIdentityCard  (orientation="row", photo capture)
│            └─ FormActionBar  — New · Edit · Save & send to clinician · Print OPD · Close
└─ footer    StatusBar
```

**Decisions made here**

- *AddressCascade* is screen-local, not a catalog component: it is
  Thai-administrative-division specific, and another market needs a different
  shape. Keep it local until a second market actually needs it.
- The queue lives in the **context** pane so it persists into the exam room —
  exactly what Thai VB6 product does, and the right call.
- "บันทึก/ส่งตรวจ" (save and send to exam) is the primary action. The source
  disables it until the form is valid; keep that, and add a reason tooltip,
  which the source lacks.
- The queue legend is **processing status** (มา/รับ/อั้น → arrived/accepted/
  held), per the adjudicated reading — `StatusDot` tones, not `TriageDot`.

**Responsive** Below `md`: search + queue as two tabs, form full-width,
`FormActionBar` sticky at the bottom.

---

## 2. Day board — today's schedule

**Sources** `EHR-Daily-Schedule.png`, `EHR-Integrated-EHR-Billing-Software.png`
**Route** `/clinic/schedule` · **Density** `compact`

```
AppShell
├─ rail      ModuleRail
├─ context   PanelStack (accordion)
│            ├─ CollapsiblePanel "Today"     → ScheduleSummaryTable
│            ├─ CollapsiblePanel "Calendar"  → MiniCalendar (with density markers)
│            ├─ CollapsiblePanel "Providers" → ResourceFilterList
│            └─ CollapsiblePanel "Rounds"    → GroupedListPanel
├─ workspace ActionToolbar  (new appointment · print · today · view: day|week)
│            ScheduleGrid  → TimelinePill blocks, ContextMenu per block
└─ inspector PatientIdentityCard  (of the selected appointment)
             CollapsiblePanel "Next steps" → *CheckInActions*
```

**Decisions**

- `ScheduleGrid` blocks are coloured by **appointment type** from the category
  palette. Status (confirmed / checked-in / no-show) is a glyph, never a colour
  — otherwise type and status compete for the same channel, which is the
  source's flaw.
- The context menu from `EHR-Daily-Schedule.png` (Completed / Not Completed /
  Discharged / Edit / Map address) is worth keeping wholesale; drop "Map
  Service Location".

**Responsive** `< md` → agenda list of `AppointmentCard`s, grouped by hour. Do
not shrink the grid.

---

## 3. Exam room — the encounter workspace

**Sources** `02.1 SOAP`, `02.2`/`02.3` Prescription, `02.4 Lab Order`,
`EHR-Chart-Notes.png`, cardiology `1.jpg`/`2.jpg`
**Route** `/clinic/encounters/:id` · **Density** `compact`

This is the screen where the redesign actually happens. The source uses **tabs**
(ประวัติ-วินิจฉัย [F5] · สั่งยา [F6] · สั่ง LAB [F7] · โปรแกรมอื่นๆ [F8] ·
ข้อมูลภาพ · คิดเงิน [F9]) which means you cannot see the diagnosis while
prescribing for it. The cardiology system solves this with a **card stack**.
Adopt the card stack.

```
AppShell
├─ header    PatientHeaderBar  (sticky)
│            AllergyBanner     (sticky, directly beneath — never scrolls)
├─ context   CollapsiblePanel "Waiting queue"  → QueueTable   (persists from screen 1)
├─ workspace *EncounterHeader*
│            ├─ VitalsStrip  (BW · H · BP · Pulse · BMI* · IBW*   * derived)
│            └─ *ChiefComplaint*  — CodedSearchInput + free text
│
│            ── the card stack, one ProcedureEntryCard per clinical act ──
│            ProcedureEntryCard kind="Subjective"   → textarea PI (SOAP labels)
│            ProcedureEntryCard kind="Objective"    → FindingsChecklistGroup[]
│            │                                        (+ BodyMapAnnotator on ≥lg)
│            ProcedureEntryCard kind="Assessment"   → CodedSearchInput(icd10)
│            │                                        → NestedPanel → LineItemTable of diagnoses
│            ProcedureEntryCard kind="Plan"
│            │  ├─ NestedPanel "Medications" → OrderEntryForm(drug) + LineItemTable
│            │  │                              + OrderSetButtons
│            │  ├─ NestedPanel "Labs"        → OrderEntryForm(lab)  + LineItemTable
│            │  └─ NestedPanel "Follow-up"   → MetaGrid
│            └─ FormActionBar  (sticky) — Save · Sign · Print OPD · Cancel
└─ inspector PatientIdentityCard
             ChartTabNav  (Summary · Vitals · Allergies · History · Problems · Meds · Labs · Documents)
             CollapsiblePanel "Prior encounters" → GroupedListPanel
```

**Decisions**

- **Keep the F-keys.** `KeyHintButton` registers `F2` save, `F5`–`F9` to
  scroll-and-focus the matching card. The tabs disappear; the muscle memory
  survives. Clinic staff migrating from Thai VB6 product will be fast on day one.
- The allergy banner sits under the patient header, above everything,
  permanently. In `02.1` it is a field inside a form group and can scroll away.
  That is a defect.
- `TemplateSelect` + `GeneratedSummaryPanel` attach to the Objective card,
  giving `EHR-Chart-Notes.png` behaviour (structured input → generated
  narrative) without the source's separate template screen.
- Billing (คิดเงิน [F9]) is **not** a card here. It moves to screen 7, because
  charge capture is a different person's job.

**Responsive** `< md`: cards stack full-width, inspector → `Drawer`,
`BodyMapAnnotator` hidden behind a "view diagram" action, `VitalsStrip` wraps
to two rows.

---

## 4. Prescribing

**Sources** `02.2`, `02.3`, `EHR-ePrescribing.png`, `EHR-Medications.png`
**Route** `/clinic/patients/:id/prescriptions` · **Density** `compact`

```
workspace  ActionToolbar (new Rx · reconcile · print · send)
           *DrugPicker*
           ├─ CodedSearchInput(drug)      ← default path: type a name or code
           └─ DrugSearchTree              ← browse path, behind a "Browse" toggle
           OrderEntryForm(kind="drug")
           ├─ CodedSearchInput  · trade name · indication select · warning select
           ├─ SigBuilder        → live localised sig preview (editable, sigDirty-aware)
           ├─ quantity · days · unit
           └─ OrderSetButtons   (สั่งสูตร / บันทึกสูตร — verified in source)
           LineItemTable        (current prescription, editable, status dots, totals)
           CollapsiblePanel "History" → MedicationList
inspector  MedicationTimeline   (Gantt of past therapy — context while prescribing)
           AllergyBanner        (repeated here deliberately)
```

**Decisions**

- Search-first, browse-second. `02.2` opens a flat alphabetical list of ~200
  drugs as the primary interaction; that does not scale.
- The interaction check from `EHR-Medications.png` fires **on add, not on
  save**, and renders as a blocking `alert-dialog` for contraindications, a
  `NestedPanel` warning for advisories.
- `MedicationTimeline` in the inspector is new — neither source shows prior
  therapy while prescribing, and that is the single most useful context there
  is.
- The Generic/TradName radio from the source becomes a display toggle on the
  `LineItemTable` (which name the rows show), not a data-entry mode.

---

## 5. Orders & results

**Sources** `02.4 Lab Order`, `EHR-Orders-and-Labs.png`, `EHR-Flow-Sheets.png`
**Route** `/clinic/patients/:id/results` · **Density** `dense`

```
workspace  ActionToolbar (new order · acknowledge · print · export)
           ui/tabs
           ├─ "Latest"    → ResultTable   (grouped by panel, abnormal rows toned)
           ├─ "Flowsheet" → *FlowsheetToolbar* (flowsheet select · date range · Only rows with data)
           │                FlowsheetGrid  → row checkboxes → TrendChart
           ├─ "Trend"     → RangeToggle + TrendChart (referenceBands) + MedicationTimeline
           └─ "Reports"   → GroupedListPanel → ResultReport on PaperSurface
inspector  VitalsList · MetricTile grid
```

**Decisions**

- `ui/tabs` is correct here (unlike the exam room) because these are genuinely
  alternate *views of the same data*, not sequential steps.
- Ordering and resulting share `OrderEntryForm(kind="lab")` — including the
  **critical value field** (ค่าอันตราย, verified in `02.4`) and `showCost`
  (ทุน / ราคารวม on the row and totals footer).
- The "select rows → plot" path from `FlowsheetGrid` to `TrendChart` is the
  feature the source gestures at with a chart icon and never delivers.
  Deliver it.

---

## 6. Chart overview — the patient timeline

**Sources** `EHR-Patient-Timeline.png`, `EHR-Vitals-Analysis.png`, an open-source EMR, PSP
**Route** `/clinic/patients/:id` · **Density** `compact`

```
workspace  ClinicalSummaryTriptych
           │              ├─ AllergyList        (reviewedAt footer → re-attest control)
           │              ├─ MedicationList (current only)
           │              └─ ProblemTable   (active only)
           CollapsiblePanel "Timeline"
           ├─ CategoryLegend     (filters lanes)
           ├─ TimelineMinimap    (≥ lg only)
           └─ EventTimeline      variant="dot", todayColumn, pxPerDay zoom
           CollapsiblePanel "Care gaps" → CareGapTable
inspector  PatientIdentityCard · ChartTabNav · MetricTile ×2
```

**Decisions**

- The "Reviewed \<date\>" stamp is a real clinical artefact (attestation) —
  keep it as a **control**: clicking it re-attests.
- `variant="thumbnail"` (the PSP pattern) becomes available once imaging
  exists; it is the same component with a different cell renderer.

---

## 7. Charge capture — superbill

**Source** `EHR-Encounters-Safety-Net.png`
**Route** `/clinic/billing/superbill` · **Density** `dense`

```
AppShell
├─ context   GroupedListPanel  (encounters grouped A–Z by patient; Open / Missing counts)
├─ workspace *SuperbillHeader* — MetaGrid (superbill template · service location · claim # · encounter date)
│            two columns:
│            ├─ CodePickerAccordion (procedures — CPT, grouped by service type)
│            └─ CodePickerAccordion (diagnoses — ICD, + CodedSearchInput lookup)
│            CollapsiblePanel "Charges" → LineItemTable with totals
└─ footer    FormActionBar — Save · Submit claim
```

**Decisions** The source's "Missing 146" counter is a good idea badly placed.
Surface it as a `clinic-warn` count on the `ModuleRail` Billing item — unbilled
encounters are revenue leaking, and they should be visible from anywhere.

---

## 8. Documents & communications

**Sources** `Billing-Scheduling-eDocument-Management.png`, `EHR-Electronic-Faxing.png`,
`EHR-Secure-Communication-Hub.png`, `EHR-Letters.png`, `EHR-Direct-Secure-Email.png`
**Route** `/clinic/documents` · **Density** `compact`

```
AppShell
├─ context   DocumentTree  (Insurance · Images · Lab Results · DICOM · Video · MRI, with counts)
│            GroupedListPanel ("Arranged by: Date")   ← MessageList for mail/fax dialects
├─ workspace ActionToolbar (upload · scan · zoom · rotate · save to chart · send)
│            MessageThread  (chat turns + quote blocks + system markers)
│            │               + MessageComposer (inline, attachments via AttachmentChip)
│            │                 RecipientPicker in the dialog mode
│            └─ or DocumentViewer for scans/faxes:
│               or PaperSurface for generated documents:
│                  PrescriptionPreview | SummaryOfCareTable | *LetterEditor* | *TransmittalSheet*
└─ inspector MetaGrid (file meta) · AuditFooter
```

**Decisions**

- Fax, eDocuments, letters and secure messages are **one screen with four
  content types**, not four screens. WinForms EMR ships them as four modules with
  near-identical chrome; consolidating removes roughly a third of the surface
  area.
- Messaging uses the ChatUI primitives: chat bubbles for interactive turns, the
  quote-block mode for email-shaped legacy messages, system markers for
  workflow events. `InboxTile` counts for mail/fax/messages surface on the
  rail.
- `LetterEditor` stays a screen composition (paper canvas + merge-token
  preview); the rich-text toolbar renders disabled with a "rich text — planned"
  tooltip until an editor dependency is evaluated.

---

## 9. Patient portal home

**Source** `EHR-Patient-Portal.png`
**Route** `/portal` · **Density** `comfortable` · **Mobile-first**

The only patient-facing screen, and the only one designed mobile-first. It
reuses the catalog but never `AppShell`.

```
*PortalShell*  (single column; nav in a Sheet)
├─ PatientIdentityCard   orientation="row"
├─ *HealthSummary*  — inline sentence (age, height, weight) + three lists:
│                     AllergyList · ProblemTable(active, simplified) · MedicationList(current)
├─ MetricTile grid (2-up → 1-up)  each with a sparkline
├─ TrendChart ×2   (weight, blood pressure — simplified, no reference bands)
└─ InboxTileRow    Messages · Chart · Appointments · Announcements, each with a count
```

**Decisions**

- Patient-facing lists hide codes, flags and provenance. `ProblemTable` gets an
  `audience="patient"` variant that drops the ICD column — clinicians need
  codes, patients do not.
- **No severity colour on the portal.** A red row on a patient's own record
  causes alarm without context. Plain text plus a "discuss with your clinician"
  affordance.
- This is the one screen where **every** component must be `Fluid`. If a
  component you need here is `Scroll-locked`, that is a signal you are showing
  the patient a clinician's view.

---

## Cross-screen rules

1. **`PatientHeaderBar` + `AllergyBanner` render on every clinical screen**,
   sticky, in that order, immediately under the app header. No exceptions.
2. **The context pane survives navigation.** Reception → exam room →
   prescribing keeps the same queue mounted.
3. **One modal level.** If a dialog needs to open a dialog, the inner one
   becomes a `Sheet` or inline expansion. WinForms EMR stacks three deep; do not
   follow it.
4. **Every screen declares its density** on the `AppShell`. Never mix densities
   within a pane.
5. **Every irreversible action** (send Rx, submit claim, sign note, share
   chart) routes through `ui/alert-dialog` with the specific consequence named
   — not "Are you sure?".
6. **Fixtures on screens are deterministic literals** (see 07) — no randomness,
   no fetches; screenshots and visual regression stay stable.
