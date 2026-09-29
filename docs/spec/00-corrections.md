# 00 — Corrections & review notes

Review of the merged specification against the original screenshots and the
live repo. Read this before implementing; it changes two P0 components.

**Overall:** the merge is faithful. Everything substantive from both parents survived —
the three-state `AllergyBanner`, the `Monochrome` story requirement, the `:lang(th)` dense
override, the Buddhist-era warning, `tabular-nums`, `referenceBands`, append-only note
history, the one-modal-level rule, the F-key preservation. Several merge decisions are
**better** than either parent (see §3). The prerequisite claims all verify:

| Claim | Verified |
|---|---|
| 61 shadcn primitives vendored | ✅ `ls app/frontend/components/ui/*.tsx \| grep -v stories \| wc -l` → 61 |
| Commit `8e1b9f8` vendored them | ✅ *"Vendor full shadcn/ui registry set as shared themed library, with stories for all 61 primitives"* |
| Chat family present | ✅ `message` `message-scroller` `bubble` `attachment` `item` `marker` all exist |
| `verify:spec` prefix bug is real | ✅ regex at `tools/verify-spec.mjs:41`, unfiltered reverse check at `:56` |

---

## 1. ❗ Correction: the queue legend is urgency, not processing status

**Affects:** `03-design-tokens.md` §6 (first row of the cheat sheet),
`04-component-catalog.md` Layer 3 — `StatusDot`/`StatusLegend` (P0),
`TriageDot`/`TriageLegend` (demoted to P2), and `QueueTable`'s `status` prop.

