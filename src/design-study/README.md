# Design study — one clinic scenario, three design languages

> **Status (2026-10-01): parked.** Decision: keep the original design (A).
> This branch stays as-is for future studies; it is not intended to merge.
> Known issue left open: in C (Windows 11) the orders page's medication
> *Decision* column is too narrow at 1440px, so the "Stop" segment clips.

Branch `feature/design-study-three-themes`. Storybook → **Design Study / Clinic
Visit Scenario**. This is a study, not part of the catalog: nothing in
`src/components` imports it, and no existing component was modified.

| Story | What it is |
|---|---|
| **A · Current design** | Today's system. It uses only existing components: `AppShell`, `LauncherRail` (sections mode), `DataTable`, `FormSection`, `CodedSearchInput`, `FormActionBar`, `StepTabs`, `AllergyBanner`, `PatientHeaderBar`, `QueueTable`, `StatusBar`. No new styling. |
| **B · macOS 27** (+ dark) | Proposal. Same `AppShell` + `LauncherRail`, re-skinned through tokens. The pages are composed by hand from `primitives.tsx`. |
| **C · Windows 11** (+ dark) | Proposal. Same shell, Fluent 2 language. |
| **Compare A / B / C** | One scenario state; switch language mid-flow. Filters, the open patient, the draft and pending orders all survive the switch. |

The `page` control (registry / visit / orders) opens any story directly on a page.

## The scenario: three linked pages, data and forms

1. **Patient registry** (data-heavy). 188 deterministic patients (seeded PRNG, fixed
   dates, PHI-free; EN/TH/JA names). It has:
   - lists with live counts, text search (name, MRN or phone), and scheme and provider filters;
   - 8 sortable columns, multi-select with bulk actions, and 20-row pages;
   - a stats strip, and an inspector showing the selected patient.
2. **Visit & assessment** (form). Eight vitals, checked for plausibility and flagged
   abnormal with a **glyph as well as colour**. Also: a derived BMI, the chief
   complaint, triage, follow-up, ICD-10 coded search with a primary diagnosis, a
   clinical note, dirty and saved states, and errors that block continuing.
3. **Orders & prescription** (form + data). Current-medication reconciliation
   (continue / hold / stop), and a new-prescription form with drug search, dose,
   frequency, duration, route, and calculated quantity and cost. An **allergy
   check** runs against each drug:
   - penicillin → amoxicillin is a hard stop that needs an override reason;
   - penicillin → cephalexin is a warning that needs an acknowledgement.

   A pending-orders table with totals leads to **Sign & send**, which shows a
   confirmation naming the consequence, then returns to the registry with the
   patient marked *Completed*.

The pages link through the LauncherRail sections, the step navigation, row open
(double-click / Enter / name link), the queue in the context pane, and the
primary actions. Walk the featured patient นาย วรวุฒิ ศิริธรรม (penicillin
allergy) through all three pages.

The rules live in `scenario.tsx` (navigation, validation, allergy check,
registry query), so all three variants behave identically. Only the rendering
differs.

## How B and C keep the shell

`study.css` sets `data-study` / `data-mode` / `data-glass` / `data-borders` on
`<html>`. It points the existing `--color-things-*`, `--color-clinic-*` and
shadcn variables at a per-language palette. `AppShell` and `LauncherRail` render
**unmodified** and take on the new language, including dark mode and the
portaled waffle flyout. The rail is re-skinned only through its existing hooks
(`data-slot`, `data-rail-item`, `aria-current`). That is the main evidence for
the migration path: **the design language can change at the token layer.**

## Where each choice comes from

| | macOS 27 (B) | Windows 11 / Fluent 2 (C) |
|---|---|---|
| Corner radius | controls 6 · groups 8 · overlays 10 · grids 0 | controls 4 · cards 4 · flyouts/dialogs 8 · 0 where straight edges meet (Microsoft *Geometry*) |
| Material | Liquid Glass on the rail, toolbar and action bar only, with a **Clear / Medium / Tinted** slider (macOS 27 Appearance). Darker edge plus a 1px highlight. | Mica approximation for the window base, Acrylic for flyouts only (Microsoft *Materials*), content on a layer with one 8px corner |
| Chrome | Sidebar material runs to the window edge; one unified glass toolbar per workspace (title + subtitle) | App title bar with global search; 20/28 page title; command bar |
| Forms | Grouped rows: label left, hairlines between rows | Cards, labels above inputs, 2px accent underline on focus |
| Tables | 26px rows, zebra, accent-filled selection | 32px rows, hover fill, selection pill |
| Type | system stack (SF Pro) 13px | Segoe UI Variable ramp 12/14/20/28 (needs Windows; elsewhere falls back to the system font) |
| Accessibility | "Show borders" setting; `prefers-reduced-transparency` → opaque | "Contrast strokes"; Fluent double-stroke focus |
| Dialog | Alert sheet, stacked buttons, safe button focused | ContentDialog over smoke, button strip footer |

The **severity colours are identical across languages** in light mode, and
retuned only for dark mode. Severity is clinical meaning, not brand, so it must
not change with the theme. All of spec 02 §4 still holds in B and C:
- the allergy strip is pinned, never dismissible and never animated;
- every severity signal carries a glyph;
- flow status uses accent/neutral colours, never severity colours;
- destructive actions are confirmed with the specific consequence named.

## Measured (1280×800, registry, default pane sizes, same 643px workspace)

| | A current | B macOS 27 | C Windows 11 |
|---|---|---|---|
| Rows visible without scrolling | 16 | **20** | 14 |
| Row height | 30px | 26px | 32px |
| Chrome above the first row | 279px | **207px** | 275px |
| Largest corner radius in use | 10px | 10px | 10px |

C uses Fluent's *standard* density. Fluent also defines a compact density
(24px controls), which would be the fair setting for clinical data. It isn't
implemented here.

## What to judge

1. Scan speed on the registry: find a waiting patient with an allergy and an
   outstanding balance.
2. Form completion on the visit page: Tab order, error discovery, and whether the
   abnormal vitals stand out.
3. Safety on the orders page: is the amoxicillin stop unmistakable, and does the
   override feel deliberate?
4. Chrome cost: how much of the screen goes to the app versus the data at 1280 and 1440?
5. Dark mode and glass levels: are text and tables still readable over Clear glass?

## If a direction is adopted

Move the chosen `--st-*` palette into `theme.css` + `design-tokens.json` as
light/dark token pairs (the verifier enforces the mirror). Promote the
primitives through the catalog process. Then delete this folder. The study
files are prototype code: hardcoded English strings, no i18n keys.
