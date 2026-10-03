# 04 — Component catalog

**93 components, 9 layers.** Everything lives in `app/frontend/components/clinic/`,
plain names, one file per component plus a colocated `*.stories.tsx`.

## How to read an entry

```
### ComponentName — one-line purpose
Tier · Source screenshot · Built on · Responsive verdict
props sketch
notes / states
```

**Tier** — P0 build first (25) · P1 workhorses (34) · P2 valuable (20) ·
P3 specialist, defer (14).
**Responsive** — `Fluid` · `Breakpoint-swap` · `Scroll-locked` · `Desktop-only`
(definitions in [02-design-direction.md §5](02-design-direction.md)).
**Built on** — the vendored shadcn primitive to wrap; `components/ui/*` is
never edited. Chat-family primitives (`message`, `bubble`, `message-scroller`,
`attachment`, `item`, `marker`) exist since commit `8e1b9f8`.

---

# Layer 1 — Shell & navigation (11)

### `AppShell` — the four-pane clinic frame
**P0** · every WinForms EMR screenshot · `ui/resizable`, `ui/sidebar`, `ui/sheet`, `ui/drawer` · **Breakpoint-swap**

```ts
interface AppShellProps {
  rail: ReactNode              // ModuleRail
  context?: ReactNode          // queue / schedule / worklist — persists across navigation
  children: ReactNode          // workspace
  inspector?: ReactNode        // patient card + chart tabs
  header?: ReactNode           // PatientHeaderBar + AllergyBanner, spans context+workspace+inspector
  footer?: ReactNode           // StatusBar
  density?: "comfortable" | "compact" | "dense"   // sets data-density
}
```

- `≥ lg` — all four panes, context and inspector user-resizable, sizes persisted
  to `localStorage`.
- `md` — inspector collapses to a right-edge tab opening a `Drawer`.
- `< md` — single pane. Rail becomes a left `Sheet`, context a tab above the
  workspace, inspector a `Drawer`. The patient header and allergy banner **stay
  pinned** — they are the two things that must never be a swipe away.
- The context pane surviving navigation is the point; never remount it on route
  change.

### `ModuleRail` — icon + label module switcher with counts
**P0** · WinForms EMR left rail; collapsed form in `EHR-Medication-Reconciliation.png`; cardiology dark rail · `ui/sidebar`, `ui/tooltip` · **Breakpoint-swap**

```ts
interface ModuleRailProps {
  items: { id: string; label: string; icon: LucideIcon; href: string; count?: number }[]
  activeId: string
  collapsed?: boolean
  footer?: ReactNode          // user block + settings (cardiology pattern)
}
```

States: default · hover · active (`things-blue` text + `things-select`
background) · collapsed (icon only, label in `Tooltip`, count becomes a corner
dot) · count badge (`things-badge`, caps at `99+`).

### `CollapsiblePanel` — the universal titled, collapsible panel
**P0** · every stacked WinForms EMR panel; cardiology `FINDINGS` panels · `ui/collapsible` · **Fluid**

```ts
interface CollapsiblePanelProps {
  title: ReactNode
  action?: ReactNode          // right-aligned: "+ ADD/EDIT", Refresh, count
  defaultOpen?: boolean
  variant?: "panel" | "section" | "inline"
  status?: "none" | "ok" | "warn" | "critical"   // ⚠/✓ in section headers
  children: ReactNode
}
```

Replaces every gradient banner in the sources. `panel` = rail panel, `section`
= workspace section header, `inline` = nested sub-panel inside a card. Open
state persists per `title` key. (Supersedes the parent package's `SectionPanel`
— one component, three variants, beats two.)

### `PanelStack` — vertical stack of `CollapsiblePanel`s with accordion mode
**P1** · WinForms EMR rails · `ui/accordion` · **Fluid**
`{ children, mode?: "independent" | "accordion" }`. `accordion` = only one open
— what the right rail needs when the inspector is short.

### `SectionHeader` — flat replacement for the gradient banner
**P0** · `Allergies`/`Medications`/`Problems`/`Timeline` bands · — · **Fluid**
`{ title, meta?, action?, status? }`. Hairline above,
`text-[13px] font-semibold tracking-tight`, no fill. `meta` carries the
"Reviewed 05/02/2014" attestation line — right-aligned, `things-gray`.

### `ActionToolbar` — icon toolbar with split buttons and overflow
**P0** · WinForms EMR main toolbar; Thai VB6 product toolbars · `ui/button-group`, `ui/dropdown-menu`, `ui/tooltip` · **Fluid**

```ts
interface ToolbarAction {
  id: string; icon: LucideIcon; label: string    // label required — tooltip + aria-label
  onSelect?(): void
  menu?: { id: string; label: string; onSelect(): void }[]   // split button
  disabled?: boolean
  destructive?: boolean                          // pushed into overflow, never inline
}
```

Actions that do not fit collapse into a `⋯` overflow at narrow widths rather
than wrapping. Destructive never sits inline next to save (02 §4.4).

### `TaskCountList` — worklist with live counts
**P1** · WinForms EMR "My Tasks" · `ui/item` · **Fluid**
`{ items: { id, label, icon, count, href }[], activeId?, onSelect? }`. Zero
counts render muted, not hidden — `Health Exchange (0)`; absence is
information. Counts get `.clinic-num`. In `AppShell`'s mobile drawer it renders
unchanged; optional `variant="chips"` for top-bar use.

### `ChartTabNav` — vertical section nav for the chart
**P1** · WinForms EMR "Chart Tabs" · `ui/navigation-menu`, `ui/scroll-area` · **Fluid**
`{ sections: { id, label, badge? }[], activeId, onSelect }`. Active item uses
`things-blue` (source uses amber; amber is reserved for `clinic-warn`). Below
`md`: same API, horizontal scrolling `ui/tabs` skin.

### `KeyHintButton` — button with a keyboard-shortcut affordance
**P1** · Thai VB6 product `บันทึกประวัติ/F2`, tabs `[F5]`–`[F9]` · `ui/button`, `ui/kbd` · **Fluid**
`{ shortcut: string, showHint?: "always" | "hover" | "never" }`. Registers the
shortcut and renders it in a `Kbd`. Desktop-era clinic staff are keyboard-driven
— a real feature, not decoration. `showHint="never"` below `md`.

### `StepTabs` — numbered wizard step tabs
**P2** · `EHR-Automated-Workflows.png` (1 Receipt · 2 Claim · … · 6 Print Queue) · `ui/tabs` + numbering · **Fluid (scrolls)**
`{ steps: { id, label, icon? }[], activeId, onSelect, completedIds? }`.
Completed steps get a green check; future steps muted. Horizontal scroll below
`md`.

### `StatusBar` — bottom bar
**P2** · WinForms EMR footer; Thai VB6 product footer · — · **Fluid**
`{ left?, center?, right? }`. Session timer, current user, environment. Below
`md` keep only the environment indicator — a STAGING/TRAINING marker on a
clinical app is a safety feature.

---

# Layer 2 — Patient identity & safety (10)

### `PatientHeaderBar` — the identity banner that never scrolls away
**P0** · WinForms EMR top-right on all shell screens; Thai VB6 product `ข้อมูลพื้นฐาน`; an open-source EMR banner · `ui/hover-card`, `ui/avatar`, `ui/badge` · **Fluid**

```ts
interface PatientHeaderBarProps {
  patient: { id: string; mrn: string; name: NameParts; dob: string;
             sex: "male" | "female" | "other" | "unknown"; photoUrl?: string }
  alerts?: { kind: "allergy" | "flag" | "advance-directive"; label: string }[]
  nextAppointment?: { date: string; time?: string; with?: string }   // an open-source EMR chip
  favorite?: boolean; onToggleFavorite?(): void                       // PSP star
  actions?: ReactNode
  compact?: boolean
}
```

- Always visible; sticky in every layout including mobile.
- Renders `PatientName` + `PatientAge` + sex glyph + MRN (`font-mono
  text-[11px]`).
- `alerts` render as `clinic-critical` glyph buttons opening a `HoverCard` with
  detail; allergy chip shows the first allergen + "+n more".
- `compact` (mobile) drops the secondary line but **never MRN or DOB** —
  two-identifier verification is the standard. Full detail in a popover.
