# 08 — Dual-runtime architecture: React + Hotwire from one design system

The clinic layer ships to **two runtimes at once** — the React SPA and Rails Hotwire
(ERB + Turbo + Stimulus) — the way the Things app already does. Files `01`–`07` assume
React only. This file covers the other half.

**Existing contract** (`AGENTS.md`): `/api/v1/*` → JSON · `/login /settings /tags
/projects/:id/edit` → Hotwire · everything else → SPA.

---

## 1. The problem, in the current code

`app/frontend/components/ui/input.tsx` and `app/views/settings/tags/index.html.erb` both
describe the same input. The ERB spells it out by hand:

```erb
class="h-10 flex-1 rounded-lg border border-things-border bg-white px-3 text-[14px]
       text-things-ink outline-none placeholder:text-things-gray focus:border-things-blue"
```

Two sources of truth, kept in sync by memory. At Things scale — three settings pages — that
is fine. At clinic scale it is not: 93 components × 2 runtimes, with severity colours and
density rules that **must** agree, because a lab value that reads amber in React and grey in
a printed ERB report is a safety bug, not a style bug.

The fix is not "use React everywhere" (you lose print, progressive enhancement, and the
Rails-native parts you already built) and not "duplicate carefully" (it decays). It is to
make the **class string itself a shared artifact**.

---

## 2. Three-layer contract

| Layer | What | Shared? | Mechanism |
|---|---|---|---|
| **A — Tokens** | `clinic-*`, `things-*` colour vars | ✅ already shared | `@theme` in `index.css`. Both runtimes emit the same utility names. **Solved — nothing to do.** |
| **B — Class contract** | The class string for each component part + variant | ⚠️ currently duplicated | Named component classes in `@layer components`. Both runtimes write `class="clinic-field"`. **This file's main proposal.** |
| **C — Behaviour** | State, events, async | ❌ genuinely different | React components vs Stimulus controllers. Share the *contract* (data attributes, ARIA, keyboard map), not the code. |

Layer B is the whole game. Get it right and the ERB and JSX renderings of a static
component become literally the same markup with different templating syntax.

### Layer B mechanism

The codebase already proves `@apply` works here — `index.css` `@layer base` uses it
(`* { @apply border-border outline-ring/50; }`). Extend the same idiom:

```css
@layer components {
  /* field */
  .clinic-field {
    @apply h-[var(--clinic-row-h)] w-full rounded-lg border border-things-border bg-white
           px-3 text-things-ink outline-none placeholder:text-things-gray
           focus:border-things-blue;
    font-size: var(--clinic-font);
  }
  /* dense grid cell */
  .clinic-cell        { @apply border-b border-clinic-grid-line px-[var(--clinic-row-px)] align-middle; }
  .clinic-cell-num    { @apply text-right; font-variant-numeric: tabular-nums; }
  .clinic-thead       { @apply sticky top-0 z-10 bg-clinic-grid-header; }
  .clinic-col-sticky  { @apply sticky left-0 z-20 bg-white; }
  /* severity */
  .clinic-tone-ok       { @apply text-clinic-ok; }
  .clinic-tone-warn     { @apply text-clinic-warn; }
  .clinic-tone-critical { @apply text-clinic-critical; }
  .clinic-row-ok        { @apply bg-clinic-ok-soft; }
  .clinic-row-warn      { @apply bg-clinic-warn-soft; }
  .clinic-row-critical  { @apply bg-clinic-critical-soft; }
  /* panels */
  .clinic-panel       { @apply rounded-lg border border-things-hairline bg-white; }
  .clinic-panel-head  { @apply flex items-center justify-between border-b border-things-hairline px-3 py-2 text-[13px] font-semibold tracking-tight text-things-title; }
  .clinic-paper       { @apply bg-clinic-paper text-clinic-paper-ink border border-clinic-paper-edge; }
}
```

React then consumes them exactly as ERB does:

