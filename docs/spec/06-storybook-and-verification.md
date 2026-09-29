# 06 — Storybook, verification & build order

---

## 1. Storybook conventions

Match the existing `components/things/*.stories.tsx` shape exactly — see
`TaskRow.stories.tsx` for the canonical example.

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueueTable } from "@/components/clinic/QueueTable"
import { fixtureQueue } from "@/fixtures/clinic"

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

const meta: Meta<typeof QueueTable> = {
  title: "Clinic/Queue Table",
  component: QueueTable,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div data-density="compact" className="font-sans">
            <Story />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    ),
  ],
}
export default meta
```

Rules:

- **Title root is `Clinic/`.** `Things/` stays for the task app, `UI/` for the
  vendored primitives, `Design System/` for tokens.
- **Every story wrapper carries `data-density`** — a clinic component rendered
  without one inherits nothing and silently uses fallback spacing.
- **Fixtures go in `app/frontend/fixtures/clinic.ts`** — see
  [07-fixtures-and-i18n.md](07-fixtures-and-i18n.md). No PHI, no randomness.
- Responsive stories: render inside a fixed-width container (`max-w-[390px]`
  story named `… / Mobile`) rather than relying on viewport add-ons, so the
  mobile variant is visible in the same sidebar.

### Required stories per component

Every component needs these, minimum:

| Story | Why |
|---|---|
| `Default` | The happy path |
| `AllStates` | Every variant in one frame — this is what a reviewer reads |
| `Empty` | The zero case. Clinic screens hit empty constantly (no allergies, no results) |
| `Loading` | Static muted state, not a shimmer (design direction §8) |
| `Dense` | Wrapper at `data-density="dense"` — catches clipping early |
| `Thai` / `Japanese` | Wrapper with `lang`, i18n switched. **Mandatory** for anything rendering names, dates, ages or clinical labels |

Plus, per component class:

| Class | Extra stories |
|---|---|
| Severity-bearing (`AbnormalFlag`, `AllergyBanner`, `CareGapTable`, `ReconciliationList`) | `Normal`, `Abnormal`, `Critical`, and **`Monochrome`** — rendered with `filter: grayscale(1)` to prove the non-colour channel works (02 §4.1) |
| `AllergyBanner` specifically | All three states as named stories — `HasAllergies`, `NoKnownAllergies`, `NotRecorded`. A safety requirement, visible in the spec |
| Scroll-locked (`DataTable`, `FlowsheetGrid`, `ResultTable`, `EventTimeline`, `MedicationTimeline`) | `Narrow` at 390px proving sticky first column + sticky header hold |
| Breakpoint-swap (`AppShell`, `ScheduleGrid`, `DocumentViewer`, `PatientPickerDialog`) | One story per breakpoint: `Desktop`, `Tablet`, `Mobile` |
| Form (`OrderEntryForm`, `FindingsChecklistGroup`, `VitalsStrip`, `FormGrid`) | `Invalid`, `Saving`, `ReadOnly` |
| Chat family (`MessageThread`, `MessageComposer`) | `MixedStream` (chat + quote block + system marker + unread divider), `Thai`, long-message wrapping, attachment chips of both kinds |

---

## 2. `verify:spec` extensions

`tools/verify-spec.mjs` is where component invariants become enforceable. Add
checks for anything with a **measurable** rule — colour, size, shape,
stickiness. Follow the existing `check(name, ok, detail)` pattern.

### Token mirror

Covered by the regex fix in
[03-design-tokens.md §1](03-design-tokens.md) — **land it in the same commit as
the 14 tokens** or the mirror check fails. Verify with
`npm run verify:spec -- --skip-storybook` before anything else.

### New Storybook smoke entries

Append to the `STORIES` array (`tools/verify-spec.mjs:264`). Story IDs are the
kebab-cased title + story name:

```js
["clinic-patient-header-bar--all-states",  "Clinic/Patient Header Bar"],
["clinic-allergy-banner--no-known-allergies", "Clinic/Allergy Banner"],
["clinic-triage-dot--all-states",          "Clinic/Triage Dot"],
["clinic-queue-table--default",            "Clinic/Queue Table"],
["clinic-data-table--narrow",              "Clinic/Data Table"],
["clinic-flowsheet-grid--narrow",          "Clinic/Flowsheet Grid"],
["clinic-event-timeline--narrow",          "Clinic/Event Timeline"],
["clinic-appointment-card--all-states",    "Clinic/Appointment Card"],
["clinic-message-thread--mixed-stream",    "Clinic/Message Thread"],
["clinic-app-shell--mobile",               "Clinic/App Shell"],
```

### New structural checks

Write these against the Storybook iframe rather than a Rails route, so they run
before the clinic routes exist:

| Check | Assertion |
|---|---|
| `clinic: severity tokens resolve` | `getComputedStyle` on a rendered `AbnormalFlag` returns exactly `clinic-critical` / `clinic-warn` / `clinic-ok` |
| `clinic: allergy banner is not dismissible` | The `AllergyBanner` story root contains **no** element matching `[aria-label*="close" i]` or a cancel button |
| `clinic: no-known-allergy is not red` | In the `NoKnownAllergies` story, no descendant's `color`/`backgroundColor` equals `clinic-critical` or `clinic-critical-soft` |
| `clinic: severity has a second channel` | Each `AbnormalFlag` state renders a distinct `textContent` (`N`/`H`/`L`/`HH`) or a distinct `<svg>` — not colour alone |
| `clinic: numerics are tabular` | Every `[data-numeric]` cell in `ResultTable` has `fontVariantNumeric` containing `tabular-nums` |
| `clinic: sticky first column` | In the `Narrow` story of `FlowsheetGrid`, the first column's `position` is `sticky` and `left` is `0px` |
| `clinic: sticky header` | Same story, header row `position: sticky`, `top: 0px` |
| `clinic: dense rows fit` | At `data-density="dense"`, a row's `getBoundingClientRect().height` ≤ 28px and text is not clipped (`scrollHeight <= clientHeight`) |
| `clinic: Thai dense rows do not clip` | Same with `lang="th"` — row height ≥ 28px and `scrollHeight <= clientHeight`. This proves the `:lang(th)` override from 03 §4 |
| `clinic: units accompany values` | Every `ValueWithUnit` in the `ResultTable` story renders a non-empty unit element |
| `clinic: no hardcoded hex` | Static: `readFileSync` + regex pass over `components/clinic/**/*.tsx` for `#[0-9a-fA-F]{6}` in a `className` — fail. Enforces the AGENTS.md hard rule mechanically; needs no browser |

