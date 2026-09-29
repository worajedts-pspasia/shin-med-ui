# 02 — Design direction

How to turn 2006-era Windows density into something that belongs next to
`components/things/TaskRow.tsx`.

---

## 1. The tension, stated honestly

Things 3 is a **calm, low-density, single-focus** interface. Its aesthetic
budget is spent on generous whitespace, one accent colour, and hairline
separation.

Clinic software is the opposite by necessity. `EHR-Flow-Sheets.png` shows 12
measures × 4 dates on one screen; `02.1 ห้องแพทย์ SOAP.png` shows demographics +
allergy + 6 vitals + chief complaint + 6 tabs + a live queue simultaneously.
That density is not bad design — a clinician with a 10-minute slot genuinely
needs it.

**The resolution is not to make the clinic app airy.** It is to keep Things'
*vocabulary* (hairlines not borders, weight not colour, one accent, system
font, soft radii) and change only its *rhythm*. Same instruments, faster tempo.

| Things 3 does | Clinic layer does | Why |
|---|---|---|
| 44px task rows | 36 / 30 / 26px rows via a density switch | 12 flowsheet rows must fit without scrolling |
| One accent (`things-blue`) | One accent + three severity colours | Clinical severity is information, not decoration |
| Whitespace separates | Hairline + zebra separate | Whitespace is unaffordable at this density |
| Rounded 10px cards | Rounded 6–8px panels, 0px inside grids | Grid cells must tile |
| No borders on inputs until focus | Same | Keep it — this is what stops the app looking like 2006 |

---

## 2. Density scale

Three densities, selected by a `data-density` attribute on any container.
Components read it via CSS custom properties, so a `FlowsheetGrid` inside a
dense panel compacts without a prop drill.

```
[data-density="comfortable"] { --clinic-row-h: 2.25rem; --clinic-row-px: 0.75rem; --clinic-font: 0.875rem }
[data-density="compact"]     { --clinic-row-h: 1.875rem; --clinic-row-px: 0.5rem;  --clinic-font: 0.8125rem }
[data-density="dense"]       { --clinic-row-h: 1.625rem; --clinic-row-px: 0.375rem; --clinic-font: 0.75rem }
```

Defaults per surface:

- **comfortable** — patient-facing screens, dialogs, forms, appointment cards.
- **compact** — the default for clinician worklists, queues, problem/medication
  lists.
- **dense** — flowsheets, result tables, timelines, superbill code pickers only.

Never put `dense` on anything with a touch target. 26px rows are mouse-only.
Thai stacked vowels clip at `dense` — the `:lang(th)` guard raises the row
height (see 03 §"Density blocks" and §6.1 below).

> **Implementer note.** Define these blocks in `index.css` under `@layer base`,
> *not* in `@theme`. They are not palette tokens and must not enter
> `design-tokens.json` — `verify:spec` compares the JSON against `@theme` and
> flags anything extra.

---

## 3. Layout model

The sources converge on the same skeleton — adopt it directly:

```
┌──────┬────────────────┬───────────────────────────────┬──────────────┐
│ Rail │ Context column │ Workspace                     │ Inspector    │
│ 56px │ 240–320px      │ fluid                         │ 260–300px    │
│ icon │ queue / list / │ the actual task               │ patient card │
│ +lbl │ schedule       │                               │ chart tabs   │
└──────┴────────────────┴───────────────────────────────┴──────────────┘
                     ── persistent patient header spans the right 3 ──
                     ── status bar spans everything ──
```

- **Rail** collapses to icon-only with count badges — WinForms EMR already designed
  this state (`EHR-Medication-Reconciliation.png`). Reuse the existing
  `components/ui/sidebar.tsx` collapse machinery rather than inventing one.
- **Context column** is the one that survives navigation. The queue in Advance
  Clinic and the schedule in WinForms EMR both persist across every tab — that
  persistence *is* the feature. Do not remount it on route change.
- **Inspector** is optional and the first thing to drop at narrow widths.
- Panes are `components/ui/resizable.tsx`; do not hand-roll splitters.

---

## 4. Clinical safety rules

