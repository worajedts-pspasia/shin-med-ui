#!/usr/bin/env node
// i18n quality gate (no deps): JSON validity, key-set parity, placeholder
// parity, and length caps between locales.
//
// Length is measured in *width units*: code points that advance the cursor.
// Thai combining marks (U+0E31, U+0E34–U+0E3A, U+0E47–U+0E4E) render above or
// below the base consonant and count 0 — raw code points make the caps
// unsatisfiable for correct Thai (e.g. "ปี" for "y" is 2 code points vs a
// 1.4-char cap). Deviation from the brief's plain "characters", recorded in the
// i18n pass report.
//
// EXEMPT_KEYS: a handful of standard medical/UI terms that have no shorter
// professional phrasing and are allowed to exceed the cap. Keep this list
// short; every entry carries its reason.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const load = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"))

const problems = []
const fail = (msg) => problems.push(msg)

// --- helpers ---------------------------------------------------------------

const flat = (obj, prefix = "", out = {}) => {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === "object") flat(v, key, out)
    else out[key] = String(v)
  }
  return out
}

const THAI_COMBINING = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g
const width = (s) => s.replace(THAI_COMBINING, "").length

const placeholders = (s) => [...s.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1]).sort()

// Standard terms with no shorter professional phrasing (see header comment).
const EXEMPT_KEYS = new Set([
  // Thai "ทั้งหมด" is the only word for "All" (5 width units vs 4.2 cap)
  "view.all",
  "clinic.range.all",
  "clinic.med.all",
  "clinic.resource.selectAll",
  // Urgency anchor term ความเร่งด่วน (rule 3); 11 vs 9.8 cap
  "clinic.queue.urgency",
  // "or" conjunction in the rule editor; หรือ has no 2-unit Thai form
  "clinic.query.or",
  // License label on the prescription; ใบอนุญาต is the standard term
  "clinic.rx.license",
  // Standard anatomy term หลอดเลือดดำ (venous); arterial fits, venous is 0.4 over
  "clinic.anatomy.venous",
  // Standard severity grade for allergy reactions (mild)
  "clinic.allergy.severity.mild",
  // Reconciliation table "Item" column; รายการ is the standard term
  "clinic.recon.item",
  // Lab table "Analyte" column; รายการตรวจ is the standard term
  "clinic.result.analyte",
  // Japanese DOB label 生年月日 is the standard EHR term (4 vs 3.45 cap)
  "clinic.patient.dob",
])

// --- checks ----------------------------------------------------------------

let en, th, ja, den, dth, dja
for (const [name, p, slot] of [
  ["en.json", "src/i18n/en.json", "en"],
  ["th.json", "src/i18n/th.json", "th"],
  ["ja.json", "src/i18n/ja.json", "ja"],
  ["docs/en.json", "src/i18n/docs/en.json", "den"],
  ["docs/th.json", "src/i18n/docs/th.json", "dth"],
  ["docs/ja.json", "src/i18n/docs/ja.json", "dja"],
]) {
  try {
    const v = load(p)
    if (slot === "en") en = v
    else if (slot === "th") th = v
    else if (slot === "ja") ja = v
    else if (slot === "den") den = v
    else if (slot === "dth") dth = v
    else dja = v
  } catch (e) {
    fail(`${name}: invalid JSON — ${e.message}`)
  }
}

const checkSet = (base, E, X, label, cap, exempt) => {
  const ek = Object.keys(E), xk = Object.keys(X)
  for (const k of ek) if (!(k in X)) fail(`${label}: missing key ${k}`)
  for (const k of xk) if (!(k in E)) fail(`${label}: extra key ${k} (not in ${base})`)
  for (const [k, ev] of Object.entries(E)) {
    const xv = X[k]
    if (xv === undefined) continue
    const ep = placeholders(ev), xp = placeholders(xv)
    if (JSON.stringify(ep) !== JSON.stringify(xp))
      fail(`${label}.${k}: placeholder mismatch ${JSON.stringify(ep)} vs ${JSON.stringify(xp)} (en ${len(ev)}, ${label} ${len(xv)})`)
    const limit = cap * width(ev) + 1e-9
    if (!exempt.has(k) && width(xv) > limit)
      fail(`${label}.${k}: too long — ${label} width ${width(xv)} > ${cap} × en width ${width(ev)} (cap ${limit.toFixed(1)})`)
  }
}
const len = (s) => s.length

checkSet("en.json", flat(en), flat(th), "th", 1.4, EXEMPT_KEYS)
checkSet("en.json", flat(en), flat(ja), "ja", 1.15, EXEMPT_KEYS)
checkSet("docs/en.json", flat(den), flat(dth), "docs.th", 1.25, new Set())
checkSet("docs/en.json", flat(den), flat(dja), "docs.ja", 1.25, new Set())

if (problems.length) {
  for (const p of problems) console.log(p)
  console.log(`\n${problems.length} problem(s)`)
  process.exit(1)
}
console.log("check-i18n: OK — key sets, placeholders and length caps all pass")