The merge states the `01.1` queue legend reads **มา / รับ / อั้น** ("arrived / accepted /
held") and is therefore *processing status, not triage* — and on that basis demotes
`TriageDot` to P2, marking it *"not in these sources"*.

**That reading is incorrect.** The legend reads **ปกติ / รีบ / ด่วน**.

Cropped and upscaled 4× from the `02.1` doctor-room SOAP screen during the review
(verification crops are no longer kept in the repo):

| Dot | Thai | Reading | Meaning |
|---|---|---|---|
| 🟢 | **ปกติ** | `ป ก ต` + ◌ิ (sara i) | normal |
| 🟡 | **รีบ** | `ร` + ◌ี (sara ii — the tall hook, not ◌ั) + `บ` | rush / hurry |
| 🔴 | **ด่วน** | `ด` + ◌่ (mai ek) + `ว น` | urgent |

The identical legend appears in the `01.1` registration screen. Neither
`มา`, `รับ` nor `อั้น` appears in either legend.

### Where the misreading came from — and the useful thing underneath it

`01.1`'s **ข้อมูลถึงแพทย์** ("information to the doctor") group holds **two separate
fields**:

| Field | Value shown | Axis |
|---|---|---|
| **สถานะ** (status) | **มาปกติ** — "came normally" | visit / processing status |
| **ด่วน-ไม่ด่วน** (urgent / not urgent) | **ปกติ** — "normal" | urgency |

The `มา` in the merge's reading comes from **มาปกติ** — the *status* field — which sits a
few pixels from the urgency field in the same group box. The two got conflated.

**So both packages were each half right, and the merge is the closest of the three:** it
already contains `StatusDot` *and* `TriageDot`. It simply wired the wrong one to the queue.

### The correct model — two orthogonal axes

```ts
// axis 1 — urgency. Drives the coloured dot in คิวรอตรวจ. Set at registration
// via ด่วน-ไม่ด่วน. Ordered scale.
type Urgency = "routine" | "rush" | "urgent"      // ปกติ · รีบ · ด่วน

// axis 2 — visit status. Separate column. Where the patient is in the workflow.
// สถานะ, seeded with มาปกติ; the source's dropdown holds the full vocabulary.
type VisitStatus = "arrived" | "in-room" | "done" | "cancelled" | ...
```

### Patch

1. **`TriageDot` / `TriageLegend` → P0**, sourced to `01.1` + `02.1` (readings above), not
   "domain-standard, not in these sources". Keep the shape channel (hollow / half / filled)
   and the `clinic-ok` / `clinic-warn` / `clinic-critical` mapping — the merge's own text
   for this component is correct as written.
2. **`StatusDot` / `StatusLegend` stay P0**, but sourced to the **สถานะ** field, not the
   legend. Keep the flow tones (`things-green` / `things-gold` / `things-gray-3`) — the
   merge is right that flow ≠ severity, and that distinction is worth keeping.
3. **`QueueTable`** carries **both**: `urgency` (the dot, and the default sort) and
   `status` (a column). Its `legend` prop becomes a `TriageLegend`.
4. **`03-design-tokens.md` §6 row 1** becomes two rows:

   | Domain concept | Source | Token |
   |---|---|---|
   | Queue urgency ปกติ / รีบ / ด่วน | `01.1`, `02.1` legend (verified 4×) | `clinic-ok` / `clinic-warn` / `clinic-critical` |
   | Visit status สถานะ (มาปกติ, …) | `01.1` ข้อมูลถึงแพทย์ | `things-green` / `things-gold` / `things-gray-3` — flow tones |

The "severity means severity, flow means flow" rule survives intact — it just now has two
correctly-sourced consumers instead of one mis-sourced one.

---

## 2. ❗ Gap: no dual-runtime (Hotwire) coverage

All 2,685 lines assume React. There is **no** mention of Hotwire, Turbo, Stimulus or ERB
anywhere in the package.

> If you grep for this yourself: `grep -ril "erb" *.md` returns all seven files, which
> looks like coverage. It is a false positive — `erb` is a substring of sup**erb**ill. Use
> `grep -rniE 'hotwire|stimulus|turbo|\berb\b'`, which returns nothing.

Given the stated intent — build the clinic layer as a React app **and** a Rails Hotwire app
simultaneously, the way the Things app was built — this is the largest gap in the package.
The repo already runs both (`PagesController#app` → SPA; Sessions/Settings/Tags → Hotwire),
and the existing Hotwire views **hand-duplicate Tailwind utility strings** that also exist
in `components/ui/*.tsx`. That is survivable for three settings pages and will not survive
93 clinic components.

Addressed in [`08-dual-runtime-architecture.md`](08-dual-runtime-architecture.md).

---

## 3. Merge decisions that improve on both parents — keep these

Noting them so nobody "restores" an earlier version:

- **`Inactivate` → `clinic-warn`, not `clinic-critical`.** Correct: inactivating a problem
  is reversible; stopping a drug is not. Better than my original.
- **The category lane map** (`03` §2) assigning the eight `things-*` accents to named
  clinical categories in one `components/clinic/tokens.ts`. Neither parent did this, and it
  is what stops four components inventing four different colour orders.
- **The dark-mode note** (`03` §7) — use semantic vars for surfaces/text, reserve
  `things-*`/`clinic-*` for accent and severity. Neither parent addressed dark mode at all.
- **`ClinicalSummaryColumn`** as a named component for the attested Allergies / Medications
  / Problems panels — better than my screen-local *ReviewRow* composition.
- **`NoteHistoryLog`** extracted as its own component rather than buried in
  `EditProblemDialog`. It is needed by problems, allergies and orders alike.
- **`FormGrid`** as a base layout kit. I had no equivalent and the ERB side will need it
  (see `08`).
- **Messaging promoted to P0.** Correct reading of the brief — "ChatUI" was named in it.

---

## 4. Smaller items

- **`QueueTable` mobile rendering.** The merge adds "below `md`: rows become stacked list
  items… both renderings live in this component." Good, but it makes `QueueTable`
  Breakpoint-swap, not Scroll-locked as its header says. Fix the verdict, or drop the
  stacked mode and keep it Scroll-locked. Do not leave both claims.
- **Component count.** Verified correct: the nine layer headings sum to exactly 93
  (11+10+9+15+6+15+14+5+8). No drift.
- **`clinic-warn` doing double duty.** It now carries abnormal-lab, care-gap-due,
  allergy-not-recorded, *and* `Inactivate`. That is four meanings on one colour. It is
  still defensible (all four are "attention, not danger"), but worth a line in `02` saying
  so explicitly, so the next person does not add a fifth.

---

## 5. ❗ Correction: two of the three severity colours fail WCAG AA

**Affects:** `03-design-tokens.md` §3 (the severity table, the contrast note, both patch
blocks).

Both parent packages — and the merge, quoting them — assert:

> *"the three primaries clear **4.5:1 against white** and against their own `-soft`
> companions, so they are legal as text as well as fills."*

**That assertion was never checked. Two of the three fail.** Measured (WCAG 2.1 relative
luminance):

| Token | Hex | on white | on its `-soft` | Verdict |
|---|---|---|---|---|
| `clinic-ok` | `#1f9d55` | 3.49:1 | 3.17:1 | ❌ large text only |
| `clinic-warn` | `#c77700` | 3.46:1 | 3.17:1 | ❌ large text only |
| `clinic-critical` | `#c62828` | 5.62:1 | 4.88:1 | ✅ passes |
| `clinic-paper-ink` | `#2b2a26` | 13.98:1 (on `clinic-paper`) | — | ✅ passes |

This is not academic. The whole point of the severity trio is that it renders as **text** —
an `H` flag, a `รีบ` label, a red `every 1y` interval — at 12–13px in `compact` and `dense`
mode. That is normal-size text, so 4.5:1 is the applicable threshold, and a 3.4:1 amber on
a tinted row is exactly the defect the doc's own note claims to be avoiding.

### Corrected values — same hue, AA-compliant

Darkened along the original hue (147° green, 36° amber) to the first value clearing 4.5:1
against **both** white and its `-soft` companion:

| Token | Was | **Use** | on white | on `-soft` |
|---|---|---|---|---|
| `clinic-ok` | `#1f9d55` | **`#197f47`** | 5.04:1 | 4.57:1 |
| `clinic-warn` | `#c77700` | **`#a36100`** | 4.92:1 | 4.51:1 |
| `clinic-critical` | `#c62828` | `#c62828` — unchanged | 5.62:1 | 4.88:1 |

The `-soft` surface tokens (`#eaf7ef`, `#fdf4e6`, `#fcebea`) are unchanged; they are fills,
not text, and the ratios above are computed against them as-is.

Apply to `03-design-tokens.md` §3 (table), §4 (`index.css` patch) and §5
(`design-tokens.json` patch). Replace the contrast note with the measured table above
rather than a claim.

**Reproduce:**

```bash
python3 - <<'PY'
def lin(c):
    c/=255
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def L(h):
    h=h.lstrip('#'); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
def cr(a,b):
    la,lb=L(a),L(b); hi,lo=max(la,lb),min(la,lb); return (hi+0.05)/(lo+0.05)
for fg,bg,n in [('#197f47','#eaf7ef','ok/soft'),('#a36100','#fdf4e6','warn/soft'),
                ('#c62828','#fcebea','critical/soft')]:
    print(f'{n:>15} {cr(fg,bg):.2f}:1')
PY
```

Worth adding as a permanent check in `verify-spec.mjs` alongside the token mirror — it
needs no browser, and it stops the next palette addition regressing silently. Sketch in
[`08-dual-runtime-architecture.md`](08-dual-runtime-architecture.md) §7.
