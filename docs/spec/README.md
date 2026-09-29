# Clinic UI — merged component specification

**Status: specification only, ready to implement. No code in this package.**

This package merges the two competing handoffs — `glm-clinic-ui/` and
`claude-clinic-ui/` — rebuilt from the ground up. Provenance is marked where a
decision came from one side, and every factual dispute between the two sources
was **adjudicated against the actual screenshots** (see
[01-source-analysis.md](01-source-analysis.md) — the queue legend, the lab-order
row, and the prescription buttons were re-read pixel by pixel).

**Sources merged:**

| Inherits from | What it contributes |
|---|---|
| `glm-clinic-ui` | Adjudicated source analysis · the ChatUI messaging family as P0 · per-component story checklists · fixtures & determinism rules · breadth of the P2/P3 pattern census (report frame, alert ticker, timeline matrix, cohort view) |
| `claude-clinic-ui` | Design direction (density system, clinical-safety rules, responsive taxonomy) · the 14 `clinic-*` tokens + the `verify:spec` regex fix (verified real) · screen blueprints · formatter components (`PatientName`, `PatientAge`, `ValueWithUnit`, `AbnormalFlag`) · generic `DataTable` · story matrix & structural verifier checks · order-set buttons |

## Read in this order

| # | File | What it gives you |
|---|---|---|
| 0 | [00-corrections.md](00-corrections.md) | ⚠️ **Read first.** Post-merge review against the screenshots and the live repo. Two corrections that change P0 components: the queue legend is **urgency (ปกติ/รีบ/ด่วน)**, not processing status; and two of the three severity colours **fail WCAG AA** — corrected hexes included. Also lists the merge decisions that improve on both parents |
| 1 | [01-source-analysis.md](01-source-analysis.md) | Every screenshot: product, screen, patterns — with the adjudicated Thai readings |
| 2 | [02-design-direction.md](02-design-direction.md) | Density system, clinical-safety rules, responsive policy, trilingual constraints |
| 3 | [03-design-tokens.md](03-design-tokens.md) | The exact `@theme` + `design-tokens.json` patch, **and the `verify:spec` fix that must land in the same commit** |
| 4 | [04-component-catalog.md](04-component-catalog.md) | **The deliverable.** 93 components in 9 layers, names, props, states, responsive verdicts |
| 5 | [05-screen-blueprints.md](05-screen-blueprints.md) | The 9 real clinic screens as compositions of the catalog |
| 6 | [06-storybook-and-verification.md](06-storybook-and-verification.md) | Story matrix, `verify:spec` extensions, 5-phase build order, AGENTS.md amendment |
| 7 | [07-fixtures-and-i18n.md](07-fixtures-and-i18n.md) | Deterministic demo data (EN/TH/JA), the no-PHI rule, locale key plan |
| 8 | [08-dual-runtime-architecture.md](08-dual-runtime-architecture.md) | **React + Rails Hotwire from one design system.** The shared class contract, the 93-component partition into static / Hotwire-capable / React-island, Turbo Streams for the queue, automated React↔ERB parity checking, i18n across two catalogs, and the amended build order |

## The short version

**Namespace.** New components live in `app/frontend/components/clinic/` — plain
names, no prefix (`PatientHeaderBar`, not `ClinicPatientHeaderBar`), one file
plus a colocated `*.stories.tsx` each. Storybook titles root at `Clinic/`.
Tokens use the `clinic-*` prefix. `components/ui/*` is vendored shadcn and is
never edited.

**Two runtimes, one design system.** The clinic layer ships to the React SPA **and** Rails
Hotwire simultaneously, as the Things app does. Files `01`–`07` describe React only;
[08-dual-runtime-architecture.md](08-dual-runtime-architecture.md) covers the other half —
a shared class contract in `@layer components` so ERB and JSX emit identical markup, a
partition of all 93 components into *static* (both runtimes) / *Hotwire-capable* /
*React-island*, and a parity check that asserts the two renderings compute to the same
styles. Build both runtimes in the same phase; do not defer Rails.