These are not style preferences. Getting them wrong is a patient-safety defect,
and both 2006-era sources get them wrong.

**4.1 Never encode clinical meaning in hue alone.**
Thai VB6 product's queue legend is three coloured circles; WinForms EMR's abnormal lab
is a pink row. Roughly 8% of men have red–green colour-vision deficiency. Every
severity indicator carries a second channel:

| State | Colour | Second channel |
|---|---|---|
| Normal / ปกติ / Keep | `clinic-ok` | no glyph, regular weight |
| Abnormal / due | `clinic-warn` | `↑`/`↓`/`!` glyph + medium weight |
| Critical / Stop | `clinic-critical` | filled glyph + semibold + `aria-label` |

A `Monochrome` story (grayscale filter) proves the second channel works —
required for every severity-bearing component.

**4.2 Allergy and alert banners are never dismissible and never collapse.**
All three products agree. `AllergyBanner` has no close button, by design, and
no entrance animation — a moving allergy banner reads as dismissible.

**4.3 "No known allergy" is a distinct state from "not recorded".**
`02.1` renders `ไม่มีประวัติแพ้ยา` in the *same red* used for real allergies.
That is dangerous. Three states: `none-recorded` (neutral, prompts action),
`no-known` (quiet, confirmed, **never red**), `has-allergies` (loud). See
`AllergyBanner` in the catalog.

**4.4 Destructive and irreversible actions need distance.**
Thai VB6 product puts ลบ (delete) adjacent to บันทึก (save) at identical size.
Separate them; route anything that changes a signed record (send Rx, submit
claim, sign note) through `alert-dialog` with the specific consequence named —
never "Are you sure?".

**4.5 Show units, always, next to the value.**
`mg/dL`, `mmol/L`, `mmHg`. `EHR-Orders-and-Labs.png` gets this right with a UOM
column; `02.4` omits units entirely. Units are part of the value, not metadata
(`ValueWithUnit`).

**4.6 Reference ranges travel with results.**
A value without its range is uninterpretable. `ResultTable` requires `range`
and `uom`.

**4.7 Critical values are a first-class field.**
`02.4` carries ค่าอันตราย (critical) 150 next to the normal range 0–35 —
verified on the pixels. `OrderEntryForm(kind="lab")` keeps it, and the result
side renders `HH`/`LL` panic flags in the filled critical treatment.

---

## 5. Responsive policy, and why some components should refuse

The brief asked for a remark per component rather than blanket responsiveness.
The governing question: **does the layout carry meaning?**

- **Cards, tiles, lists, forms** — layout is presentation. Make them *fluid*.
  An `AppointmentCard` at 320px and at 900px says the same thing.
- **Matrices** — layout *is* the meaning. A `FlowsheetGrid`'s value comes from
  "same row, different columns". Reflow it to a stack and you have destroyed
  the comparison the clinician opened it for. These are *scroll-locked*: keep
  the desktop grid, scroll horizontally, stick the first column and the header
  row.
- **Spatial diagrams** — a `BodyMapAnnotator` marker means "distal left
  subclavian" because of where it sits. *Desktop-only*: below `md`, render the
  findings as a list and hide the diagram behind a "view diagram" action.
- **Multi-pane shells** — *breakpoint-swap*. Below `md`, `AppShell` becomes a
  single pane with the rail as a `Sheet` and the inspector as a `Drawer`.

Two practical rules:

1. **Sticky-first-column is mandatory** on every scroll-locked component. A
   horizontally scrolled table whose row labels scroll away is unusable.
