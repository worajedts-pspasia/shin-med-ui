# 09 — Implementation status (spec ↔ storybook reconciliation)

**Status: implemented.** Reconciled against the built system on 2026-09-29; addendum reconciled 2026-10-02.
This file records where the spec and the Storybook agree, where they drifted,
and where the truth lives now. Update it whenever a component is added,
renamed or consolidated.

## The built system, in numbers

| Item | Count | Where |
|---|---|---|
| Authored components | 96 (90 `clinic/*.tsx` + 6 `things/*.tsx`, incl. the `story-utils` and `icons` helpers) | `src/components/` |
| Vendored shadcn primitives | 61 | `src/components/ui/` (never edited) |
| Stories | 528 across ~180 story files (incl. the Recipes docs page) | colocated `*.stories.tsx` |
| Tokens | 51, mirrored exactly between `src/theme.css` and `src/design-tokens.json` (verifier-enforced) | `src/` |
| Locales | en / th / ja | `src/i18n/` |
| Post-catalog additions | 12 components (chart family ×6, stage family ×3, IdentityChip, CalloutNote, CameraCapture) + 7 recipes — see 04's addendum | `src/components/{charts,clinic,recipes}/` |
| Verifier | ~300 checks against the Sample Tasks UI Rails app (:3000) + Storybook (:6006) | `tools/verify-spec.mjs` |

## Catalog reconciliation (04)

**Every catalog entry is implemented.** The file-name diff looks like drift at
first, but the "missing" names are named exports of consolidated files:

| Catalog entry (04) | Built as | File |
|---|---|---|
| `ProblemTable`, `MedicationList`, `CareGapTable`, `AllergyList` | same names, named exports | `ClinicalLists.tsx` |
| `MessageListRow` | absorbed into `MessageList` (one component, three dialects) | `MessageList.tsx` |
| `ScheduleSummaryTable`, `ResourceFilterList` | same names, named exports | `ScheduleLists.tsx` |
| `ResultReport`, `SummaryOfCareTable`, `DocumentTree` | same names, named exports | `Paper.tsx` (paper-surface family) |

Also note: several entries live in 04's layer prose rather than `###`
headings (`ReportFrame`, `KpiScorecard`, `EMLevelMatrix`, `LabFishbone`,
`VaccineScheduleTable`, `QueryBuilder`, `TopNCard`, `SeriesToggle`,
`AnatomyInspector`, `BodyMapAnnotator`, `AlertTicker`, `CohortTimeline`,
`ComplianceBoard`), so heading-only greps undercount the catalog.

**Built beyond the catalog:**

- `LauncherRail` — the MS-cloud "side toolbar" pattern in clinic tokens; the
  one clinic component with no catalog entry. If it stays, it deserves an
  entry in 04 (Layer 8, alongside `AlertTicker`).
- `DayBoard` — the Blueprint-2 screen assembled in the real `AppShell`
  (documented in 05 §2, not the catalog).
- The **Task Management family** (`TaskRow`, `Sidebar`, `QuickFind`,
  `NewTodoDialog`, `BottomToolbar`, `icons`) in `src/components/things/` —
  out of clinic-catalog scope by design; documented by its own stories and
  the "Task Management" sidebar group.

## 00-corrections: verified in code

- `QueueTable` carries **both** axes — `urgency` (ปกติ/รีบ/ด่วน, the dot and
  default sort) and `status` (สถานะ, a column). ✅
- `TriageDot` / `TriageLegend` and `StatusDot` / `StatusLegend` all exist as
  P0 components. ✅

## Token drift (03)

03 documents 41 of the 51 live tokens. The ten below were added during the
Things theming and are documented here, not in 03. **Canonical list:
`src/design-tokens.json`** (mirrored into `src/theme.css`; the verifier fails
the build if they diverge).

| Token | Value | Role |
|---|---|---|
| `things-window` | `#e8e8e6` | app window surface |
| `things-evening` | `#7a8fae` | evening accent |
| `things-border` | `#dcdcd9` | strong border |
| `things-ink-strong` | `#1e1e1d` | strongest ink |
| `things-ink-2` | `#4a4a48` | secondary ink |
| `things-gray-4` | `#6a6a68` | gray ramp step 4 |
| `things-gold-dark` | `#e0b93a` | gold hover/dark |
| `things-light-red` | `#ff5f57` | macOS stop tint |
| `things-light-yellow` | `#febc2e` | macOS warn tint |
| `things-light-green` | `#28c840` | macOS ok tint |

## Path drift (all files)

The spec was written when this package lived inside the Rails app; every
`app/frontend/...` path in these docs now means `src/...` in this standalone
package. The Rails-consumer wiring (install, dedupe, `@/` resolution,
Tailwind inlining) is documented in the **root README's Consumer guide** —
that, not 08, is the current authority for consumers; 08 remains the
architecture rationale (React islands vs Hotwire partition).