### TypeScript

`npx tsc --noEmit -p tsconfig.json` must pass. Two conventions that keep it
painless:

- Export shared `type Tone = "none" | "ok" | "warn" | "critical"` and
  `type Density = "comfortable" | "compact" | "dense"` from
  `app/frontend/components/clinic/types.ts`; plus the lane/category token map
  from `tokens.ts`. A dozen components reference them.
- `DataTable` is generic (`DataTableProps<T>`). Get the generic right on day
  one; retrofitting it across eleven dependents is the expensive version.

---

## 3. Build order

Five phases. Each ends green: `npx tsc --noEmit` + `npm run verify:spec`.

The former prerequisite — vendoring the full shadcn library — is **already
done** (commit `8e1b9f8`: 61 primitives with stories, including the chat
family). Verify with `ls app/frontend/components/ui/*.tsx | wc -l` (expect ~59
component files) before starting.

### Phase 0 — foundations (½ day)
1. Fix the `verify-spec.mjs` regex (03 §1).
2. Add the 14 tokens to `index.css` **and** `design-tokens.json`.
3. Add the density blocks + `.clinic-num` to `@layer base`.
4. Create `components/clinic/types.ts`, `tokens.ts` (category map),
   `table-recipes.ts`, `icons.tsx` (clinical glyphs), `fixtures/clinic.ts`.
5. Add `Clinic/Introduction` and extend the token story to render the new
   swatch groups.

**Gate:** `npm run verify:spec -- --skip-storybook` green, with the 14 new
mirror checks passing.

### Phase 1 — P0 primitives (1 week)
`DataTable` first — everything downstream depends on its generic and its sticky
behaviour. Then `CollapsiblePanel`, `SectionHeader`, `MetaGrid`, `FormGrid`,
`ActionToolbar`, `FormActionBar` pattern (inside `ActionToolbar` phase),
`ValueWithUnit`, `AbnormalFlag`, `StatusDot`/`StatusLegend`.