```tsx
<td className={cn("clinic-cell", numeric && "clinic-cell-num", tone && `clinic-row-${tone}`)}>
```
```erb
<td class="clinic-cell <%= 'clinic-cell-num' if numeric %> <%= "clinic-row-#{tone}" if tone %>">
```

**Rule:** a class string that appears in both runtimes lives in `@layer components`. A class
string used by one runtime only stays inline. Do not pre-emptively extract everything —
extract on the second use.

> **Why not a Ruby helper that returns the same Tailwind string?** It works, but it puts
> the contract in `.rb` where Storybook can't see it and `verify:spec` can't diff it. A CSS
> class is visible to both runtimes *and* to the browser, which is what makes the parity
> check in §7 possible.

---

## 3. The partition — which of the 93 go where

The practical heart of this file. Every component lands in exactly one bucket.

### Bucket A — Static / presentational (≈33)
No client state. ERB partial and React component render the same markup from the same
Layer-B classes. **Build the ERB partial and the React component in the same commit.**

`PatientHeaderBar` `PatientName` `PatientAge` `PatientIdentityCard` `AllergyBanner`
`MetaGrid` `SectionHeader` `FormGrid` `StatusDot` `StatusLegend` `TriageDot` `TriageLegend`
`AbnormalFlag` `ValueWithUnit` `InlineMetricChip` `MetricTile` `ScheduleSummaryTable`
`TimelinePill` `CategoryLegend` `ClinicalSummaryColumn` `NoteHistoryLog` `AuditFooter`
`PaginationFooter` `StatusBar` `ChartTabNav` `TaskCountList` `AttachmentChip` `InboxTile`
`MessageListRow` `PaperSurface` `PrescriptionPreview` `SummaryOfCareTable` `DocumentTree`

Plus the **read-only** renderings of `ResultTable`, `ProblemTable`, `AllergyList`,
`MedicationList` — the print and portal paths need these server-rendered anyway.

### Bucket B — Hotwire-capable (≈22)
Interactivity a Stimulus controller plus a Turbo Frame handles cleanly. **Rails-first**;
add the React version when an SPA screen needs it.

| Component | Hotwire mechanism |
|---|---|
| `CollapsiblePanel` `PanelStack` `StepTabs` | `clinic-disclosure` Stimulus controller, `aria-expanded` |
| `ModuleRail` | Stimulus collapse + `localStorage` |
| `GroupedListPanel` | Turbo Frame per group, lazy `loading="lazy"` |
| **`QueueTable`** | **Turbo Stream broadcast** — see §5 |
| `MiniCalendar` | Turbo Frame, month nav is a plain link |
| `AppointmentCard` | Link + Stimulus context menu |
| `PatientPickerDialog` | Turbo Frame modal (`<dialog>` + Stimulus) |
| `ActionToolbar` `FormActionBar` `KeyHintButton` | Stimulus keyboard map |
| `LineItemTable` | `form_with` + nested attributes; add/remove rows via Turbo Stream |
| `CodePickerAccordion` `OrderSetButtons` | Disclosure + form submit |
| `ReconciliationList` `CareGapTable` | Server-rendered; radio inputs in one form |
| `MessageThread` `MessageComposer` `RecipientPicker` | Turbo Stream append — §5 |
| `DocumentViewer` `DocumentTree` | Frames; viewer toolbar is Stimulus |

### Bucket C — React-only islands (≈38)
Genuinely stateful, high-frequency, or canvas/SVG interaction. Rendering these in ERB would
mean reimplementing React badly. On a Hotwire page, mount them as islands (§4).

`AppShell` (resizable panes) · `DataTable` (generic, virtualised, sticky) · `FlowsheetGrid`
· `EventTimeline` · `EventDetailPopover` · `TimelineMinimap` · `TrendChart` ·
`MedicationTimeline` · `RangeToggle` · `ScheduleGrid` (drag/drop) · `CodedSearchInput`
(async typeahead) · `DrugSearchTree` · `SigBuilder` · `FindingsChecklistGroup` (All-Normal
cascade) · `ProcedureEntryCard` · `VitalsStrip` (live derived BMI/IBW) · `OrderEntryForm` ·
`ResultReport` (paged) · `TemplateSelect`+`GeneratedSummaryPanel` · `BodyMapAnnotator` ·
`AnatomyInspector` · `EMLevelMatrix` · `QueryBuilder` · `LabFishbone` · `CohortTimeline` ·
the Layer 8 dashboards.