**Prerequisite — already satisfied.** The full shadcn registry (61 primitives,
including the chat family `message` / `message-scroller` / `bubble` /
`attachment` / `item` / `marker`) was vendored in commit `8e1b9f8`. Both parent
packages were written against different inventories; as of that commit, every
primitive cited in this package exists. Verify with
`ls app/frontend/components/ui/*.tsx | wc -l` if in doubt.

**Token strategy.** 14 new `clinic-*` tokens only: a contrast-checked severity
trio (+ soft variants), five dense-data surface tokens, three printable-paper
tokens. Everything else reuses the existing `things-*` palette — the eight
category colors cover every timeline lane, event chip and chart series in the
sources. **The `tools/verify-spec.mjs` regex must be widened in the same
commit** or the mirror check fails (§1 of [03-design-tokens.md](03-design-tokens.md)).

**Component count.** 93 catalogued across 9 layers:

| Tier | Count | Meaning |
|---|---|---|
| **P0** | 25 | Nothing works without these. Shell, patient identity, safety, queue, `DataTable`, timeline, entry primitives, **messaging family** |
| **P1** | 34 | The clinical workhorses. Flowsheet, results, orders, findings, schedule, document viewer |
| **P2** | 20 | High-value but composable, or specialist-adjacent. Billing, documents, reconciliation, step tabs |
| **P3** | 14 | Specialist / deferred. Body maps, query builder, operations dashboards, cohort view |

**Messaging is P0, deliberately.** The project brief names the shadcn chat
family ("ChatUI") as a thing the clinic layer must match, and the library plan
keeps that family for exactly this app. `MessageThread`, `MessageComposer`,
`AttachmentChip` and `RecipientPicker` are therefore first-wave components —
built on the chat primitives, with a quote-block mode so legacy email-shaped
messages (the WinForms EMR dialect) render faithfully inside the same stream.

**What is deliberately *not* a component.** The eleven screen-shaped things in
the sources (registration screen, exam room, superbill, eDocuments, report
builder, fax console, portal home, chart share, reconciliation dialog, letter
editor, Quick Pay dialog) are compositions documented in
[05-screen-blueprints.md](05-screen-blueprints.md). Nobody builds an
`<ExamRoomScreen>` god-component.

## Responsive policy (explicit, per component)

Every catalog entry carries one verdict:

| Verdict | Meaning | Example |
|---|---|---|
| **Fluid** | Reflows at every width, phone → desktop | `AppointmentCard`, `MetricTile`, `PatientHeaderBar` |
| **Breakpoint-swap** | Genuinely different layout below `md` | `AppShell` (4-pane → stacked), `ScheduleGrid` (week → agenda) |
| **Scroll-locked** | Keeps its desktop layout, scrolls horizontally; first column/header sticks | `FlowsheetGrid`, `ResultTable`, `EventTimeline` |
| **Desktop-only** | Do not attempt; hide or replace below `md` | `BodyMapAnnotator`, `QueryBuilder`, `EMLevelMatrix` |

The rule (§5 of [02-design-direction.md](02-design-direction.md)): **does the
layout carry meaning?** Cards reflow; matrices scroll; spatial diagrams refuse.

## Ground rules (binding, from `AGENTS.md`)

1. **Never hardcode a hex color in a className.** Use `things-*` or `clinic-*`
   utilities, or shadcn semantic vars. New color → `@theme` **and**
   `design-tokens.json` in the same change.
2. **Never edit `app/frontend/components/ui/*`.** Clinic components compose
   them, nothing more.
3. **Every component gets a colocated `*.stories.tsx`** — that is the project's
   definition of "spec".
4. `npx tsc --noEmit` and `npm run verify:spec` green before any commit.
5. User-visible strings live in `app/frontend/i18n/{en,th,ja}.json` — all three
   locales, same change. Components take props, never hardcoded strings.