**Gate:** `DataTable` `Narrow` story proves sticky column + header at 390px.

### Phase 2 — patient identity & shell (1 week)
`PatientName`, `PatientAge`, `PatientHeaderBar`, `AllergyBanner`,
`PatientIdentityCard`, `PatientSearchCombobox`, `PatientPickerDialog`,
`AppShell`, `ModuleRail`, `ChartTabNav`, `StatusBar`.

**Gate:** all three `AllergyBanner` states as named stories; the `Monochrome`
story for every severity component; `AppShell` at all three breakpoints.

### Phase 3 — first real screen: reception (1 week)
`QueueTable`, `AppointmentCard`, `MiniCalendar`, `GroupedListPanel`,
`PaginationFooter`, `CodedSearchInput`, `KeyHintButton`, `TaskCountList`,
`StepTabs` → assemble
[blueprint 1](05-screen-blueprints.md#1-front-desk--registration--queue).

Shipping one complete screen here, rather than more components, is deliberate:
it surfaces the integration problems (density inheritance, sticky stacking,
i18n date format) while they are still cheap.

### Phase 4 — the clinical core + messaging (2–3 weeks)
`VitalsStrip`, `VitalsList`, `MetricTile`, `ResultTable`, `FlowsheetGrid`,
`TrendChart`, `RangeToggle`, `MedicationTimeline`, `EventTimeline`,
`CategoryLegend`, `EventDetailPopover`, `ProblemTable`, `AllergyList`,
`MedicationList`, `CareGapTable`, `ProcedureEntryCard`, `NestedPanel`,
`InlineMetricChip`, `FindingsChecklistGroup`, `DrugSearchTree`,
`OrderEntryForm`, `SigBuilder`, `LineItemTable`, `OrderSetButtons`,
`ClinicalSummaryColumn` — and the **messaging family**: `AttachmentChip`,
`RecipientPicker`, `MessageThread`, `MessageComposer`, then `InboxTile`,
`MessageListRow`, `PaperSurface`, `DocumentViewer` → blueprints 3, 4, 5, 8.

**Gate:** the exam-room blueprint works end to end in Thai at 390px and at
1440px; the mixed-stream `MessageThread` story renders chat + quote + system
entries in one scroll.

### Phase 5 — everything else, on demand
Billing (`CodePickerAccordion`, `ReconciliationList`, `NoteHistoryLog`,
`AuditFooter`, `ScheduleSummaryTable`, `ResourceFilterList`, `TriageDot`),
documents (`SummaryOfCareTable`, `DocumentTree`, `PrescriptionPreview`,
`ResultReport`, `TimelinePill`), portal, and the Layer 8/9 specialists — each
pulled forward only when its blueprint is scheduled. Do not batch-build P3.

---

## 4. AGENTS.md amendment (paste verbatim, same commit as the first clinic component)

Under "Layout map", after the `components/things/` line:

```
  components/clinic/   # clinic app components (composed from ui/* + things/clinic tokens)
```

And under "What this project is", the existing cross-app note already covers
the rationale; no further change needed.

---

## 5. Definition of done, per component

- [ ] Lives in `app/frontend/components/clinic/<Name>.tsx`, plain name, named export
- [ ] Colocated `<Name>.stories.tsx`, title `Clinic/<Name>`, with the six required stories
- [ ] Zero hex literals; every colour is a `things-*` or `clinic-*` utility
- [ ] `components/ui/*` untouched
- [ ] `npx tsc --noEmit` passes
- [ ] Every user-visible string in `i18n/{en,th,ja}.json` — all three, same change
- [ ] Keyboard reachable; focus visible; interactive elements have accessible names
- [ ] Severity carries a non-colour channel, proven by a `Monochrome` story
- [ ] Renders correctly at `data-density` comfortable / compact / dense
- [ ] The responsive verdict from the catalog is implemented *and* has a story proving it
- [ ] `npm run verify:spec` green
- [ ] Catalog entry in `04-component-catalog.md` updated if the API drifted
