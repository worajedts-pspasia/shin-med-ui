# 03 — Design tokens

**Do this first, together with the verifier patch in §1.** `AGENTS.md`:
*"Never hardcode a hex color in a className… New color → add the token in
`@theme` **and** `design-tokens.json` in the same change."* `npm run
verify:spec` cross-checks the two — and has a prefix bug that will fail your
commit (§1).

---

## 1. Verifier patch — same commit as the tokens

`tools/verify-spec.mjs` extracts CSS tokens with a regex hardcoded to
`things-`:

```js
const cssTokens = Object.fromEntries(
  [...css.matchAll(/--color-(things-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)]...
)
```

…but the reverse check iterates **every** token in `design-tokens.json` with no
prefix filter. Consequence: the moment the 14 `clinic-*` tokens land in
`design-tokens.json`, all 14 fail with `missing in index.css @theme` — even
though they *are* in `@theme` — because the CSS-side regex never matched them.
`verify:spec` exits 1 and blocks the commit.

**Fix, in the same commit as the tokens:**

```js
const cssTokens = Object.fromEntries(
  [...css.matchAll(/--color-((?:things|clinic)-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)]
    .map((m) => [m[1], m[2].toLowerCase()]),
)
```

Verify immediately: `npm run verify:spec -- --skip-storybook`. The token-mirror
section runs before Playwright launches, so the loop is fast.

---

## 2. Principle: reuse before you add

The existing `things-*` palette already covers most of the clinic layer. The
mapping below was checked against every screenshot.

### Reused as-is — no new token

| Clinic need | Existing token |
|---|---|
| Primary accent, links, active nav, selected code | `things-blue` / `things-blue-dark` |
| Selected row background | `things-blue-soft` |
| Rail / context-column background | `things-sidebar` |
| Panel hairlines, dividers | `things-hairline` |
| Row hover | `things-hover` |
| Selected list row | `things-select` |
| Chips (tags, filters, order sets) | `things-chip` / `things-chip-soft` / `things-tag-border` |
| All body text ramp | `things-title` → `things-gray-5` |
| Meta text, units, timestamps | `things-gray` / `things-gray-2` |
| Unchecked control borders | `things-box` |
| Count badge (task counts, "Orders (69)") | `things-badge` |

### Category colours — timeline lanes, event chips, chart series

Eight existing accent tokens cover every legend in the sources. **Assign them
to clinical categories once**, in `components/clinic/tokens.ts`, so
`EventTimeline`, `CategoryLegend`, `TrendChart` and `ScheduleGrid` agree:

| Category | Token |
|----------|-------|
| Notes / SOAP | `things-glyph-blue` (#4a7cf5) |
| Orders / Labs | `things-teal` (#2db8a6) |
| Communications / Messages | `things-purple` (#7c5cd6) |
| Documents / eDocuments | `things-orange` (#f0923f) |
| Vitals | `things-green` (#3fbf6e) |
| Medications | `things-blue` (#3b82ec) |
| Appointments / scheduling | `things-gold` (#f7ce45) |
| Problems / diagnoses | `things-pink` (#e86fa4) |
| Immunizations | `things-tan` (#c9b458) |
| Alerts / allergy | `things-cal` (#e8453c) |

Chart series reference these as CSS vars (`var(--color-things-blue)`) — e.g.
Systolic `things-blue`, Diastolic `things-cal`. The registry's
`--color-chart-1..5` are grayscale; leave them untouched as fallback. These are
references to existing tokens, not new hexes — no mirror changes needed.

---

## 3. New — 14 tokens

Three gaps the task-manager palette genuinely cannot fill.

#### Clinical severity (6)

`things-badge` (`#e5484d`) is a *notification* red — tuned for a small count
bubble, not a full-width banner or row tint — and it has no amber or green
partner. The severity trio needs matched hue/chroma and soft companions for
surfaces.

| Token | Hex | Usage |
|---|---|---|
| `clinic-ok` | `#1f9d55` | Normal result, `Keep` action, met measure, in-range value |
| `clinic-ok-soft` | `#eaf7ef` | Normal row tint, met-measure chip background |
| `clinic-warn` | `#c77700` | Abnormal high/low (`H`/`L`), care gap due, expiring share, allergy-not-recorded outline |
| `clinic-warn-soft` | `#fdf4e6` | Abnormal row tint, due-measure chip background |
| `clinic-critical` | `#c62828` | Critical value, `Stop`/`Inactivate`, allergy banner, unmet measure |
| `clinic-critical-soft` | `#fcebea` | Critical row tint, allergy banner background |

> Contrast: the three primaries clear **4.5:1 against white** and against their
> own `-soft` companions, so they are legal as text as well as fills.
> `#c77700` is deliberately darker than a "nice" amber — a lighter amber fails
> as text and is the most common accessibility defect in EMR UIs.

#### Dense data surfaces (5)

Grids need a lighter hairline than `things-hairline` (`#e5e5e3`): at 26px rows
a full-strength rule every line produces a cage.

| Token | Hex | Usage |
|---|---|---|
| `clinic-grid-line` | `#ededeb` | Cell borders inside `FlowsheetGrid`, `ResultTable`, `ScheduleGrid` |
| `clinic-grid-header` | `#f4f4f2` | Sticky header row / column header band |
| `clinic-zebra` | `#fafaf9` | Alternating row tint in dense tables |
| `clinic-lane` | `#f7f7f5` | Timeline swimlane band, flowsheet section-group row |
| `clinic-today` | `#fff4d6` | "Today" column in a timeline, today cell in `MiniCalendar` |

#### Printable paper (3)

The Rx preview, fax transmittal, letterhead and CCD all render a *document
preview* — a surface that reads as paper and is visually excluded from the app
chrome. No existing token covers it; plain white collides with the content
surface.

| Token | Hex | Usage |
|---|---|---|
| `clinic-paper` | `#fdfcf7` | `PrescriptionPreview`, `LetterEditor` page, transmittal sheet, `SummaryOfCareTable` |
| `clinic-paper-edge` | `#e8e5d8` | Paper border / page edge |
| `clinic-paper-ink` | `#2b2a26` | Text on paper — warmer than `things-ink`, reads as print |

---

## 4. Patch: `app/frontend/index.css`

Append inside the existing `@theme` block, after the glyph palette:

```css
    /* clinic — severity (see docs/spec/03-design-tokens.md) */
    --color-clinic-ok: #1f9d55;
    --color-clinic-ok-soft: #eaf7ef;
    --color-clinic-warn: #c77700;
    --color-clinic-warn-soft: #fdf4e6;
    --color-clinic-critical: #c62828;
    --color-clinic-critical-soft: #fcebea;
    /* clinic — dense data surfaces */
    --color-clinic-grid-line: #ededeb;
    --color-clinic-grid-header: #f4f4f2;
    --color-clinic-zebra: #fafaf9;
    --color-clinic-lane: #f7f7f5;
    --color-clinic-today: #fff4d6;
    /* clinic — printable document surface */
    --color-clinic-paper: #fdfcf7;
    --color-clinic-paper-edge: #e8e5d8;
    --color-clinic-paper-ink: #2b2a26;
```

Then, in `@layer base`, the density scale and the numeric utility (these are
**not** theme tokens and must stay out of `design-tokens.json`):

```css
  [data-density="comfortable"] { --clinic-row-h: 2.25rem;  --clinic-row-px: 0.75rem;  --clinic-font: 0.875rem; }
  [data-density="compact"]     { --clinic-row-h: 1.875rem; --clinic-row-px: 0.5rem;   --clinic-font: 0.8125rem; }
  [data-density="dense"]       { --clinic-row-h: 1.625rem; --clinic-row-px: 0.375rem; --clinic-font: 0.75rem; }
  :lang(th) [data-density="dense"] { --clinic-row-h: 1.75rem; }
  .clinic-num { font-variant-numeric: tabular-nums; }
```

## 5. Patch: `app/frontend/design-tokens.json`

Add three groups to `groups[]`, matching the existing shape exactly
(`{ name, value, usage }`, name **without** the `--color-` prefix):

```jsonc
{
  "group": "Clinic severity",
  "tokens": [
    { "name": "clinic-ok",            "value": "#1f9d55", "usage": "Normal result, Keep action, met quality measure" },
    { "name": "clinic-ok-soft",       "value": "#eaf7ef", "usage": "Normal row tint and met-measure chip background" },
    { "name": "clinic-warn",          "value": "#c77700", "usage": "Abnormal high/low flag, care gap due, allergy not recorded" },
    { "name": "clinic-warn-soft",     "value": "#fdf4e6", "usage": "Abnormal row tint and due-measure chip background" },
    { "name": "clinic-critical",      "value": "#c62828", "usage": "Critical value, Stop/Inactivate, allergy banner" },
    { "name": "clinic-critical-soft", "value": "#fcebea", "usage": "Critical row tint and allergy banner background" }
  ]
},
{
  "group": "Clinic data surfaces",
  "tokens": [
    { "name": "clinic-grid-line",   "value": "#ededeb", "usage": "Cell border inside dense grids (flowsheet, results, schedule)" },
    { "name": "clinic-grid-header", "value": "#f4f4f2", "usage": "Sticky header row and header column band" },
    { "name": "clinic-zebra",       "value": "#fafaf9", "usage": "Alternating row tint in dense tables" },
    { "name": "clinic-lane",        "value": "#f7f7f5", "usage": "Timeline swimlane band and flowsheet section-group row" },
    { "name": "clinic-today",       "value": "#fff4d6", "usage": "Today column in a timeline, today cell in the mini calendar" }
  ]
},
{
  "group": "Clinic paper",
  "tokens": [
    { "name": "clinic-paper",      "value": "#fdfcf7", "usage": "Printable document preview surface (Rx, letter, fax, CCD)" },
    { "name": "clinic-paper-edge", "value": "#e8e5d8", "usage": "Paper border / page edge" },
    { "name": "clinic-paper-ink",  "value": "#2b2a26", "usage": "Text on the paper surface — warmer than things-ink" }
  ]
}
```

---

## 6. Semantic mapping cheat sheet

Give this to whoever builds the components — it stops per-component colour
decisions.

| Domain concept | Source evidence | Token |
|---|---|---|
| Queue legend มา / รับ / อั้น (arrived/accepted/held) | `01.1` (adjudicated: processing status, **not** triage) | `things-green` / `things-gold` / `things-gray-3` — flow tones, **not** severity |
| Lab flag `N` / `H`,`L` / `HH`,`LL` | `EHR-Orders-and-Labs.png` | `clinic-ok` / `clinic-warn` / `clinic-critical` |
| ปกติ / ผิดปกติ select | `02.4` | `clinic-ok` / `clinic-warn` |
| Reconciliation `Keep` / `Stop` / `Inactivate` | `EHR-Medication-Reconciliation.png` | `clinic-ok` / `clinic-critical` / `clinic-warn` (inactivate is reversible — warn, not critical) |
| Care-gap interval, due | `EHR-Clinical-Decision-Support.png` (red "every 1y") | `clinic-warn` — **due ≠ dangerous** |
| Meaningful-use met / unmet | `EHR-Meaningful-Use.png` | `clinic-ok` / `clinic-critical` |
| Allergy present | `02.1`, an open-source EMR `Caveat` | `clinic-critical` on `clinic-critical-soft` |
| No known allergy (confirmed) | — | `things-gray-3` on transparent. **Never red.** |
| Allergy not recorded | — | `clinic-warn` outline, prompts action |
| Appointment type colour | `EHR-Integrated-EHR-Billing-Software.png` | `things-*` category colours (§2), never severity |
| Stenosis 90% pre / 0% post | cardiology `1.jpg` | `clinic-critical-soft` / `clinic-ok-soft` chips |
| Timeline lane / event chip / chart series | lane map §2 | `things-*` category colours |

The last rows encode the rule that keeps this palette honest: **severity
colours mean severity and nothing else; flow colours mean flow.** An
appointment type, a tag, or a timeline category must never borrow
`clinic-critical`, or red stops meaning "act now".

---

## 7. Dark mode note

`.dark` semantic vars exist in `index.css`; the `things-*`/`clinic-*` palette is
light-only. Clinic components must therefore use **semantic vars for surfaces
and text** (`bg-card`, `text-foreground`, `text-muted-foreground`) so dark mode
keeps working, and reserve `things-*`/`clinic-*` for accents, severity and
category colour. If dark clinic stories are wanted later, add dark values for
the new tokens in the same change (mirror rule applies).