**The test for Bucket C:** does it hold state that changes faster than a server round trip,
or is its layout computed in JS? If yes → React. If it is "render data, submit a form,
navigate" → Bucket B.

---

## 4. File layout and the naming rule

```
app/frontend/components/clinic/PatientHeaderBar.tsx        # React
app/frontend/components/clinic/PatientHeaderBar.stories.tsx
app/views/clinic/components/_patient_header_bar.html.erb   # ERB partial (Bucket A/B)
app/frontend/hotwire/controllers/clinic_disclosure_controller.ts
app/helpers/clinic_ui_helper.rb                            # ERB-side prop shaping only
```

**Mechanical mapping:** `PatientHeaderBar` ⇄ `_patient_header_bar.html.erb` ⇄ Stimulus
`clinic-patient-header-bar`. Because it is mechanical, a lint can assert completeness:

```bash
# every Bucket A/B React component has an ERB partial
comm -23 <(ls app/frontend/components/clinic/*.tsx | grep -v stories | xargs -n1 basename | sed 's/\.tsx//' | \
           sed -E 's/([a-z0-9])([A-Z])/\1_\2/g' | tr 'A-Z' 'a-z' | sort) \
         <(ls app/views/clinic/components/_*.html.erb | xargs -n1 basename | sed 's/^_//;s/\.html\.erb//' | sort)
```

ERB partials take **locals only**, never instance variables — that is what makes them
renderable from the styleguide route in §7.

---

## 5. Turbo Streams: the clinic domain fits unusually well

Worth calling out because it is a real advantage over the React-only plan, and neither
parent package noticed it.

Most clinic state changes are **server-originated**: a lab result arrives, a patient checks
in, a fax lands, another clinician signs a note. The React plan handles these by polling —
`QueueTable`'s `autoRefreshMs`, inherited from Thai VB6 product's manual **Refresh** button.

Turbo Streams invert that. The queue is broadcast on change:

```ruby
# app/models/visit.rb
after_update_commit { broadcast_replace_later_to "clinic:queue",
                        target: "queue-table",
                        partial: "clinic/components/queue_table" }
```

```erb
<%= turbo_stream_from "clinic:queue" %>
<div id="queue-table"><%= render "clinic/components/queue_table", rows: @rows %></div>
```

No polling, no stale queue, no Refresh button — and the same mechanism covers
`TaskCountList` counts, `InboxTile` unread badges, `MessageThread` appends, and new
`ResultTable` rows. This is the strongest argument for keeping a real Hotwire surface
rather than treating it as a fallback.

**Corollary for the React side:** define these as *push* endpoints from the start
(ActionCable or SSE) rather than polling, so both runtimes share one update model. Decide
this before `QueueTable` is built — retrofitting push into a polled component is the
expensive order.

---

## 6. i18n: two catalogs, one vocabulary — a real safety risk

React reads `app/frontend/i18n/{en,th,ja}.json` (i18next). Rails reads
`config/locales/*.yml`. The clinic layer needs the **same clinical labels in both** —
`BP`, `ผิดปกติ`, `Stop`, `ด่วน`, unit names, the `AbnormalFlag` legend.

Two independently-maintained catalogs will drift, and drift here is not cosmetic: an
abnormal flag rendered "High" in the SPA and "สูง" in the printed report is defensible;
one rendered "H" in the SPA and "L" in the report is a patient-safety incident.

**Proposal — one source, generated both ways.** Keep `clinic.*` keys canonical in the Rails
YAML (Rails owns print and email, where the legal record lives), and generate the i18next
JSON slice in a rake task wired into `bin/vite dev`:

```
config/locales/clinic.{en,th,ja}.yml     ← canonical, hand-edited
        ↓ rake clinic:i18n:sync
app/frontend/i18n/clinic.{en,th,ja}.json ← generated, git-tracked, never hand-edited
```

Add a `verify:spec` check that the generated files are up to date (regenerate to a temp
file, diff, fail if different) — the same shape as the existing token-mirror check. If you
prefer the opposite direction, that is fine; what is not fine is two hand-maintained copies.

The abbreviation rule from `02` §6.4 (`clinic.vitals.bp.abbr` identical in all three
locales, `.full` translated) applies to the canonical file.

---

## 7. Parity verification — reuse the verifier you already have

`tools/verify-spec.mjs` already drives **live Rails routes** in Playwright and asserts
computed styles against tokens. That infrastructure gives cross-runtime parity almost free.

**Step 1 — a styleguide route** (dev/test only), rendering every Bucket A/B partial in
every state, each wrapped with a stable id:

```ruby
# config/routes.rb
get "styleguide", to: "styleguide#index" unless Rails.env.production?
```
```erb
<%# app/views/styleguide/index.html.erb %>
<% StyleguideController::CASES.each do |id, partial, locals| %>
  <section data-sg-case="<%= id %>" data-density="<%= locals[:density] || 'compact' %>">
    <%= render "clinic/components/#{partial}", **locals %>
  </section>
<% end %>
```

Case ids match Storybook story ids — `clinic-allergy-banner--has-allergies` — so the two
renderings are addressable by the same key.

**Step 2 — assert the two renderings agree.** Add to `verify-spec.mjs`:

```js
// ——— 4. React ↔ ERB parity ———
const PARITY = [
  "clinic-allergy-banner--has-allergies",
  "clinic-allergy-banner--no-known-allergies",
  "clinic-patient-header-bar--default",
  "clinic-abnormal-flag--all-states",
  "clinic-metric-tile--default",
  "clinic-status-dot--all-states",
]
const probe = (sel) => `(() => {
  const el = document.querySelector('${sel}');
  if (!el) return null;
  const pick = (n) => { const s = getComputedStyle(n);
    return [s.color, s.backgroundColor, s.fontSize, s.fontWeight, s.borderColor].join('|') };
  return [...el.querySelectorAll('*')].slice(0, 40).map(pick).join(' ~ ')
})()`

for (const id of PARITY) {
  await page.goto(`${SB}/iframe.html?id=${id}&viewMode=story`, { waitUntil: "networkidle" })
  const react = await page.evaluate(probe("#storybook-root"))
  await page.goto(`${APP}/styleguide`, { waitUntil: "networkidle" })
  const erb = await page.evaluate(probe(`[data-sg-case="${id}"]`))
  check(`parity: ${id}`, react && erb && react === erb,
        `React and ERB renderings differ\n  react: ${react}\n  erb:   ${erb}`)
}
```

That is an automated guarantee that the two runtimes render the design system identically —
the thing hand-duplication cannot give you. It needs no new dependency and no new tool.

**Step 3 — contrast check** (no browser, runs beside the token mirror; catches the defect
found in [`00-corrections.md`](00-corrections.md) §5):

```js
const rel = (hex) => { const v = hex.replace('#','').match(/../g)
  .map(h => { const c = parseInt(h,16)/255
    return c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055) ** 2.4 })
  return 0.2126*v[0] + 0.7152*v[1] + 0.0722*v[2] }
const ratio = (a,b) => { const [x,y] = [rel(a),rel(b)].sort((m,n)=>n-m)
  return (x + 0.05) / (y + 0.05) }
for (const [fg, bg, label] of [
  ["clinic-ok","clinic-ok-soft","ok"], ["clinic-warn","clinic-warn-soft","warn"],
  ["clinic-critical","clinic-critical-soft","critical"],
]) {
  const r = ratio(cssTokens[fg], cssTokens[bg])
  check(`contrast: ${label} text on its soft surface ≥ 4.5:1`, r >= 4.5, `${r.toFixed(2)}:1`)
}
```

---

## 8. Print belongs to Rails