- Below `md`: name + age line one, MRN + alerts line two. Never truncate MRN.

### `PatientName` — locale-correct name rendering
**P0** · `01.1` (คำนำหน้า/ชื่อ/สกุล) vs WinForms EMR (`Smith, Michael`) · — · **Fluid**
`{ parts: { title?, given, middle?, family, suffix? }, format?: "full" | "list" | "short" }`.
Order comes from the active locale, not the data: `th` → `title given family`,
`ja` → `family given`, `en` list → `Family, Given`. Never accept a pre-joined
string.

### `PatientAge` — composite age
**P0** · `02.1` `42 ปี 6 ด 8 ว`; WinForms EMR `(46y)` · — · **Fluid**
`{ dob: string; asOf?: string; precision?: "auto" | "y" | "ym" | "ymd" }`.
`auto` picks by age band: `< 2y` → months + days, `< 18y` → years + months,
else years. Paediatric dosing depends on this; do not simplify to a year count.
Uses `Intl` via `lib/dates.ts` conventions.

### `AllergyBanner` — the loudest thing on screen
**P0** · `02.1` แพ้ยา; an open-source EMR `Caveat`; WinForms EMR red glyph · `ui/alert`, `ui/hover-card` · **Fluid**

```ts
interface AllergyBannerProps {
  state: "has-allergies" | "no-known" | "none-recorded"
  allergies?: { allergen: string; reaction?: string;
                severity?: "mild" | "moderate" | "severe"; recordedAt?: string }[]
  onRecord?(): void            // required when state === "none-recorded"
  onReview?(): void
}
```

| state | Rendering |
|---|---|
| `has-allergies` | `clinic-critical` text + filled glyph on `clinic-critical-soft`; allergens inline "Penicillin — rash • Latex — hives", overflow `+N` with `HoverCard` |
| `no-known` | `things-gray-3`, small, plain "No known drug allergies (ไม่มีประวัติแพ้ยา)" + date confirmed. **Not red** — fixes the 02.1 defect |
| `none-recorded` | `clinic-warn` outline + a `Record allergies` action |

Not dismissible, not collapsible, no animation. Thai fixture mandatory (both
languages in one story where feasible).

### `PatientSearchCombobox` — code-or-name lookup
**P0** · `01.1` CN/ชื่อ/สกุล search; WinForms EMR "Search for Patient" · `ui/command`, `ui/popover` · **Fluid**
`{ onSelect(patient), scope?: "all" | "today" | "mine", minChars?: number }`.
Accepts MRN/CN, partial name, phone, or national ID, disambiguated by input
shape. Results show name + DOB + MRN — never name alone (duplicate names are
the classic wrong-patient vector). Debounced, keyboard-first, `Enter` selects a
single exact match.

### `PatientPickerDialog` — full search results as a modal
**P1** · `01.2 ค้นประวัติ.png` · `ui/dialog`, `DataTable` · **Breakpoint-swap**
`{ open, query, onSelect, onCancel, columns? }`. Escalation from the combobox
when the result set is large or needs comparison. Full-row selection, `Enter`
confirms, `Esc` cancels, Select disabled until selection. Below `md`: full-screen
`Sheet`. Generic enough to serve as the find-entity dialog for other coded
lookups.

### `PatientIdentityCard` — photo + demographics block
**P1** · WinForms EMR "Patient Photograph"; portal green card; Thai VB6 product photo panel · `ui/avatar`, `ui/card` · **Fluid**
`{ patient, fields?: ("dob"|"sex"|"phone"|"address"|"insurance"|"mrn")[], onChangePhoto?, orientation?: "portrait" | "row" }`.
`portrait` for the inspector rail, `row` for mobile and patient-facing screens.
Initials fallback in `Avatar`.

### `VitalsStrip` — compact editable vitals row
**P1** · `02.1` BW/H/BP/Pulse/BMI/IBW + CC · `ui/input-group`, `ui/field`, `ui/tooltip` · **Fluid**

```ts
type VitalKey = "bw" | "h" | "bp" | "pulse" | "temp" | "bmi" | "ibw" | "resp" | "spo2" | "pain"
interface VitalsStripProps {
  cells: { key: VitalKey; value?: string | [string, string]; unit?: string;
           takenAt?: string; abnormal?: boolean }[]
  chiefComplaint?: string
  editable?: boolean
  derived?: ("bmi" | "ibw" | "bsa")[]   // computed, muted background, not editable
  onChange?(key: VitalKey, value: string | [string, string]): void
}
```

`.clinic-num`; abnormal → `clinic-critical` + tooltip; unknown renders `—`
(never an empty box); BP is always one cell (`120/80`). Derived fields are
computed and visually distinguished — the source tints them yellow and lets you
type into them, which invites inconsistency. Wraps 2 rows below `md`, never
scrolls horizontally: these are inputs. Grid `grid-cols-3 sm:grid-cols-4
lg:grid-cols-7`; CC spans full row.

### `VitalsList` — label / value / date, most recent
**P1** · `EHR-Vitals-Analysis.png` left column · — · **Fluid**
`{ items: { label, value, unit, at, trend?: "up"|"down"|"flat" }[], onSelect? }`.
Clicking a row plots it (`onPlot` into `TrendChart`). The `trend` arrow is an
addition; the source has none.

### `ClinicalSummaryColumn` — attested clinical list panel
**P1** · WinForms EMR triptych + attestation; portal `+` expanders · `CollapsiblePanel`, `ui/scroll-area`, `ui/empty` · **Fluid**

```ts
interface ClinicalSummaryColumnProps {
  title: string
  items: { id: string; label: string; severity?: "info" | "alert"; meta?: string;
           onClick?(): void }[]
  reviewedAt?: string; onReattest?(): void     // "Reviewed 05/03/2014" is a control
  onAdd?(): void; loading?: boolean
}
```

`alert` items get the alert glyph + `clinic-critical` label (Glucophage ⚠ vs
aspirin ⓘ). The "Reviewed \<date\>" stamp is a real clinical artefact — clicking
it re-attests. Three-up usage via `<ClinicalSummaryTriptych>` in the same file
(`grid md:grid-cols-3 gap-4`); replaces the parent packages' screen-local
"ReviewRow" composition because it recurs across chart-overview and exam-room
screens.

---

# Layer 3 — Queue & scheduling (9)

### `StatusDot` + `StatusLegend` — semantic dot with a shape channel
**P0** · `01.1` queue legend (adjudicated: มา/รับ/อั้น = processing status) · — · **Fluid**

```ts
type QueueTone = "arrived" | "accepted" | "held" | "done" | "cancelled" | "pending" | "info"
function StatusDot({ tone, label?: string, size?: "sm" | "md" }): JSX.Element
function StatusLegend({ items: { tone: QueueTone; label: string }[],
                        counts?: Record<QueueTone, number>,
                        value?: QueueTone[], onChange?(v: QueueTone[]) }): JSX.Element
```

Tone → color: arrived `things-green`, accepted `things-gold`, held
`things-gray-3`, done `things-green`, cancelled `things-badge`, pending gray,
info blue. When `onChange` is supplied the legend doubles as a filter; with
`counts` it becomes a workload summary. Legend: inline row, `text-xs
text-things-gray-3`, gap-3.