2. **Test at 390px** (the project's Storybook mobile viewport) and at 1440px.
   Nothing in between needs a bespoke layout.

The catalog gives a per-component verdict.

---

## 6. Localisation constraints (en / th / ja)

The app is trilingual (`app/frontend/i18n/{en,th,ja}.json` all exist). Clinical
UI adds five traps.

**6.1 Thai has no word spaces and taller glyphs.**
Thai with stacked vowels and tone marks needs more leading than Latin. At
`dense` (26px rows / 12px text) Thai marks clip — the guard bumps dense rows
when the document language is Thai:

```css
:lang(th) [data-density="dense"] { --clinic-row-h: 1.75rem; }
```

Thai does not line-break on spaces; long Thai strings in narrow cells overflow
rather than wrap. Set `overflow-wrap: break-word` on Thai text cells and prefer
tooltip over truncation for names.

**6.2 Buddhist-era dates.**
Thai clinical records conventionally use พ.ศ. (CE + 543). The project already
formats via `Intl` in `app/frontend/lib/dates.ts` —
`Intl.DateTimeFormat('th-TH-u-ca-buddhist')` handles it. **Do not hand-roll
`+543`.** Decide once whether clinical timestamps are BE or CE, state it in the
UI; mixing them is a medico-legal hazard.

**6.3 Age is a composite, not a number.**
`02.1` renders `42 ปี 6 ด 8 ว` (years/months/days) — paediatrics needs this.
`EHR-Daily-Schedule.png` uses `(25y)`. Model age as `{ years, months, days }`
(`PatientAge`) and format per locale and age band: under 2 → months + days;
under 18 → years + months; adult → years.

**6.4 Clinical abbreviations stay untranslated — but get labels.**
`BP`, `BMI`, `TIMI`, `ICD`, `SNOMED`, `HgbA1c` are international; translating
them would *hurt* a Thai clinician. Keep the abbreviation visible, put the
expansion in i18n, surface via `title`/`aria-label`:

```jsonc
// en.json / th.json / ja.json — same keys, translated expansions only
"clinic.vitals.bp.abbr": "BP",              // identical in all three
"clinic.vitals.bp.full": "Blood pressure"   // "ความดันโลหิต" / "血圧"
```

**6.5 Name order differs.**
WinForms EMR uses `Last, First`. Thai practice is `คำนำหน้า ชื่อ สกุล`; Japanese is
surname-first. `PatientName` takes the parts, never a pre-joined string, and
orders them per locale.

---

## 7. Typography

Keep the system stack (`AGENTS.md` forbids webfonts; `-apple-system` resolves
to a Thai-capable face on macOS). Add one thing the task app does not need:

**Tabular numerals for every clinical figure.** Lab values, vitals, doses,
charges, times must align vertically. `font-variant-numeric: tabular-nums`,
exposed as the `.clinic-num` utility, on every numeric cell. Without it, a
column of `120 / 98 / 7.9` wobbles and is measurably slower to scan.

Scale (existing Tailwind steps, no new tokens):

| Role | Class | Notes |
|---|---|---|
| Patient name in header | `text-[15px] font-semibold` | The one place we allow a bump |
| Panel / section title | `text-[13px] font-semibold tracking-tight` | Replaces WinForms EMR's gradient banners |
| Body / row text | `text-[13px]` (compact) · `text-xs` (dense) | |
| Value emphasis | `text-[13px] font-medium` + `clinic-num` | |
| Metric hero | `text-3xl font-semibold` + `clinic-num` | `MetricTile` only |
| Meta / units / timestamps | `text-[11px] text-things-gray` | |
| Code / identifier | `text-[11px] font-mono` | ICD/CN/MRN/lot numbers |

Monospace earns its place only for identifiers and machine text (the
interpretive notes in `EHR-Orders-and-Labs.png` are monospace in the source and
stay so).

---

## 8. Motion

Things 3 is restrained; clinic UI is more restrained still. Alerts must not
animate in — a moving allergy banner reads as dismissible. Permitted: panel
collapse (150ms), sheet/drawer slide (200ms), row hover tint (100ms).
Forbidden: attention-seeking pulse on critical values, skeleton shimmer inside
a result table (use a static muted state), any transition over 250ms. Respect
`prefers-reduced-motion`.

---

## 9. Empty, loading and dirty states

No source screen shows any of them; the spec requires all three everywhere:

- **Empty** — `ui/empty` with a clinical sentence ("No events in range", "No
  known allergies" is a *banner state*, not an empty state).
- **Loading** — `ui/skeleton` rows outside data tables; a static muted state
  inside them (no shimmer, §8).
- **Dirty** — `FormActionBar` shows an unsaved-changes marker; every source
  form has a dirty state and none of them indicate it.