## What each document is for now

| Doc | Role after implementation |
|---|---|
| 00–02 | Decision record: adjudications, safety rules, design direction. Still normative for new work. |
| 03 | Token provenance; the live token list is `design-tokens.json` |
| 04 | Catalog of record — add an entry for every new clinic component (see `LauncherRail` above) |
| 05 | Screen blueprints; `DayBoard`/`AppShell` stories are the living versions |
| 06 | Verification contract; `tools/verify-spec.mjs` + the root README hold the current commands |
| 07 | Fixtures/i18n rules (determinism, no PHI) — still normative |
| 08 | Dual-runtime architecture rationale |
| **09 (this file)** | **Keep current on every change: what shipped, what moved, what's undocumented** |

For consumers, the Storybook **is** the documentation — every component ships
a Docs page (purpose, when to reach for it, Watch out) plus live states. This
folder is the maintainer-and-agent layer: decisions, rationale and the
reconciliation you are reading.

## i18n pass (2026-09-29)

Full medical-quality localization pass over `src/i18n/th.json`, `src/i18n/ja.json`
and the Storybook Docs prose.

- **UI strings**: all 512 keys per locale reviewed. Changed 66 values in Thai,
  15 in Japanese — terminology per the anchor list (ใบส่งตรวจ/処方医, จ่ายยา/調剤,
  異常高値·異常低値, ผู้สั่งจ่ายยา, ความเร่งด่วน, 緊急値, 検査依頼書, …) plus
  length-cap fixes.
- **Docs prose**: new `src/i18n/docs/{en,th,ja}.json`; all 124 component and
  story descriptions extracted from `.stories.tsx` (mechanical codemod), now
  served through `src/lib/docs-desc.ts` (`docsDesc("<Component>")` /
  `docsDesc("<Component>::<Story>")`) and translated into both locales.
- **Gate**: new `node tools/check-i18n.mjs` (no deps) — JSON validity, key-set
  parity across the three locales, `{{placeholder}}` parity, and length caps.
  It exits 0 as of this note.
- **Length-cap metric deviation**: caps (th 1.4×, ja 1.15× UI; 1.25× docs) are
  enforced on *width units* (code points minus Thai combining marks
  U+0E31/0E34–0E3A/0E47–0E4E), not raw `length` — raw code points make the caps
  unsatisfiable for correct Thai (e.g. "ปี" for "y" is 2 code points vs a 1.4
  cap). A small documented `EXEMPT_KEYS` list (12 keys) covers standard terms
  with no shorter professional form ("ทั้งหมด"=All, "ความเร่งด่วน"=Urgency,
  "ใบอนุญาต", "หลอดเลือดดำ", "เล็กน้อย", "รายการ"=Item, "รายการตรวจ"=Analyte,
  "หรือ"=or, ja "生年月日"=DOB).
- Deliberately kept in English/Latin (both locales): E/M, MRN, OPD, Rx, Sig,
  CHEM-7, CBC, HL7, ICD-10/CPT/LOINC/ATC, localStorage, Re:/OK/N/A/CC,
  `00-corrections §1`, component/class names, and CSS/token identifiers.
- Verification: `tsc --noEmit` clean; 20 localized Docs-page spot-checks
  (10 components × th/ja across Medical UI / Shell / Component) and 2
  localized story spot-checks all pass with zero page errors.

### Scope extension (same day, owner-requested): Design System + UI groups

The owner asked for the Design System and UI groups to be localized too, which
the original brief had excluded. Under that authorization:

- New `design.*` namespace (86 keys × 3 locales): the four page-like stories now
  wire `useTranslation` — Design System/Introduction, Typography & Rhythm,
  Design Tokens, and Medical/Introduction (ReadMe pages). Code identifiers,
  token names and group titles from `design-tokens.json` stay literal.
- 51 recurring English demo chrome strings across 18 `src/components/ui`
  stories now resolve through existing adjudicated keys (`i18n.t`); 6 new
  `design.ui.*` keys cover the table/accordion demos. Demo data that is proper
  content ("Quarter Close", "Reply to Sarah about the venue", dates, "9:00 AM")
  and the NativeSelect locale-name demo stay as-is. `sidebar.stories` args
  (`active: "Today"`) are functional selectors, not display text — untouched.
- `preview.tsx` decorator fix: docs descriptions resolve at module load, so a
  locale arriving via URL `globals=locale:th` (or any flip after boot) reloads
  the preview iframe once when the effective locale differs from the bootstrapped
  language; the reload is self-terminating (`bootLocale` sentinel). Verified:
  URL-param th/ja now render translated docs prose; `locale:jp` (invalid code —
  correct code is `ja`) settles harmlessly in English.