### `TriageDot` / `TriageLegend` — clinical urgency with a non-colour channel
**P2** · *domain-standard, not in these sources* — ⚖️ the queue legend is
processing status, not triage; retained because any real clinic needs urgency
(01.1's low-confidence urgency select hints at it) · — · **Fluid**

```ts
{ level: "routine" | "urgent" | "emergency", label?: boolean, size?: "sm" | "md" }
```

Colour **plus shape**: routine = hollow ring (`clinic-ok`), urgent = half-filled
(`clinic-warn`), emergency = filled with centre dot (`clinic-critical`). Always
an `aria-label`. Do not reuse for queue processing state — that is `StatusDot`.

### `QueueTable` — the waiting queue
**P0** · `01.1` คิวตรวจ (on every Thai VB6 product screen) · `DataTable`, `ui/button` · **Scroll-locked**

```ts
interface QueueTableProps {
  rows: { id, mrn, name: NameParts, arrivedAt: string, waitMinutes?: number,
          status: "arrived" | "accepted" | "held" | "done" | "cancelled",
          note?: string }[]
  onSelect(id): void
  onRefresh?(): void
  legend: { tone: QueueTone; label: string }[]
  autoRefreshMs?: number
}
```

Columns: status dot · MRN · name · arrival time · **wait duration** · note.
Wait duration is an addition — the source shows arrival time only; a clinic
manager needs elapsed time. Rows tint at `held`/`cancelled` only; otherwise the
dot carries it. Sticky header; first two columns stick on horizontal scroll.
Below `md`: rows become stacked list items (dot + name + time; code/remark as
meta line) — both renderings live in this component.

### `AppointmentCard` — one appointment
**P0** · `EHR-Daily-Schedule.png`, `EHR-Patient-Timeline.png` · `ui/card`, `ui/context-menu` · **Fluid**

```ts
interface AppointmentCardProps {
  appt: { id, patient: { name: NameParts; age?: string; sex?: "male" | "female" },
          start, end?, type: string, reason?: string, location?: string,
          status: "scheduled" | "confirmed" | "checked-in" | "in-room" |
                  "checked-out" | "no-show" }
  selected?: boolean
  actions?: ContextMenuAction[]   // Completed / Not Completed / Discharged / Edit …
}
```

The closest thing in the sources to an existing Things component — treat it as
a clinical `TaskRow`. Status is a glyph + text, never a colour fill. Selected =
`things-blue-soft` with a `things-blue` left edge (matching `TaskRow`'s
expanded state; the source's orange focus ring becomes the Things blue accent).
At 320px the time range moves under the name.

### `ScheduleGrid` — day / week resource calendar
**P1** · `EHR-Integrated-EHR-Billing-Software.png` · `ui/scroll-area`, `ui/select` · **Breakpoint-swap**

```ts
interface ScheduleGridProps {
  view: "day" | "week"
  resources: { id, label, color }[]    // providers or rooms
  slots: { start, end, resourceId, appt }[]
  interval?: 5 | 10 | 15 | 30
  businessHours?: [string, string]     // outside hours render on clinic-lane
  rangeLabel: string                   // "April 27 – May 3, 2014"
  onNavigate?(dir: -1 | 1): void
  onCreate?(slot): void
  onMove?(id, slot): void
}
```

- `≥ lg` — week × resource columns; `md` — single day, resources as columns;
  `< md` — an agenda list of `AppointmentCard`s. A 5-day grid at 390px is
  unreadable; do not attempt it.
- Appointment fill uses the **category** palette (03 §2), never severity.
  Status is a glyph — otherwise type and status compete for the same channel.
- Overlaps split the column width, as the source does. Blocks render via
  `TimelinePill`.

### `MiniCalendar` — month picker with density markers
**P1** · WinForms EMR left rail (today amber) · `ui/calendar` · **Fluid**
`{ selected, onSelect, markers?: Record<string, { count: number; level?: Level }> }`.
Today uses `clinic-today`; `markers` puts a density dot under days with
appointments — makes the rail calendar actually useful.

### `ScheduleSummaryTable` — Scheduled / Checked-In / Checked-Out / No-Shows × Mine | Total
**P2** · WinForms EMR Clinician's Schedule · `ui/table` · **Fluid**
`{ date, rows: { status, mine, total }[] }`. Six numbers that answer "how is
today going". `.clinic-num`; clicking a cell filters the queue.

### `ResourceFilterList` — checkbox list of providers / rooms
**P2** · `EHR-Integrated…` resource panel · `ui/checkbox`, `ui/scroll-area` · **Fluid**
`{ groups, value, onChange, showColors? }`. Colour swatch per resource matching
the grid; select-all / clear per group.

---

# Layer 4 — Clinical data & visualisation (15)

### `DataTable` — the dense table primitive everything builds on
**P0** · every grid in all three products · `ui/table`, `ui/scroll-area` · **Scroll-locked**

```ts
interface DataTableProps<T> {
  columns: {
    id: string; header: ReactNode; width?: number; align?: "start" | "end"
    sticky?: "start" | "end"
    numeric?: boolean                  // .clinic-num + right align
    priority?: "primary" | "secondary" // secondary hides below md
    cell(row: T): ReactNode
  }[]
  rows: T[]
  rowKey(row: T): string
  zebra?: boolean
  rowTone?(row: T): "none" | "ok" | "warn" | "critical"
  groupBy?(row: T): { id: string; label: ReactNode }   // clinic-lane group row
  selected?: string[]
  onSelect?(id): void
  sort?: { id, dir }; onSort?(id): void
  emptyState?: ReactNode
  subRow?(row: T): ReactNode            // interpretive note under a result row
  virtualizeAbove?: number              // row count threshold, default 200
}
```

Build this properly once and eleven other components become thin. It carries:
sticky header + sticky first column, group rows, zebra, per-row severity tone,
numeric alignment, sub-rows, column priority, virtualisation. **No table
library** — `AGENTS.md` defaults to zero new dependencies and `ui/table` +
`ui/scroll-area` cover this. Generic `<T>` from day one; retrofitting across
eleven dependents is the expensive version.

### `ValueWithUnit` — a clinical value is never bare
**P0** · `EHR-Orders-and-Labs.png` UOM column; `02.4` omits units (the defect) · — · **Fluid**
`{ value, unit?, precision?, flag?, range?: [low, high] }`. Renders
`120 <span>mg/dL</span>`, unit at `text-[11px] text-things-gray`. Applies
`.clinic-num`. Reference range shown as `title`.

### `AbnormalFlag` — H / L / critical
**P0** · `EHR-Orders-and-Labs.png` `H` flag; `02.4` ปกติ/ผิดปกติ · `ui/badge` · **Fluid**
`{ flag: "N" | "H" | "L" | "HH" | "LL" | "A", label?: string }`. Glyph + letter
+ colour (02 §4.1 second channel). `HH`/`LL` (panic values) get the filled
critical treatment.

### `EventTimeline` — swimlanes × dates (the longitudinal backbone)
**P0** · `EHR-Patient-Timeline.png`; an open-source EMR; PSP; `EHR-Daily-Schedule.png` strip · `ui/scroll-area`, `ui/hover-card` · **Scroll-locked**

```ts
type LaneId = "medications" | "notes" | "orders" | "labs" | "communications"
            | "documents" | "vitals" | "immunizations" | "problems" | "appointments"
interface EventTimelineProps {
  lanes: { id: LaneId; label: string }[]        // order = row order; color/icon via category map
  events: { id, laneId, at: string, kind, label?, detail?: { label; value }[],
            thumbnailUrl? }[]
  columns?: "day" | "week" | "month" | "encounter"
  variant?: "dot" | "pill" | "thumbnail"        // WinForms EMR / an open-source EMR / PSP
  hiddenLanes?: LaneId[]; onHiddenLanesChange?  // wired to CategoryLegend
  todayColumn?: boolean                          // clinic-today band + label
  pxPerDay?: number                              // zoom, default 28
  onSelect?(eventId): void
}
```

Sticky lane labels (120px) + sticky date header; events absolutely positioned;
same-coordinate events stack into a `+N` cluster with a `HoverCard` (the source
overlaps them and loses information). Three variants cover all three sources:
`dot` (WinForms EMR lanes), `pill` (an open-source EMR, label inside the bar), `thumbnail` (PSP,
imaging preview in the cell). The scroll model is mobile-native (finger scroll,
sticky labels); below 640px reduce lane height and hide sub-day ticks — no
separate mobile variant needed. Click opens `EventDetailPopover` when `detail`
is present.

### `EventDetailPopover` — anchored key-value detail on an event
**P2** · an open-source EMR's balloon (substance, ATC, regimen, aim, episode, revision) · `ui/popover` · **Breakpoint-swap**
`{ event, actions? }`. Title row (lane icon + date) + `dl` grid — labels
`text-things-gray-3 text-xs`, values `text-things-ink text-sm` (`.clinic-num`
for numbers). Below `sm`: bottom `Sheet`, same content.

### `CategoryLegend` — colour key with visibility toggles
**P1** · an open-source EMR category tree; a timeline tool legend · `ui/checkbox` · **Fluid**
`{ categories: { id, label, color, count? }[], value, onChange, variant?: "panel" | "popover" }`.
A legend that filters; swatches are 10px squares (not dots — squares read
better for lanes). `popover` variant is the compact/mobile form behind a
"Layers (4)" trigger.

### `ResultTable` — lab results with flags, ranges, interpretive notes
**P1** · `EHR-Orders-and-Labs.png`, `02.4` · `DataTable` · **Scroll-locked**

```ts
interface ResultTableProps {
  panels: { id: string; name: string; receivedAt?: string;
            analytes: { id, name, nameLocal?, value?, flag?: "N"|"H"|"L"|"HH"|"LL",
                        range?, uom?, note?, collectedAt? }[] }[]
  dense?: boolean
}
```

Columns: Name · Value · Flag · Reference range · UOM · Status · Date. Abnormal
rows tint via `rowTone` and **the value itself takes `clinic-critical`** — the
Quest pink row works because the eye lands on the value. Interpretive text
(`Impaired: 100–125 mg/dL`) renders as a monospace `subRow`, as the source
does. Panel grouping via `groupBy` (COMP METAB PANEL, CBC). `nameLocal`
renders the bilingual pair ("Cholesterol / ไขมันในเลือด"). `HH`/`LL` rows add a
2px `clinic-critical` left accent.

### `FlowsheetGrid` — measures down, encounters across
**P1** · `EHR-Flow-Sheets.png`; PSP matrix · `DataTable` · **Scroll-locked**

```ts
interface FlowsheetGridProps {
  sections: { id, label, rows: { id, label, unit?, range?: [number, number] }[] }[]
  columns: { id, at: string, label?: ReactNode }[]      // encounter datetimes
  values: Record<string, Record<string, ValueWithUnit>>
  onCellSelect?(rowId, colId): void
  onPlot?(rowIds: string[]): void                       // select rows → TrendChart
  onlyRowsWithData?: boolean
  maxColumns?: number                                   // paginate columns, newest first
}
```

The canonical scroll-locked component: **sticky first column and sticky header
are not optional.** Abnormal via the row's `range`. Section rows render on
`clinic-lane`. Row checkboxes feed `onPlot`, turning any subset into a
`TrendChart` — the source has the affordance (a chart icon) and never delivers
it. "Row 0 of 12" pager and the date-range filter row included.

### `MetricTile` — one number, large
**P1** · `EHR-Vitals-Analysis.png` (120/80 — April 24, 2014) · `ui/card` · **Fluid**
`{ label, value, unit?, at?, tone?, sparkline?: number[], footnote?: { label,
value, tone? }[], onSelect? }`. `text-3xl font-semibold .clinic-num`; ships in
a grid that goes 4→2→1. Footnotes are the scorecard's cumulative rows (semantic
green/red values). The source's deep-blue gradient becomes a flat tinted card.

### `TrendChart` — multi-series clinical time series
**P1** · `EHR-Vitals-Analysis.png` BP chart; portal sparklines · `ui/chart` (recharts) · **Fluid**

```ts
interface TrendChartProps {
  series: { id, label, color, type?: "line" | "bar",
            yAxis?: "left" | "right", points: { at: string; value: number }[] }[]
  range?: "3m" | "6m" | "1y" | "2y" | "all"      // wired to RangeToggle
  onRangeChange?(r): void
  referenceBands?: { from: number; to: number; tone: Tone }[]   // normal-range shading
  annotations?: { at: string; label: string }[]                 // med start/stop markers
}
```

`referenceBands` is the clinically important addition: shading the normal range
turns the chart from decorative into diagnostic. Series colours are CSS vars
from the category map (`var(--color-things-blue)` etc.) — never literal hex;
`--color-chart-1..5` stay grayscale fallback. Below `md`, at most two series
and the legend collapses behind a tap. Responsive via chart container.

### `MedicationTimeline` — therapy Gantt
**P1** · `EHR-Vitals-Analysis.png` bottom · `ui/scroll-area`, `ui/toggle-group` · **Scroll-locked**
`{ meds: { id, label, start, end?, status: "active"|"stopped"|"held", dose? }[],
range, show?: "current" | "all", onShowChange? }`. Round cap = start, arrow cap
= ongoing, ✕ caps + grey bar = discontinued — copy the source's encoding, it is
genuinely good. **Aligns its x-axis with `TrendChart`** so "BP dropped when
lisinopril started" is visible; keep the two in one container.

### `ResultReport` — a full external lab report
**P2** · `EHR-Orders-and-Labs.png` (Quest) · `PaperSurface`, `ResultTable`, `PaginationFooter` · **Scroll-locked**
Identity grid header (requisition, accession, collected, reported) +
`ResultTable` + page footer + "View HL7 File" disclosure link. Rendered on
`clinic-paper` because it is a received document, not app data.

### `RangeToggle` — 3m · 6m · 1y · 2y · All
**P2** · `EHR-Vitals-Analysis.png` · `ui/toggle-group` · **Fluid**
`{ options: string[], value, onChange }`. Trivial, used by three components;
build once.

### `TimelinePill` — a labelled event bar
**P2** · an open-source EMR; WinForms EMR appointment blocks · — · **Fluid within its track**
`{ label, color, start, end?, truncate?, selected? }`. Extracted because
`EventTimeline`, `MedicationTimeline` and `ScheduleGrid` all draw the same
primitive: soft category-tinted fill + 3px left bar, `.clinic-num` time, muted
meta lines.

### `TimelineMinimap` — density histogram as a time brush
**P3** · PSP · `ui/slider` · **Desktop-only**
`{ buckets: { at, count }[], window: [from, to], onWindowChange }`. Over a
decade of records, the minimap finds the cluster worth looking at. Hide below
`lg`; small screens use a date-range select.

---

# Layer 5 — Clinical lists (6)

All `DataTable` configurations plus a row dialog; listed separately because each
carries required domain fields that must not be left to the caller.

### `ProblemTable` — the problem list
**P1** · `EHR-Problem-Lists.png` · `DataTable`, `ui/dialog` · **Scroll-locked**
Columns: alert · priority · code (ICD/SNOMED, `font-mono`) · description ·
onset · modified · note. Paired `EditProblemDialog`: required-field marking,
dual code lookup via `CodedSearchInput` (SNOMED term + ICD with read-back),
status/chronic, onset/resolution, and an append-only `NoteHistoryLog` — never
edit a prior note in place.

### `AllergyList` — allergen → reaction
**P1** · `EHR-Allergies.png`; `02.1` · `ui/item`, `ui/dialog` · **Fluid**
`{ allergies: { allergen, reactions: string[], severity?, onsetAt?, source? }[] }`.
Row dialog takes up to five symptom lookups + comment. Severity drives tone.
Feeds `AllergyBanner` and `ClinicalSummaryColumn`.

### `MedicationList` — current and historical medications
**P1** · `EHR-Medications.png` Prescription History · `DataTable` · **Scroll-locked**
Columns: status · start date · interaction flag · drug + dose + sig · last
refill · prescriber. The `!` column opens a drug-info `Dialog` (left category
list: allergy/drug/disease interactions, patient education, provider guidelines
+ numbered guidance + disclaimer). Group by `Current` / `Historical`. The ⚠ vs
⊘ vs ⓘ icon triad = active-with-warning / discontinued / info.

### `CareGapTable` — protocol compliance
**P1** · `EHR-Clinical-Decision-Support.png` · `DataTable` · **Scroll-locked**
Columns: measure · required interval · today's result · previous result ·
previous date. Interval renders `clinic-warn` when due, plain when satisfied
(due ≠ dangerous). Grouped by protocol with `status` on each group header;
footer all-clear row. Guideline names are links.

### `ReconciliationList` — Keep / Stop / Inactivate
**P2** · `EHR-Medication-Reconciliation.png` · `DataTable`, `ui/select` · **Fluid**
`{ sections: ("allergy"|"medication"|"problem")[], items, onAction,
onMarkReviewed }`. The action column is a **control, not a label** — the source
renders a decision as static coloured text, hiding that it is editable.
Coloured text-button on desktop (`Keep ▾`), compact `ui/select` below `md`.
Tones: Keep `clinic-ok`, Stop `clinic-critical`, Inactivate `clinic-warn`
(reversible). Footer: Mark as Reviewed + Preview + Save. The reconciliation
dialog itself is a screen composition (blueprint).

### `NoteHistoryLog` — append-only audit
**P2** · `EHR-Problem-Lists.png` note history · `ui/table` · **Fluid**
`{ entries: { id, at, note, author }[], reverse?, emptyLabel? }`. Newest-first,
timestamps `.clinic-num text-things-gray-2 text-xs`; notes wrap, never
truncate. Used by `ProblemTable` and `AuditFooter.history`.

---

# Layer 6 — Clinical entry (15)

### `MetaGrid` — label → value pairs in columns
**P0** · cardiology procedure cards; WinForms EMR order detail; Rx preview · `ui/field` · **Fluid**
`{ items: { label, value, span? }[], columns?: 1|2|3|4, editable?, onEdit? }`.
The single most repeated structure in the whole screenshot set. Labels
`text-things-gray-3 text-xs`, values `text-things-ink text-sm` (`.clinic-num`
for numbers). Columns collapse 4→2→1.

### `FormGrid` — the base form layout kit
**P0** · WinForms EMR record modals; Thai VB6 product registration · `ui/form`, `ui/field`, `ui/input`, `ui/input-group`, `ui/select`, `ui/native-select` · **Fluid**

```tsx
FormGrid({ columns?: 1 | 2 | 3 })          // grid-cols-1 md:grid-cols-2 lg:grid-cols-3
FormSection({ title, description? })       // hairline-topped group
FormRow({ children, columns? })            // one grid row; address cascade stays 3-col at all sizes
RequiredMark()                             // red asterisk + aria
```

Labels above fields (Thai labels are long — above beats side). Help text
`text-things-gray-3 text-xs`. Read-only "filled field" from the sources →
`bg-things-blue-soft/50` on read-only inputs. Complements `MetaGrid`
(edit vs display).

### `FormActionBar` — the bottom form action row
**P0** · `01.1` (เพิ่มใหม่ / แก้ไข / บันทึก / ยกเลิก / ส่งตรวจ / พิมพ์ / ปิด-Esc) · `ui/button-group`, `ui/button` · **Fluid**
`{ primary, secondary?, destructive?, dirty?, saving?, shortcuts? }`. Enforces
the separation rule (02 §4.4): primary right, destructive segregated behind a
confirm, `Esc` = cancel, `Cmd/Ctrl+S` = save. Sticky at the bottom of a
scrolling form; shows an unsaved-changes marker — every source form has a dirty
state and none of them indicate it. Disabled primary shows a reason tooltip.

### `CodedSearchInput` — type-ahead that returns a coded concept
**P0** · `02.1` diagnosis autocomplete; `02.2` drug list; WinForms EMR SNOMED/ICD · `ui/command`, `ui/popover` · **Fluid**

```ts
interface CodedSearchInputProps<T> {
  system: "icd10" | "icd9" | "snomed" | "drug" | "lab" | "cpt" | string
  value?: T
  onSelect(concept: T): void
  search(q: string): Promise<T[]>
  allowFreeText?: boolean          // default false — coded systems stay coded
  favorites?: T[]; recents?: T[]   // Quick Picks / My Favorites
}
```

Pattern #4 — present in all three products. Rows render code (`font-mono`) +
preferred term (link-blue) + local term (muted, "Cholesterol /
ไขมันในเลือด"); the code read-back pattern ("493.91 ASTHMA UNSP…") renders
beside/below the input on selection. Favourites and recents appear above search
results — that is what clinicians use 90% of the time. `-`/`—` leads every
optional picklist as the none sentinel. Below `md` the read-back wraps to a
second line.

### `ProcedureEntryCard` — the modern clinical record card
**P1** · cardiology `1.jpg`/`2.jpg` · `ui/card`, `ui/collapsible`, `ui/switch` · **Fluid**

```ts
interface ProcedureEntryCardProps {
  kind: string                       // "Angiogram" | "Stent" | "Access Site" | "Subjective"…
  title: ReactNode
  accent: string                     // category token — the left rail colour
  glyph?: ReactNode
  meta?: MetaGridProps["items"]
  toggle?: { checked: boolean; onChange(v: boolean): void; tone?: Tone }
  onEdit?(): void; onDelete?(): void
  defaultOpen?: boolean
  children?: ReactNode               // NestedPanel stack
}
```

**The flagship pattern** — the answer to "how do we rebuild the 2006 screens".
One card per clinical act, coloured accent rail, meta grid, nested findings;
maps cleanly onto Things' card sensibility and is already a modern design in
the source (adopting, not inventing).

### `NestedPanel` — titled sub-panel with a single add action
**P1** · cardiology `FINDINGS` / `COMPLICATIONS` · `CollapsiblePanel` (variant `inline`) · **Fluid**
`{ title, addLabel, onAdd, children, emptyState? }`. Hairline box, uppercase
`text-[11px] tracking-wide` title, right-aligned ghost `+ ADD/EDIT` button.

### `InlineMetricChip` — a measured value as a tinted chip
**P1** · cardiology `90% Pre-Intervention` / `0% Post-Intervention` / `TIMI 2` · `ui/badge` · **Fluid**
`{ value, label?, tone?, unit? }`. Value `font-medium .clinic-num`, label
`things-gray-2`; tone from severity, default neutral.

### `FindingsChecklistGroup` — checkbox group with an "All Normal" master
**P1** · `EHR-Chart-Notes.png` foot exam; `EHR-EM-Coding-Engine.png` HPI · `ui/checkbox`, `ui/select` · **Fluid**

```ts
interface FindingsChecklistGroupProps {
  title: string
  items: { id, label, checked: boolean, abnormal?: string, options?: string[] }[]
  allNormalLabel?: string
  onToggle(id, checked): void
  onAbnormal?(id, value): void
  columns?: 1 | 2 | 3
}
```

"All Normal" sets every item to its normal value in one click — the biggest
time-saver in clinical documentation. Marking an item abnormal reveals its
`Abnx` select inline. Paired-option grids (Closed-toed vs Sandals) and
tri-state radios (Intact/Diminished/Absent) compose from `ui/checkbox` +
`ui/radio-group` inside this group. Columns collapse to 1 below `md`; never
shrink a checkbox hit area below 24px.

### `DrugSearchTree` — hierarchical drug picker
**P1** · `EHR-ePrescribing.png` (Lipitor → oral → tablet → 10/20/40/80 mg); `02.2` flat list · `ui/collapsible`, `ui/command`, `ui/checkbox` · **Scroll-locked**

```ts
interface DrugSearchTreeProps {
  nodes: DrugNode[]                  // drug → route → form → strength leaf
  onSelect(leaf: DrugNode & { sig?: { dispense?: string; sig?: string } }): void
  filters: { route: boolean; dosage: boolean; strength: boolean; autoExpand: boolean }
  maxRows?: number
  favorites?: string[]; onToggleFavorite?(id: string): void
}
```

Only leaves are selectable; leaves carry the fully-qualified sig
("[Disp: 60.00 Tablet Sig: 1 Q Day]"). Warning glyphs propagate up from leaves.
Filter checkboxes control which levels render at all — that is what makes the
tree navigable. Below `md`: `variant="flat"` — leaves only, group headers per
drug (a tree at 390px is a scroll trap). Search-first (`CodedSearchInput`),
browse-second (this tree) — `02.2`'s flat ~200-item alphabetical list as the
primary interaction does not scale.

### `OrderEntryForm` — the drug / lab / imaging order row
**P1** · `02.2`, `02.3`, `02.4` · `ui/field`, `CodedSearchInput`, `SigBuilder` · **Fluid**

```ts
interface OrderEntryFormProps {
  kind: "drug" | "lab" | "imaging" | "procedure"
  value: Partial<Order>
  onChange(o): void; onSave(): void; onDelete(): void
  orderSets?: OrderSet[]                                  // with OrderSetButtons
  showCost?: boolean            // Thai market: ทุน on the clinical row (verified 02.4)
  normalRange?: [string, string]      // lab kind — ค่าปกติ 0 ถึง 35 (verified)
  criticalValue?: string              // lab kind — ค่าอันตราย 150 (verified; safety field)
  resultType?: "numeric" | "text" | "option"
  relatedProblems?: string[]          // lab kind — related-problem tagging
}
```

One component, four modes — the source screens are structurally identical: a
coded item + parameters + qty + save/delete + an order-set pair. The lab mode
**must keep `criticalValue`**: it renders with a red tooltip ("flags result as
critical above this value") and `clinic-critical` text. `showCost` is a
deliberate market accommodation. Fields stack to 1 column below `md`; the
range pair stays side-by-side.

### `SigBuilder` — dose / route / frequency → a human sentence
**P1** · `02.3` (`1xApply2` → `ทา - - วันละ 2 ครั้ง@เช้า-เย็น`) · `ui/select`, `ui/textarea` · **Fluid**
`{ directionCodes: { code, sig }[], value, onChange, locale, preview: string }`.
Structured inputs on top, the rendered localised sig below, **always visible
and editable**. Behavior: picking a code writes the sig from the table, but a
hand-edited sig is respected (`sigDirty` flag) — code assists, never locks. Sig
text is what the patient reads; generate per locale, never store as a string.

### `LineItemTable` — editable rows with a totals footer
**P1** · `02.3`/`02.4` result tables; `EHR-Encounters-Safety-Net.png` Charge Summary · `DataTable` · **Scroll-locked**
`{ rows, columns, onEdit, onDelete, onDuplicate, statusDot?: boolean,
totals?: { label, value }[], bundleOption?: { label, checked, onChange } }`.
Inline edit, per-row Copy/Delete, right-aligned numeric columns, a rule above
the totals row, optional bundle-billing checkbox in the footer. Used by
prescriptions, lab orders and charge capture alike (the source's green
per-line status dot included).

### `CodePickerAccordion` — browse codes by group
**P2** · `EHR-Encounters-Safety-Net.png` superbill Procedures/Diagnosis · `ui/accordion` · **Fluid**
`{ groups: { id, label, codes: { code, label, selected }[] }[], value,
onToggle, multiple? }`. The browse complement to `CodedSearchInput` — for the
fixed superbill a clinic uses daily. Selected codes get ✓ and a
`things-blue-soft` row; a `Lookup` row at each accordion bottom.

### `OrderSetButtons` — apply / save a template
**P2** · `02.3` สั่งสูตร / บันทึกสูตร (verified on pixels); WinForms EMR Quick Picks + Favorites · `ui/dropdown-menu` · **Fluid**
`{ sets, onApply, onSaveCurrent, scope?: "mine" | "clinic" }`. Pattern #5. A
clinic that treats the same five conditions all day lives on this.

### `TemplateSelect` + `GeneratedSummaryPanel` — template-driven documentation
**P2** · `EHR-Chart-Notes.png`, `EHR-EM-Coding-Engine.png` · `ui/select`, `ui/scroll-area` · **Fluid**
A template picker plus a read-only generated narrative where each structured
field is an underlined link back to the control that produced it. Counted as
one entry — useless apart. The link-back is the good idea: the prose stays in
sync because it is derived, never typed.

---

# Layer 7 — Documents & communication (14)

### `MessageThread` — the conversation view (ChatUI)
**P0** · `EHR-Secure-Communication-Hub.png` (quoted blocks); portal Messages tile · `ui/message`, `ui/message-scroller`, `ui/bubble`, `ui/item`, `ui/marker` · **Fluid**

```ts
type ThreadEntry =
  | { id: string; kind: "chat"; authorId: string; at: string; body: string;
      attachments?: AttachmentRef[]; direction: "in" | "out";
      status?: "sent" | "delivered" | "read" }
  | { id: string; kind: "quote"; at: string;                  // email-shaped legacy
      header: { from: string; sent: string; to: string; subject: string };
      body: string; direction: "in" | "out" }
  | { id: string; kind: "system"; at: string; text: string; tone?: "info" | "warning" }
  | { id: string; kind: "divider"; at: string }

interface MessageThreadProps {
  entries: ThreadEntry[]
  participants: Record<string, { name: string; avatarUrl?: string; role?: string }>
  currentUserId: string
  patientContext?: { chartId: string; name: string }   // header chip "Re: Chart #9562 …"
  unreadBefore?: string                                 // entry id above which "Unread" divider
  onEntryClick?(entry: ThreadEntry): void
}
```

Chat turns render as `bubble` + `item` (in: left with avatar/name/role; out:
right, primary); read receipts as `text-[11px]` ("Read 11:14"). **Quote-block
mode** renders email-shaped turns as full-width cards (`bg-things-chip-soft`,
hairline border, 2×2 From/Sent/To/Subject header grid) — the faithful
translation of WinForms EMR's blue gradient quote box onto Things surfaces, so legacy
messages and chat share one stream. System events render as centered `marker`
lines. Chat primitives are mobile-native: bubbles go full-width, avatars
collapse below `sm`. **No PHI in fixtures.**

### `MessageComposer` — compose bar / dialog (ChatUI)
**P0** · `EHR-Secure-Communication-Hub.png` · `ui/message`, `ui/field`, `ui/textarea`, `ui/select`, `ui/dropdown-menu`, `ui/sheet` · **Fluid**

```ts
interface MessageComposerProps {
  mode?: "inline" | "dialog"
  to: string[]; onToChange(ids: string[]): void
  subject?: string; onSubjectChange?(s: string): void
  body: string; onBodyChange(s: string): void
  importance?: "normal" | "high" | "low"; onImportanceChange?(i): void
  attachments: AttachmentRef[]; onAttach(a: AttachmentRef): void
  onRemoveAttachment(id: string): void
  onSend(): void; sending?: boolean
  onConvertToTask?(): void            // the source's good idea: message → task
  placeholder?: string
}
```

Send disabled while body empty; importance is an icon+select (no emoji);
convert-to-task sits in the overflow menu with importance. Inline mode: a
single-row bar that grows to ~4 rows on focus; `dialog` mode opens as
full-screen `Sheet` below `md`.

### `AttachmentChip` — a reference to a file **or a clinical entity**
**P0** · `EHR-Secure-Communication-Hub.png` attachment row · `ui/attachment`, `ui/badge`, `ui/tooltip` · **Fluid**

```ts
type AttachmentRef =
  | { id: string; kind: "file"; name: string; size?: string; docId?: string }
  | { id: string; kind: "chart"; chartId: string; patient: string; meta?: string }
// "Doc ID #1970: LabCorp Results.jpg"  |  "Chart #9562; Kakasuleff, Carly L.; Female; Age: 28y"
```

This is what makes clinic messaging different from email: messages carry chart
references, not just files. File chips show doc icon + name + size; chart chips
show a patient glyph + "Chart #9562" + meta. `onOpen`/`onRemove`; chips wrap in
the composer, truncate with tooltip.

### `CameraCapture` — evidence photos taken inside the app
**P1** · nursing home floor app (Nursing Home Cloud WF-02 D-080) · `ui/button` · **Fluid**

```ts
type CameraState = "idle" | "requesting" | "live" | "denied" | "unsupported"
interface CapturedPhoto { id: string; src: string; takenAt: string; blob?: Blob }
// { photos, onCapture, onRemove?, maxPhotos = 3, required?, facingMode = "environment", simulated?, state?, clock? }
```

The camera feeds the app directly (getUserMedia); the shutter keeps a JPEG in
the app's own storage and thumbnails show the time of capture. There is no
file input and no "pick from gallery" fallback, so a resident's photo never
lands in a staff member's phone gallery and every photo was taken at the time
of recording. Denied and unsupported states explain what to do; `required`
shows a warn-tone hint (glyph + text) until a photo exists; a photo limit
disables the shutter. `simulated` draws a deterministic test card for stories
and checks.

### `RecipientPicker` — directory lookup with tokens
**P0** · recipients-as-directory-links pattern · `ui/command`, `ui/badge`, `ui/avatar` · **Fluid**
`{ directory: { id, name, role?, avatarUrl? }[], selected, onChange, max? }`.
Selected recipients render as avatar+name tokens with ✕; the command list
groups by role; already-selected rows show a check. Never free-text email
entry — staff are entities with roles.

### `InboxTile` — module tile with unread count
**P1** · `EHR-Patient-Portal.png` (Messages (0) / Chart (3) / Appointments (1) / Announcements (0)) · `ui/card`, `ui/badge`, `ui/empty` · **Fluid**

```ts
interface InboxTileProps {
  icon: ReactNode; title: string; count: number
  emptyLabel?: string                       // "No New Messages"
  previews?: { id, at, label, sourceTag? }[] // dated items + "(MH)" source tags
  onClick?(): void
}
InboxTileRow({ tiles })                      // grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
```

Count renders as "(n)" after the title in `text-things-gray-2` (the portal's
exact pattern — not a pill) and as a red badge on the icon when `count > 0`.

### `MessageListRow` / `MessageList` — inbox rows for message-like entities
**P1** · `EHR-Electronic-Faxing.png`; Communication inbox · `ui/table`, `ui/badge`, `ui/pagination` · **Fluid**

```ts
interface MessageListRowProps {
  sender: string; subject: string; at: string; read?: boolean
  hasAttachment?: boolean; onClick?(): void; active?: boolean
}
MessageList({ groups: { label: string; rows: MessageListRowProps[] }[],
              total, page?, pageCount?, onPage? })
```

Unread = `font-medium` + blue dot; attachment glyph after subject; date-range
group headers ("Date: 3 Weeks Ago") sticky in the scroll container; "36 Items"
footer + pager. Serves fax, Direct email and internal mail — one component,
three dialects. Meta columns drop to a second line below `md`.

### `PaperSurface` — the printable-document container
**P1** · Rx preview, letter, fax, CCD · — · **Fluid**
`{ size?: "a4" | "letter" | "auto", children, toolbar?, watermark? }`.
`clinic-paper` + `clinic-paper-edge` + `clinic-paper-ink`, subtle page shadow,
print styles. Signals "this is a document, not app state". Document artifacts
may use a serif face; UI chrome stays system sans.

### `DocumentViewer` — image / PDF pane
**P1** · eDocuments + fax viewers; Orders-and-Labs window; HIE · `ui/scroll-area`, `ActionToolbar` · **Breakpoint-swap**
`{ src, kind: "image" | "pdf" | "markup", page?, pageCount?, zoom?, onZoom?,
onRotate?, onCrop?, floating?, breadcrumb?, patientSlot?, footer }`. Header
(breadcrumb/source + compact `PatientHeaderBar` slot), action toolbar (disabled
verbs grayed — "Resend Fax"), canvas, status footer (filename, size, ID, zoom
%). `floating` renders the "external content" chrome (WinForms EMR's orange-titled
window → `shadow-lg ring-1 ring-things-border` with a title bar). Below `md`:
full-screen `Sheet`; edit tools (crop, rotate) hide — desk work.

### `GroupedListPanel` — "Arranged By: …" grouped list
**P1** · fax inbox, eDocuments, superbill worklist, facility rounds · `ui/collapsible` · **Fluid**
`{ items, groupBy, groupOptions, renderItem, footer?: { count, page, pageCount } }`.
Appears in five WinForms EMR screens with the same "Arranged By" selector — build
once. Group headers sticky within the scroll container.

### `PaginationFooter` — "50 Items · 1 of 3" / "Row 1 of 4"
**P2** · six WinForms EMR screens · `ui/pagination` · **Fluid**
`{ total, page, pageCount, onPage, label? }`. `.clinic-num`.

### `PrescriptionPreview` — the Rx as it will print
**P2** · `EHR-ePrescribing.png` · `PaperSurface`, `MetaGrid` · **Fixed-width**
`{ rx, prescriber, pharmacy, actions, interactionsVerified? }`. Prescriber
block, patient block, drug/sig/dispense/refills/void/diagnosis via `MetaGrid`,
footer actions (Coverage · Save · Print · Send). `interactionsVerified: false`
renders a faint warning-triangle watermark + amber "Interactions pending"
badge. Send is irreversible — `alert-dialog`. **Fixed paper-like max-width
(~420px)**: centers on wide screens, fills width and scrolls internally on
narrow — do not reflow the paper metaphor.

### `SummaryOfCareTable` — striped label/value clinical summary
**P2** · `EHR-Direct-Secure-Email.png` CCD · `PaperSurface`, `ui/table` · **Fluid**
`{ sections: { label, rows: { label, value, span? }[] }[], emphasis?, header? }`.
Label column at fixed width on a tinted band (`bg-things-blue-soft` when
`emphasis`); long values (addresses, ID lists) wrap; `span={2}` for wide rows.
Absorbs the parent package's generic "DocMetadataBlock" — this is its only
confirmed use.

### `DocumentTree` — folder tree with counts
**P2** · `Billing-Scheduling-eDocument-Management.png` · `ui/collapsible`, `ui/scroll-area` · **Fluid**
`{ nodes: { id, label, count, icon?, children? }[], selected, onSelect }`.
Zero-count folders stay visible and muted (`DICOM (0)` — absence is
information).

### `AuditFooter` — who / when
**P2** · `EHR-Problem-Lists.png` (`Modified 04/30/2014 4:43PM`) · `ui/hover-card` · **Fluid**
`{ createdBy, createdAt, modifiedBy?, modifiedAt?, revision?, history? }`.
Every clinical record needs provenance visible without a click; `history`
opens the full `NoteHistoryLog`.

---

# Layer 8 — Operations dashboards (5, all P3)

From the SCADA dashboard — **non-clinical origin, deliberately deferred.**
Build only when an operations dashboard is scheduled. (One parent package
declined these entirely; they are kept here as a recorded census, clearly
flagged.)

| Component | Source | Responsive | Note |
|---|---|---|---|
| `ReportFrame` | 3 solar report types, one frame | Config rail wraps below canvas | Title + Print + period dropdown + config rail (calendar, `RangeToggle`, `SeriesToggle`) + chart canvas |
| `SeriesToggle` | solar Report Configuration | Fluid | Checkbox group bound to chart series visibility; swatch squares |
| `TopNCard` | "Top Five Downtime" | Fluid | Ranked horizontal bars (`clinic-warn` tone) + sync-highlighted event table |
| `AlertTicker` | solar alarm footer | Banner stack below md | Severity rows, counters, Ack Top/Ack All; clinic use: critical labs, unsigned notes |
| `KpiScorecard` | solar Site Scorecard | Grid member | 2–3 `MetricTile`s + cumulative label→value rows with semantic tones |

---

# Layer 9 — Specialist / deferred (8, all P3)

Build only when the screen that needs them is scheduled. Each is expensive and
narrow.

| Component | Source | Responsive | Note |
|---|---|---|---|
| `BodyMapAnnotator` | `EHR-Chart-Notes.png` foot exam; cardiology vessel map | **Desktop-only** | Inline SVG with named regions; ⊕/⊖ markers by click. Below `md`: findings list + "view diagram" action. The SVG asset work, not the React, is the cost |
| `AnatomyInspector` | cardiology `1.jpg`/`2.jpg` | **Desktop-only** | Body silhouette + zoom box + Arterial/Venous segmented control + region list; pairs with `BodyMapAnnotator` as its navigator |
| `LabFishbone` | `EHR-Vitals-Analysis.png` (CHEM-7, CBC) | **Desktop-only** | The skeleton diagram. Beloved by clinicians, meaningless to anyone else — ship `ResultTable` first, add as an alternate view |
| `EMLevelMatrix` | `EHR-EM-Coding-Engine.png` | **Desktop-only** | 5×5 selectable decision grid + `LevelMeter`. Coding rules are jurisdiction-specific; wait for the billing model |
| `ComplianceBoard` | `EHR-Meaningful-Use.png` | Fluid | Category × tier grid of met/unmet chips; generalises to any quality-measure dashboard |
| `QueryBuilder` | `EHR-Clinical-Reporting.png` | **Desktop-only** | Field/operator/value rule rows, OR'd criteria chips, reorder controls, results + bulk actions. Needs a field-metadata registry before any UI |
| `VaccineScheduleTable` | `EHR-Immunizations.png` | **Scroll-locked** | Series rows × date given / next due / site / route / reaction + a 20-field vaccine dialog. Almost entirely national-schedule data work |
| `CohortTimeline` | `a timeline tool.png` | **Desktop-only** | Multi-patient swimlanes with align / rank / filter. Population health only |

---

# Not components — screen compositions

Eleven things in the sources look like components but are screens; they belong
to [05-screen-blueprints.md](05-screen-blueprints.md): the registration screen,
the exam-room workspace, the superbill screen, the eDocuments/fax/letters
console, the report builder, the patient portal home, the chart-share form, the
reconciliation dialog, the letter editor, and the "Quick Pay" tabbed dialog.
Building any of them as a single component produces a god-component that cannot
be restyled or reused. Two parent-package "recipes" fold into catalog entries:
the reconciliation dialog = `ReconciliationList` ×3 in a `ui/dialog`; the
immunization record = `VaccineScheduleTable` + a `FormGrid` dialog.

---

# Tier summary

| Tier | Count | Components |
|---|---|---|
| **P0** | 25 | `AppShell` `ModuleRail` `CollapsiblePanel` `SectionHeader` `ActionToolbar` · `PatientHeaderBar` `PatientName` `PatientAge` `AllergyBanner` `PatientSearchCombobox` · `StatusDot`+`StatusLegend` `QueueTable` `AppointmentCard` · `DataTable` `ValueWithUnit` `AbnormalFlag` `EventTimeline` · `MetaGrid` `FormGrid` `FormActionBar` `CodedSearchInput` · `MessageThread` `MessageComposer` `AttachmentChip` `RecipientPicker` |
| **P1** | 34 | `TaskCountList` `PanelStack` `ChartTabNav` `KeyHintButton` · `PatientIdentityCard` `PatientPickerDialog` `VitalsStrip` `VitalsList` `ClinicalSummaryColumn` · `ScheduleGrid` `MiniCalendar` · `ResultTable` `FlowsheetGrid` `MetricTile` `TrendChart` `MedicationTimeline` `CategoryLegend` · `ProblemTable` `AllergyList` `MedicationList` `CareGapTable` · `ProcedureEntryCard` `NestedPanel` `InlineMetricChip` `FindingsChecklistGroup` `DrugSearchTree` `OrderEntryForm` `SigBuilder` `LineItemTable` · `PaperSurface` `DocumentViewer` `GroupedListPanel` `InboxTile` `MessageListRow` |
| **P2** | 20 | `StepTabs` `StatusBar` · `TriageDot` `TriageLegend` `ScheduleSummaryTable` `ResourceFilterList` · `EventDetailPopover` `ResultReport` `RangeToggle` `TimelinePill` · `ReconciliationList` `NoteHistoryLog` · `CodePickerAccordion` `OrderSetButtons` `TemplateSelect`+`GeneratedSummaryPanel` · `PaginationFooter` `PrescriptionPreview` `SummaryOfCareTable` `DocumentTree` `AuditFooter` |
| **P3** | 14 | `LabFishbone` `TimelineMinimap` · `ReportFrame` `SeriesToggle` `TopNCard` `AlertTicker` `KpiScorecard` · `BodyMapAnnotator` `AnatomyInspector` `EMLevelMatrix` `ComplianceBoard` `QueryBuilder` `VaccineScheduleTable` `CohortTimeline` |

`PatientName`, `PatientAge`, `ValueWithUnit` and `AbnormalFlag` are
formatter-sized — an afternoon each — but they are P0 because getting
locale-correct names, composite ages and unit-bearing values wrong later means
touching every other component. The messaging four are P0 because the brief
names the chat family and no other P0 component depends on a pending decision.

---

# Post-catalog additions (2026-09 → 2026-10)

Added after the 93-entry reconciliation (09). Same rules, same format; the
chart family extends Layer 4, the stage family serves workflow screens, and
the tier reflects nursing-home priorities. Props live in each component's
autodocs page; signatures below are the load-bearing parts only.

## Chart family (`src/components/charts/`, extends Layer 4)

Six charts sharing one `ChartConfig` (token-palette colors) and the
**recharts via `ui/chart`** base. Fluid; every chart answers one question.

### `Sparkline` — a bare trend with no axes
**P1** · metric context · **Fluid**
`{ points, color?, filled = true, height = "h-10" }`. The shape is the whole
message; it belongs inside a MetricTile or a table row, never alone — it
carries no scale, and the host is responsible for saying how high is high.

### `LineChart` — the trend chart's flat sibling
**P1** · `TrendChart` family · **Fluid**
Multi-series lines for when position beats volume. A series may carry a dash
pattern for projections — actual solid, forecast dashed — with a null gap
ending the solid line where the future begins. Reference bands and
annotations inherited from the family.

### `AreaChart` — the volume chart
**P1** · `TrendChart` family · **Fluid**
Deals over time, traffic over months. Series stack or overlap; gradient
fills fade to the baseline so two series never fight for the same ink.

### `BarChart` — the comparison chart
**P1** · **Fluid**
Categories against each other, stages of a funnel sideways. Bars take
rounded ends so each reads as a container, not a spike; grouped by default,
stacked when the parts matter as much as the whole. Horizontal is not a
style choice — it is the answer when labels outrun the width.

### `DonutChart` — parts of a whole, total in the hole
**P1** · **Fluid**
The center stat answers "how much altogether" so the ring can stay busy
answering "what are the parts". Past five or six slices, the ring stops
being readable — take the excess to an "other" slice or a table.

### `RadialChart` — one number against its ceiling
**P1** · **Fluid**
Quota, goal, completion. Track = remaining distance, bar = progress, tone =
verdict (green at goal, amber behind, red only when the number itself is
the alarm). A gauge answers exactly one question.

## Stage family (workflow screens)

### `StageFlowBar` — position in a fixed stage sequence
**P1** · care pathways, review flows · **Fluid**
`{ stages: string[], current, inactive = [], unitLabel }`. Chevron segments:
done stages green with their dwell duration, the current stage blue, skipped
stages hatched and unclickable. The stage list is fixed — this bar reports
position, it never reorders.

### `StageBoard` — columns of movable cards, one per stage
**P1** · `StageFlowBar`, `BoardCard` · **Fluid**
Cards move between stage columns (drop at an exact position, not just
append). Every column header reports two numbers that stay honest — card
count and column sum (money or any summable quantity, unit-prefixed) —
re-derived from data on every move.

### `BoardCard` — the card surface for board anatomy
**P2** · `ui/card` · **Fluid**
Title, a summable value in tabular figures, optional contact line, and a
two-channel color status (left edge + soft chip). Selected is the blue left
edge on the soft tint — the task-row language. A plain Card plus anatomy,
never more.

## Nursing-home atoms

### `IdentityChip` — who a thing belongs to
**P2** · owner / follower / assignee / care-team member · `ui/avatar` · **Fluid**
Avatar, name, role, at most one caret menu (`variant="removable"`). The
existing chips say what an item *has*; this one says who it *belongs to*,
and it stays on screen after RecipientPicker has done its picking. Companion
`FollowerStack` renders the overflow crowd. `dense` rides the density scale.

### `CalloutNote` — a note pinned by a person, on purpose
**P2** · between `AllergyBanner` (system) and `NoteHistoryLog` (append-only) · **Fluid**
Tone carries intent, the provenance line carries author and date; position
and dismiss timeout are settable, sticky inline by default. Two channels
always — tone plus a glyph — per the never-colour-alone rule.

## Recipes registry (Docs page — stories, never components)

The **Recipes** group in Storybook holds compositions that are deliberately
not components (issue #1 §2). Registered recipes:

| Recipe | Product screen | Composition core |
|---|---|---|
| Setup progress bar | clinic SCR-022 | 2× Progress + tabular percents + link + warning Badge + collapse |
| Weekly hours | clinic SCR-005/007 | DataTable + Switch + InputGroup periods + copy-to-day |
| Time range | clinic SCR-005/007 | InputGroup(two time Inputs) + ghost remove |
| Language switcher | app shell header | ghost Button(globe) + DropdownMenu radios, native names |
| Email code entry | clinic SCR-043 | InputOTP(6) + Resend countdown + passkey — no passwords, ever |
| Bed layout | nursing home SCR-007 | zone CollapsiblePanels → card-button rooms → StatusDot+mono bed chips; state tokens per §3 of issue #4; never colour alone |
| Resident gallery | nursing home SCR-029 (WF-02 D-082) | card-buttons with Avatar + overdue/due/done Badges; own residents first; away dimmed; tap opens that resident's tasks |
