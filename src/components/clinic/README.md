# Medical — the clinic component library

Ninety-six React components for clinic software, living in
`app/frontend/components/clinic/` and browsable in Storybook under **Medical**.
This README is for the developer about to build a clinic screen with them: what
the pieces are, how they fit, and the traps.

## The mental model

Four layers, each only knows the layers beneath it:

```
Medical Shell      frames: AppShell, rails, panels, PaperSurface, blueprints
Medical Component  organisms: queues, schedules, results, orders, documents…
Medical UI         atoms: formatters, flags, dots, pills, form kit, DataTable
UI (shadcn)        buttons, dialogs, selects, tooltips — the base primitives
                   under everything (vendored in components/ui/, documented upstream)
```

A component never reaches *upward*. `QueueTable` composes `DataTable`,
`TriageDot` and `PatientName`; it does not know `AppShell` exists. That's why
the organisms work in a dialog, a panel, or a phone-sized canvas.

The three **blueprints** (Day Board, Exam Room, Reception) are ready-made
screens built from catalog parts — read them as recipes for wiring, not as
components to import.

## The five rules

Every component here follows these, and code review will ask about them:

1. **Severity means severity.** `clinic-ok / clinic-warn / clinic-critical`
   (and their `-soft` surfaces) encode *clinical judgment* — lab flags, triage,
   allergies, unmet measures. Everything else — flow states, categories,
   navigation — uses `things-*` tokens. A red timeline lane is a bug even if it
   looks nice.
2. **Color never works alone.** Every severity signal carries a glyph, letter
   or shape (`H`/`HH`, ✓/✕/⚠, circle/square/triangle). Check the Monochrome
   stories: if the meaning dies in grayscale, the component is wrong.
3. **Patient identity is never bare.** MRN and DOB render in every density,
   every locale, every compact mode. Duplicate patient names are the *normal*
   case — see `patientCorpus` in the fixtures.
4. **Names, ages and dates are formatted, never concatenated.**
   `PatientName` takes structured `parts` (Thai: title given family; Japanese:
   family given). `PatientAge` recomputes from DOB with pediatric month
   precision. Hand-joined strings can't be localized later.
5. **Numbers wear tabular figures.** Anything countable gets the `clinic-num`
   class so digits align in columns and compare downward.

## Using a component

```tsx
import { QueueTable } from "@/components/clinic/QueueTable"
import { fixtureQueue } from "@/fixtures/clinic"

// density comes from any ancestor — AppShell sets it; in your own
// screens wrap the surface yourself (comfortable | compact | dense)
<div data-density="compact">
  <QueueTable rows={queueRows} onOpen={(id) => ...} />
</div>
```

- **Controlled or uncontrolled, your choice.** Most interactive components
  accept either a `value` + `onChange` pair or a sensible internal default
  (`defaultPinnedIds`, `defaultOpen`…). Go controlled the moment state matters
  outside the component.
- **All user-visible strings go through i18n** (`clinic.*` keys in
  `app/frontend/i18n/{en,th,ja}.json`). Fixtures carry English labels; UI
  chrome strings never do.
- **Fixtures are deterministic and PHI-free** (`fixtures/clinic.ts`) — fixed
  ISO dates, no `Date.now()`, no randomness. Reuse them in your stories and
  tests instead of inventing patients.

## Choosing a component

| You need… | Reach for |
|---|---|
| A dense table with sticky headers | `DataTable` (don't write a `<table>`) |
| Identity that never scrolls away | `PatientHeaderBar` over any chart screen |
| A longitudinal view of anything | `EventTimeline` (+ `TimelineMinimap` for the brush) |
| Numbers over time | `TrendChart`; one glance number → `MetricTile` |
| A printable document | `PaperSurface`, then build on the paper tokens |
| A form | `FormGrid` + `FormActionBar`, inputs from `FormRow` |
| Anything with a code (ICD/CPT/LOINC) | `CodedSearchInput` (type) or `CodePickerAccordion` (browse) |
| Messages of any flavor | `MessageThread` / `MessageList` / `MessageComposer` / `RecipientPicker` |
| An inbox-style module tile | `InboxTile` |
| A screen, not a component | the blueprints under **Medical Shell** |

## Things that bite

Hard-won, each one shipped a bug before it became a rule:

- **`min-w-0` everywhere a table meets flex/grid.** Flex/grid children default
  to `min-width: auto` and your scrollable table will refuse to shrink instead.
- **Grid/flex items with `col-span` wider than the grid mint implicit
  columns** sized by content — the phone-width overflow bug class. See
  `MetaGrid`'s span logic for the fix pattern.
- **Percent sizes in `react-resizable-panels` are strings** (`"22%"`); a bare
  number is *pixels*, silently.
- **Dialog centering:** shadcn's default `left-50% translate` caps shrink-to-fit
  at half the viewport. Wide dialogs (patient picker) use
  `inset-x-0 mx-auto translate-x-0` instead.
- **Tailwind's JIT can't see classes built from template strings.** Color/size
  variants live in static `Record` maps (`CATEGORY_COLORS`, `SOFT`, `BAR`…).
  Never `bg-${color}-500`.
- **`bg-card`, not `bg-white`** — same color today, but `card` survives the
  dark-mode plan; the verifier blocks `bg-white`.
- **Sticky ≠ fixed.** `FormActionBar` needs a scrollable ancestor; a `fixed`
  bar escapes its panel and overlaps the shell.
- **localStorage layout keys get bumped** (`-v2`) when defaults change, or
  users inherit haunted geometry.

## Where the truth lives

- **Spec & adjudications:** `docs/spec/` — `03-design-tokens.md` (the
  palette contract), `04-component-catalog.md` (what each component is for),
  `00-corrections.md` (why it's this way).
- **Tokens in code:** `components/clinic/tokens.ts` — the category map, tone
  utilities, and the style-scale conventions comment (surfaces, radii, type
  ramp, icon tiers). Read it before inventing a class.
- **Verification:** `tools/verify-spec.mjs` — ~300 structural checks run
  against the live app and every Storybook story: token resolution, non-colour
  channels, sticky geometry, tabular numerals, density ceilings, Thai minimums,
  mobile degradation, drag interactions, print states. If you change behavior
  a check encodes, change the check in the same commit.

## Conventions card

Surfaces `bg-card` · containers `rounded-md border border-things-hairline` ·
rows/buttons `rounded-sm` · pills/badges `rounded-full` · swatches
`size-2.5 rounded-[2px]` · type ramp `10/11px micro → xs meta → sm body →
base emphasis` (`text-[13px]` reserved for paper documents) · icons `3.5`
inline / `4` rows / `6` feature · row padding `px-3 py-2` · panel `p-3` ·
canvas `p-4`.