`PaperSurface`, `PrescriptionPreview`, `SummaryOfCareTable`, `ResultReport` and the letter
and fax views all exist to be **printed**. Server-rendered HTML prints reliably; a React
island inside a print stylesheet is a recurring source of blank pages and clipped tables.

Build the paper family **Rails-first**, as ERB partials with a dedicated `print.css`, and
give the SPA a link out to the Rails route rather than a React reimplementation. This also
puts the legal record — the thing that gets signed and filed — on the server side where the
audit trail already lives.

Concretely: add `/clinic/patients/:id/rx/:rx_id.pdf`-shaped routes to the Hotwire half of
the routing contract in `AGENTS.md`.

---

## 9. ViewComponent — your call, with the built-in alternative named

Bucket A/B partials with many variants (`AllergyBanner`'s three states, `StatusDot`'s seven
tones) get awkward as ERB partials with `if` ladders.

**Recommendation: start with plain partials + locals.** Zero new dependencies (the repo's
standing default), matches the existing `settings/shared/_shell.html.erb` idiom, and the
styleguide route in §7 already gives you previews. Revisit only if variant logic in ERB
actually becomes painful.

**The alternative, stated honestly:** `view_component` + `lookbook` gives typed slots,
variant methods, unit-testable components, and a Lookbook preview UI that is the ERB mirror
of Storybook. For a 93-component design system across two runtimes that is a real fit — it
is the Rails-native answer to exactly this problem.

| | Partials (recommended start) | ViewComponent + Lookbook |
|---|---|---|
| New dependencies | 0 | 2 gems |
| Variant logic | `if`/`case` in ERB | Ruby methods, testable |
| Previews | the §7 styleguide route | Lookbook UI, richer |
| Unit tests | render-partial specs | first-class |
| Migration cost later | partial → component is mechanical | — |

This is an architectural decision with lasting consequences, so it is yours to make, not
mine to assume. The §7 parity check works identically either way, so the decision can be
deferred until Bucket A is a dozen components deep and you can feel the pain or not.

---

## 10. Amended build order

Replace the phase plan in `06` with this. The change: **each phase ships both runtimes plus
the parity story together** — never React-then-Rails-later, which is how the two drift.

| Phase | Adds | Done when |
|---|---|---|
| **0** Foundations | `verify-spec` regex fix · corrected severity hexes (`00` §5) · 14 tokens in both files · density + `.clinic-num` · **Layer-B `@layer components` block** · `clinic/types.ts` · `clinic/tokens.ts` · styleguide route skeleton · contrast check | `verify:spec --skip-storybook` green incl. mirror + contrast |
| **1** Static primitives | Bucket A atoms: `StatusDot` `TriageDot` `AbnormalFlag` `ValueWithUnit` `MetaGrid` `SectionHeader` `FormGrid` — **React + ERB + parity case each** | §7 parity check green for all seven |
| **2** Identity & safety | `PatientName` `PatientAge` `PatientHeaderBar` `AllergyBanner` `PatientIdentityCard` — both runtimes. `AppShell` React-only | 3 `AllergyBanner` states pass parity; `Monochrome` stories pass |
| **3** Reception screen | `QueueTable` **with Turbo Stream broadcast**, `TriageLegend`, `AppointmentCard`, `MiniCalendar`, `GroupedListPanel`, `CodedSearchInput` (React island) | Blueprint 1 works as a Hotwire page with a React island, in Thai, at 390px |
| **4** Clinical core | Bucket C workhorses (`DataTable` `FlowsheetGrid` `ResultTable` `TrendChart` `OrderEntryForm` `FindingsChecklistGroup` …) + Bucket A read-only ERB renderings for print | Exam-room blueprint end to end; print path renders from Rails |
| **5** On demand | Messaging, documents, billing, portal, Layer 8/9 | — |

**Phase 1 is the one that matters.** Seven trivial components built in both runtimes with a
green parity check proves the whole architecture before anything expensive is built on it.
If parity is painful at seven components, you want to know then — not at ninety-three.
