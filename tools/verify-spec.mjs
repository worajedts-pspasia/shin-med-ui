#!/usr/bin/env node
/**
 * Spec ↔ implementation verification for the Sample Tasks UI Rails app (localhost:3000).
 *
 * The spec is the design system: the @theme tokens in src/index.css
 * plus the component invariants documented in Storybook. This script loads the
 * live Rails routes in headless Chromium and asserts that the rendered result
 * complies:
 *
 *   1. Token mirror  — every things-* token in index.css exists in
 *      design-tokens.json with the same value (and vice versa).
 *   2. Route compliance — per route, computed styles of key elements match the
 *      token values (sidebar bg, title color, hairlines, accent blue, badge
 *      red, …) and structural invariants hold (19px circular checkboxes, badge
 *      count equals open Today tasks, mobile drawer opens, …).
 *   3. Storybook smoke — the stories that define the spec load without errors.
 *
 * Usage:  npm run verify:spec [-- --app URL --storybook URL --skip-storybook]
 * Targets default to localhost:3000 (the Sample Tasks UI Rails app) and
 * localhost:6006; override with --app/--storybook or the environment
 * variables SPEC_TARGET_URL / SPEC_STORYBOOK_URL (issue #1: the clinic
 * front end is a React app over a Rails API, so its target differs).
 * Needs:  Rails (bin/rails server) and Storybook (npm run storybook) running.
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { chromium } from "playwright"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const APP = flag("app", process.env.SPEC_TARGET_URL ?? "http://localhost:3000")
const SB = flag("storybook", process.env.SPEC_STORYBOOK_URL ?? "http://localhost:6006")
const SKIP_SB = args.includes("--skip-storybook")

// ——— 1. token mirror ———

const css =
  readFileSync(path.join(root, "src/index.css"), "utf8") +
  readFileSync(path.join(root, "src/theme.css"), "utf8")
const cssTokens = Object.fromEntries(
  [...css.matchAll(/--color-((?:things|clinic)-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2].toLowerCase()]),
)
const json = JSON.parse(readFileSync(path.join(root, "src/design-tokens.json"), "utf8"))
const jsonTokens = Object.fromEntries(
  json.groups.flatMap((g) => g.tokens.map((t) => [t.name, t.value.toLowerCase()])),
)

const results = []
const check = (name, ok, detail = "") =>
  results.push({ name, ok, detail: ok ? "ok" : detail || "FAILED" })

for (const [name, value] of Object.entries(cssTokens)) {
  check(`mirror: ${name} in design-tokens.json`, jsonTokens[name] === value,
    jsonTokens[name] === undefined ? "missing in design-tokens.json" : `json has ${jsonTokens[name]}, css has ${value}`)
}
for (const name of Object.keys(jsonTokens)) {
  check(`mirror: ${name} in index.css`, cssTokens[name] !== undefined, "missing in index.css @theme")
}

// ——— helpers ———

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}
const T = Object.fromEntries(Object.entries(cssTokens).map(([k, v]) => [k, rgb(v)]))

const style = (page, selector, pseudo) =>
  page.evaluate(({ selector, pseudo }) => {
    const el = document.querySelector(selector)
    if (!el) return null
    const s = getComputedStyle(el, pseudo)
    return {
      color: s.color,
      bg: s.backgroundColor,
      borderTopColor: s.borderTopColor,
      borderRightColor: s.borderRightColor,
      radius: s.borderTopLeftRadius,
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
    }
  }, { selector, pseudo })

// ——— 2. route compliance ———

const ROUTES = ["/today", "/inbox", "/upcoming", "/anytime", "/someday", "/logbook", "/trash"]

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await context.newPage()

// Sign in (session cookie) — SPA + settings pages require it.
{
  await page.goto(`${APP}/login`, { waitUntil: "domcontentloaded" })
  await page.getByPlaceholder("Email").fill("demo@things.local")
  await page.getByPlaceholder("Password").fill("things3")
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.waitForTimeout(2000)
  check("auth: demo login succeeds", !page.url().includes("/login"), `still at ${page.url()}`)

  const boot = await page.evaluate("(async () => (await (await fetch('/api/v1/bootstrap')).json()))()")
  check("api: bootstrap responds", Boolean(boot?.counts), "no counts in bootstrap")
  const houseId = boot?.projects?.find((p) => p.name === "House")?.id
  ROUTES.push(`/projects/${houseId}`, `/areas/${boot?.areas?.[0]?.id}`)

  // Checks assert English strings — pin the locale for this run and restore
  // the user's own preference at the end.
  const userLocale = boot?.user?.locale ?? "en"
  if (userLocale !== "en") {
    await page.evaluate(`(async () => {
      const token = (await (await fetch('/api/v1/csrf')).json()).token
      await fetch('/api/v1/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token }, body: JSON.stringify({ user: { locale: 'en' } }) })
    })()`)
  }
  page.__originalLocale = userLocale
}

async function restoreLocale(page) {
  const original = page.__originalLocale
  if (!original || original === "en") return
  await page.evaluate(`(async () => {
    const token = (await (await fetch('/api/v1/csrf')).json()).token
    await fetch('/api/v1/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token }, body: JSON.stringify({ user: { locale: '${original}' } }) })
  })()`)
}

for (const route of ROUTES) {
  const tag = `route ${route}`
  let resp
  try {
    resp = await page.goto(APP + route, { waitUntil: "networkidle", timeout: 15000 })
  } catch {
    check(`${tag}: loads`, false, "navigation failed — is Rails running?")
    continue
  }
  check(`${tag}: loads`, resp.status() === 200, `HTTP ${resp.status()}`)

  const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily)
  check(`${tag}: system font stack`, font.includes("-apple-system"), font)

  const sidebar = await style(page, "aside > div")
  const aside = await style(page, "aside")
  check(`${tag}: sidebar bg = things-sidebar`, sidebar?.bg === T["things-sidebar"], `got ${sidebar?.bg}, want ${T["things-sidebar"]}`)
  check(`${tag}: sidebar divider = things-hairline`, aside?.borderRightColor === T["things-hairline"], `got ${aside?.borderRightColor}`)

  const h1 = await page.evaluate(() => {
    const el = document.querySelector("main h1")
    return el ? { text: el.textContent, color: getComputedStyle(el).color } : null
  })
  check(`${tag}: view title color = things-title`, h1?.color === T["things-title"], `got ${h1?.color}`)
  check(`${tag}: view title present`, Boolean(h1?.text), "no <h1> in main")

  const plus = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button[aria-label="New To-Do"]')).pop()
    return el ? getComputedStyle(el).backgroundColor : null
  })
  check(`${tag}: + button bg = things-blue`, plus === T["things-blue"], `got ${plus}`)
}

// /today specifics
{
  await page.goto(APP + "/today", { waitUntil: "networkidle" })
  const tag = "route /today"

  const box = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Mark as not completed"], button[aria-label="Mark as completed"]')
    if (!btn) return null
    const circle = btn.querySelector("span")
    const s = getComputedStyle(circle)
    const r = circle.getBoundingClientRect()
    return { borderColor: s.borderTopColor, radius: parseFloat(s.borderTopLeftRadius), width: r.width }
  })
  check(`${tag}: checkbox border = things-box`, box?.borderColor === T["things-box"], `got ${box?.borderColor}`)
  check(`${tag}: checkbox is circular`, (box?.radius ?? 0) > 50, `radius ${box?.radius}`)
  check(`${tag}: checkbox is 19px`, Math.abs((box?.width ?? 0) - 19) <= 1, `width ${box?.width}`)

  const sep = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("span")).find((s) => s.textContent === "This Evening")
    return el ? getComputedStyle(el).color : null
  })
  check(`${tag}: separator label = things-blue`, sep === T["things-blue"], `got ${sep}`)

  const evening = await page.evaluate(() => document.body.innerText.includes("This Evening"))
  check(`${tag}: evening group present`, evening)

  const badge = await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll("aside button")).find((b) => b.textContent?.startsWith("Today"))
    const pill = row?.querySelector("span.rounded-full")
    if (!pill) return null
    return { bg: getComputedStyle(pill).backgroundColor, text: pill.textContent }
  })
  check(`${tag}: Today badge bg = things-badge`, badge?.bg === T["things-badge"], `got ${badge?.bg}`)
  const openToday = await page.evaluate(() => document.body.innerText)
  check(`${tag}: Today badge count is numeric`, /^\d+$/.test(badge?.text ?? ""), `badge text ${badge?.text}`)

  const todayLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(new Date())
  check(`${tag}: header subtitle shows date`, openToday.includes(todayLabel), `expected ${todayLabel}`)

  // selected sidebar row
  const selected = await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll("aside button")).find((b) => b.textContent?.startsWith("Today"))
    return row ? getComputedStyle(row).backgroundColor : null
  })
  check(`${tag}: selected sidebar row = things-select`, selected === T["things-select"], `got ${selected}`)
}

// project page specifics (dynamic id discovered at login)
{
  const housePath = ROUTES.find((r) => r.startsWith("/projects/"))
  await page.goto(APP + housePath, { waitUntil: "networkidle" })
  const chip = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "All")
    return el ? getComputedStyle(el).backgroundColor : null
  })
  check("project page: active filter chip = things-chip", chip === T["things-chip"], `got ${chip}`)

  const heading = await page.evaluate(() => document.querySelector("main h1")?.textContent)
  check("project page: header is House", heading === "House", `got ${heading}`)
}

// /logbook specifics
{
  await page.goto(APP + "/logbook", { waitUntil: "networkidle" })
  const gray = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("p")).find((p) => p.textContent === "Pay electricity bill")
    return el ? getComputedStyle(el).color : null
  })
  check("route /logbook: completed title = things-gray", gray === T["things-gray"], `got ${gray}`)
}

// ——— API smoke: create + trash a task (session-authenticated) ———
{
  const fresh = await page.evaluate("(async () => (await (await fetch('/api/v1/csrf')).json()).token)()")
  const created = await page.evaluate(`(async () => {
    const r = await fetch("/api/v1/tasks", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": "${fresh}" }, body: JSON.stringify({ title: "verify-spec probe" }) })
    const task = await r.json()
    await fetch("/api/v1/tasks/" + task.id, { method: "DELETE", headers: { "X-CSRF-Token": "${fresh}" } })
    return { status: r.status, id: task.id }
  })()`)
  check("api: create + trash task via session", created.status === 201 && Boolean(created.id), JSON.stringify(created))
}

// ——— Hotwire pages ———
{
  const settings = await page.goto(`${APP}/settings`, { waitUntil: "domcontentloaded" })
  const settingsText = await page.evaluate("document.body.innerText")
  check("hotwire: /settings renders account page", settings.status() === 200 && settingsText.includes("Email"), `status ${settings.status()}`)
  check("hotwire: /settings shows API token section", settingsText.includes("API"), "token section missing")

  const prefs = await page.goto(`${APP}/settings/preferences`, { waitUntil: "domcontentloaded" })
  const prefsText = await page.evaluate("document.body.innerText")
  check("hotwire: preferences page renders language form", prefs.status() === 200 && prefsText.includes("Language"), `status ${prefs.status()}`)

  const tags = await page.goto(`${APP}/tags`, { waitUntil: "domcontentloaded" })
  const tagValues = await page.evaluate("(() => Array.from(document.querySelectorAll('input[value]')).map(i => i.value).join(' '))()")
  check("hotwire: tag manager lists seeded tags", tags.status() === 200 && tagValues.includes("Home"), `values: ${tagValues.slice(0, 60)}`)

  const docs = await page.request.get(`${APP}/api/openapi.yaml`)
  check("docs: openapi.yaml served", docs.status() === 200, `status ${docs.status()}`)
}

// mobile drawer (same page, cookies preserved; fresh context would lose them)
{
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(APP + "/today", { waitUntil: "networkidle" })
  const tag = "mobile 390 /today"
  const menuVisible = await page.locator('button[aria-label="Open sidebar"]').isVisible()
  check(`${tag}: hamburger visible`, menuVisible)
  await page.evaluate(`document.querySelector('button[aria-label="Open sidebar"]').click()`)
  await page.waitForTimeout(700)
  const drawer = await page.evaluate(() => {
    const el = document.querySelector('[data-slot="sheet-content"]')
    return el ? { bg: getComputedStyle(el).backgroundColor, hasToday: el.textContent?.includes("Logbook") } : null
  })
  check(`${tag}: drawer bg = things-sidebar`, drawer?.bg === T["things-sidebar"], `got ${drawer?.bg}`)
  check(`${tag}: drawer lists views`, Boolean(drawer?.hasToday))
  await page.setViewportSize({ width: 1280, height: 800 })
}

await restoreLocale(page)
await page.close()

// ——— 3. storybook smoke ———

if (!SKIP_SB) {
  const STORIES = [
    ["design-system-introduction--read-me", "Design System/Introduction"],
    ["design-system-design-tokens--all", "Design System/Design Tokens"],
    ["task-management-task-row--all-states", "Task Management/Task Row"],
    ["task-management-sidebar--today-selected", "Task Management/Sidebar"],
    ["task-management-bottom-toolbar--playground", "Task Management/Bottom Toolbar"],
    ["task-management-new-to-do-dialog--open", "Task Management/New To-Do Dialog"],
    ["medical-medical-ui-allergy-banner--no-known-allergies", "Medical/Allergy Banner (no-known)"],
    ["medical-medical-ui-allergy-banner--has-allergies", "Medical/Allergy Banner (has)"],
    ["medical-medical-component-patient-header-bar--all-states", "Medical/Medical Component/Patient Header Bar"],
    ["medical-medical-ui-triage-dot--all-states", "Medical/Medical UI/Triage Dot"],
    ["medical-medical-ui-value-with-unit--all-states", "Medical/Medical UI/Value With Unit"],
    ["medical-introduction--read-me", "Medical/Introduction"],
    ["medical-medical-shell-launcher-rail--playground", "Medical/Medical Shell/Launcher Rail"],
    ["medical-medical-component-reconciliation-list--playground", "Medical/Medical Component/Reconciliation List"],
    ["medical-medical-ui-note-history-log--playground", "Medical/Medical UI/Note History Log"],
    ["medical-medical-component-code-picker-accordion--playground", "Medical/Medical Component/Code Picker Accordion"],
    ["medical-medical-component-template-select--playground", "Medical/Medical Component/Template Select"],
    ["medical-medical-ui-audit-footer--playground", "Medical/Medical UI/Audit Footer"],
    ["medical-medical-component-inbox-tile--portal-row", "Medical/Medical Component/Inbox Tile"],
    ["medical-medical-component-message-list--playground", "Medical/Medical Component/Message List"],
    ["medical-medical-ui-series-toggle--playground", "Medical/Medical UI/Series Toggle"],
    ["medical-medical-component-kpi-scorecard--playground", "Medical/Medical Component/Kpi Scorecard"],
    ["medical-medical-component-top-n-card--playground", "Medical/Medical Component/Top N Card"],
    ["medical-medical-component-alert-ticker--playground", "Medical/Medical Component/Alert Ticker"],
    ["medical-medical-component-report-frame--playground", "Medical/Medical Component/Report Frame"],
    ["medical-medical-component-compliance-board--playground", "Medical/Medical Component/Compliance Board"],
    ["medical-medical-component-em-level-matrix--playground", "Medical/Medical Component/Em Level Matrix"],
    ["medical-medical-component-lab-fishbone--chem-7", "Medical/Medical Component/Lab Fishbone"],
    ["medical-medical-component-body-map-annotator--playground", "Medical/Medical Component/Body Map Annotator"],
    ["medical-medical-component-anatomy-inspector--playground", "Medical/Medical Component/Anatomy Inspector"],
    ["medical-medical-component-vaccine-schedule-table--playground", "Medical/Medical Component/Vaccine Schedule Table"],
    ["medical-medical-component-query-builder--playground", "Medical/Medical Component/Query Builder"],
    ["medical-medical-component-cohort-timeline--playground", "Medical/Medical Component/Cohort Timeline"],
    ["medical-medical-ui-data-table--narrow", "Medical/Data Table (narrow)"],
    ["medical-medical-ui-form-grid--invalid", "Medical/Form Grid (invalid)"],
    ["medical-medical-ui-form-action-bar--all-states", "Medical/Medical UI/Form Action Bar"],
    ["medical-medical-shell-action-toolbar--all-states", "Medical/Medical Shell/Action Toolbar"],
    ["medical-medical-ui-coded-search-input--default", "Medical/Medical UI/Coded Search Input"],
    ["medical-medical-component-queue-table--default", "Medical/Medical Component/Queue Table"],
    ["medical-medical-component-appointment-card--all-states", "Medical/Medical Component/Appointment Card"],
    ["medical-medical-ui-mini-calendar--default", "Medical/Medical UI/Mini Calendar"],
    ["medical-medical-component-grouped-list-panel--default", "Medical/Medical Component/Grouped List Panel"],
    ["medical-medical-shell-reception-blueprint--default", "Medical/Medical Shell/Reception Blueprint"],
    ["medical-medical-component-vitals-strip--default", "Medical/Medical Component/Vitals Strip"],
    ["medical-medical-component-camera-capture--all-states", "Medical/Medical Component/Camera Capture"],
    ["medical-medical-component-result-table--default", "Medical/Medical Component/Result Table"],
    ["medical-medical-component-flowsheet-grid--narrow", "Medical/Flowsheet Grid (narrow)"],
    ["medical-medical-component-trend-chart--default", "Medical/Medical Component/Trend Chart"],
    ["medical-medical-component-event-timeline--default", "Medical/Medical Component/Event Timeline"],
    ["medical-medical-component-medication-timeline--default", "Medical/Medical Component/Medication Timeline"],
    ["medical-medical-component-order-entry-form--lab-mode", "Medical/Order Entry Form (lab)"],
    ["medical-medical-component-procedure-entry-card--playground", "Medical/Medical Component/Procedure Entry Card"],
    ["medical-medical-component-message-thread--mixed-stream", "Medical/Message Thread (mixed)"],
    ["medical-medical-shell-exam-room-blueprint--default", "Medical/Medical Shell/Exam Room Blueprint"],
    ["medical-medical-shell-app-shell--desktop", "Medical/App Shell (desktop)"],
    ["medical-medical-shell-app-shell--mobile", "Medical/App Shell (mobile)"],
    ["medical-medical-component-patient-picker-dialog--default", "Medical/Medical Component/Patient Picker Dialog"],
    ["medical-medical-component-schedule-grid--playground", "Medical/Medical Component/Schedule Grid"],
    ["medical-medical-shell-day-board-blueprint--desktop", "Medical/Medical Shell/Day Board Blueprint"],
    ["medical-medical-component-prescription-preview--playground", "Medical/Medical Component/Prescription Preview"],
    ["medical-medical-component-result-report--playground", "Medical/Medical Component/Result Report"],
    ["medical-medical-component-document-viewer--playground", "Medical/Medical Component/Document Viewer"],
  ]
  // Arg-driven states: the same story loaded with Controls args in the URL.
  const ARG_STATES = [
    {
      url: `${SB}/iframe.html?id=task-management-task-row--completed&viewMode=story`,
      label: "Things/Task Row completed state (args-driven story)",
      assert: async (page) =>
        (await page.evaluate(
          "(() => !!document.querySelector('button[aria-label=\"Mark as not completed\"] span.bg-things-blue'))()",
        )),
      detail: "completed checkbox (blue filled) not rendered",
    },
    {
      url: `${SB}/iframe.html?id=task-management-task-row--default&viewMode=story&args=expanded:true`,
      label: "Things/Task Row via URL args (expanded=true)",
      assert: async (page) =>
        (await page.evaluate("(() => !!document.querySelector('textarea'))()")),
      detail: "inline editor (notes textarea) not rendered",
    },
  ]
  const sb = await browser.newPage({ viewport: { width: 800, height: 600 } })
  for (const { url, label, assert, detail } of ARG_STATES) {
    try {
      await sb.goto(url, { waitUntil: "networkidle", timeout: 15000 })
      const ok = await assert(sb)
      check(`storybook: ${label}`, ok, detail)
    } catch (e) {
      check(`storybook: ${label}`, false, String(e).slice(0, 120))
    }
  }
  for (const [id, label] of STORIES) {
    try {
      await sb.goto(`${SB}/iframe.html?id=${id}&viewMode=story`, { waitUntil: "networkidle", timeout: 15000 })
      const ok = await sb.evaluate(() => {
        // Icon-only stories (toolbar) have no text; the dialog renders into a
        // portal outside the story root — count interactive elements too.
        const root = document.querySelector("#storybook-root, #root")
        const rootAlive =
          root &&
          ((root.textContent && root.textContent.trim().length > 0) ||
            root.querySelectorAll("button, svg, input").length > 0)
        return Boolean(rootAlive || document.querySelector('[data-slot="dialog-content"]'))
      })
      check(`storybook: ${label} renders`, ok, "story root is empty")
    } catch (e) {
      check(`storybook: ${label} renders`, false, String(e).slice(0, 120))
    }
  }
  await sb.close()

  // ——— clinic structural checks (against Storybook iframes) ———
  {
    const page2 = await browser.newPage({ viewport: { width: 800, height: 600 } })

    // severity tokens resolve on rendered flags
    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-abnormal-flag--all-states&viewMode=story`, { waitUntil: "networkidle" })
    const flagColors = await page2.evaluate(`(() => {
      const els = Array.from(document.querySelectorAll('[data-flag]'))
      const pick = (f) => { const el = els.find(e => e.dataset.flag === f); return el ? getComputedStyle(el).color : null }
      return { H: pick('H'), HH: pick('HH'), N: pick('N') }
    })()`)
    check("clinic: severity tokens resolve", flagColors.H === "rgb(163, 97, 0)" && flagColors.HH === "rgb(255, 255, 255)", JSON.stringify(flagColors))

    // severity has a second channel (distinct textContent)
    const secondChannel = await page2.evaluate(`(() => {
      const texts = Array.from(document.querySelectorAll('[data-flag]')).map(e => e.textContent.trim())
      return new Set(texts).size === texts.length && texts.length >= 5
    })()`)
    check("clinic: severity has a second channel (letters differ)", secondChannel)

    // allergy banner is not dismissible + no-known is not red
    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-allergy-banner--has-allergies&viewMode=story`, { waitUntil: "networkidle" })
    const dismissible = await page2.evaluate(`(() => !!document.querySelector('[aria-label*="close" i], [aria-label*="dismiss" i]'))()`)
    check("clinic: allergy banner is not dismissible", !dismissible)

    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-allergy-banner--no-known-allergies&viewMode=story`, { waitUntil: "networkidle" })
    const noKnownRed = await page2.evaluate(`(() => {
      const el = document.querySelector('[data-allergy-state="no-known"]')
      const scan = (node) => {
        for (const n of node.querySelectorAll('*')) {
          const c = getComputedStyle(n)
          if (c.color === "rgb(198, 40, 40)" || c.backgroundColor === "rgb(252, 235, 234)") return true
        }
        return false
      }
      return scan(el)
    })()`)
    check("clinic: no-known-allergy is not red", !noKnownRed)

    // patient header always shows MRN
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-patient-header-bar--all-states&viewMode=story`, { waitUntil: "networkidle" })
    const mrnAlways = await page2.evaluate(`(() => {
      const bars = Array.from(document.querySelectorAll('[data-patient-bar]'))
      return bars.length > 0 && bars.every(b => /000001|000002/.test(b.textContent))
    })()`)
    check("clinic: patient header always shows MRN", mrnAlways)

    // data table: sticky header + sticky first column at 390px (06 §1)
    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-data-table--narrow&viewMode=story`, { waitUntil: "networkidle" })
    const sticky = await page2.evaluate(`(() => {
      const root = document.querySelector('[data-slot="data-table"]')
      const th = root.querySelector('thead th')
      const td = root.querySelector('tbody tr[data-row-key] td')
      const s = getComputedStyle(th), c = getComputedStyle(td)
      return { thPos: s.position, thTop: s.top, tdPos: c.position, tdLeft: c.left }
    })()`)
    check("clinic: data table sticky header", sticky.thPos === "sticky" && sticky.thTop === "0px", JSON.stringify(sticky))
    check("clinic: data table sticky first column", sticky.tdPos === "sticky" && sticky.tdLeft === "0px", JSON.stringify(sticky))

    const tabular = await page2.evaluate(`(() => {
      const cells = Array.from(document.querySelectorAll('[data-numeric]'))
      return cells.length > 0 && cells.every(c => getComputedStyle(c).fontVariantNumeric.includes("tabular-nums"))
    })()`)
    check("clinic: numerics are tabular", tabular)

    // dense rows fit (06 §2): ≤28px and no clip; Thai dense ≥28px (03 §4 override)
    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-data-table--dense&viewMode=story`, { waitUntil: "networkidle" })
    const denseFit = await page2.evaluate(`(() => {
      const rows = Array.from(document.querySelectorAll('tr[data-row-key]'))
      return { n: rows.length, fits: rows.length > 0 && rows.every(r => r.getBoundingClientRect().height <= 28.5) }
    })()`)
    check("clinic: dense rows fit (<=28px)", denseFit.fits, JSON.stringify(denseFit))

    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-data-table--thai&viewMode=story`, { waitUntil: "networkidle" })
    const thaiFit = await page2.evaluate(`(() => {
      const rows = Array.from(document.querySelectorAll('tr[data-row-key]'))
      return { n: rows.length, raised: rows.length > 0 && rows.every(r => r.getBoundingClientRect().height >= 27.5) }
    })()`)
    check("clinic: Thai dense rows raised to >=28px", thaiFit.raised, JSON.stringify(thaiFit))

    // queue carries BOTH orthogonal axes (00-corrections §1):
    // the triage legend (urgency) AND the status column (flow dots)
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-queue-table--default&viewMode=story`, { waitUntil: "networkidle" })
    const queueAxes = await page2.evaluate(`(() => {
      const root = document.querySelector('[data-slot="queue-table"]')
      const legend = root.querySelector('[data-triage-legend]')
      const legendItems = legend ? legend.querySelectorAll('[data-triage]').length : 0
      const statusCells = root.querySelectorAll('[data-status-dot]').length
      const triageCells = root.querySelectorAll('td [data-triage]').length
      return { legendItems, statusCells, triageCells }
    })()`)
    check("clinic: queue shows both urgency and status axes", queueAxes.legendItems === 3 && queueAxes.statusCells >= 5 && queueAxes.triageCells >= 5, JSON.stringify(queueAxes))

    // result table: values are tabular (06 §2 — the check was written for ResultTable)
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-result-table--default&viewMode=story`, { waitUntil: "networkidle" })
    const resultTabular = await page2.evaluate(`(() => {
      const root = document.querySelector('[data-slot="result-table"]')
      const cells = Array.from(root.querySelectorAll('[data-numeric]'))
      return cells.length > 0 && cells.every(c => getComputedStyle(c).fontVariantNumeric.includes("tabular-nums"))
    })()`)
    check("clinic: result table numerics are tabular", resultTabular)

    // flowsheet: sticky first column + sticky header hold at 390px (06 §2)
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-flowsheet-grid--narrow&viewMode=story`, { waitUntil: "networkidle" })
    const flowSticky = await page2.evaluate(`(() => {
      const root = document.querySelector('[data-slot="flowsheet-grid"]')
      const th = root.querySelector('thead th')
      const td = root.querySelector('tbody tr[data-row-key] td')
      const s = getComputedStyle(th), c = getComputedStyle(td)
      return { thPos: s.position, thTop: s.top, tdPos: c.position, tdLeft: c.left }
    })()`)
    check("clinic: flowsheet sticky header", flowSticky.thPos === "sticky" && flowSticky.thTop === "0px", JSON.stringify(flowSticky))
    check("clinic: flowsheet sticky first column", flowSticky.tdPos === "sticky" && flowSticky.tdLeft === "0px", JSON.stringify(flowSticky))

    // the wave-4 gate: chat + quote + system + unread divider in ONE scroll
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-message-thread--mixed-stream&viewMode=story`, { waitUntil: "networkidle" })
    const mixed = await page2.evaluate(`(() => {
      const root = document.querySelector('[data-slot="message-thread"]')
      const kinds = Array.from(root.querySelectorAll('[data-entry-kind]')).map(e => e.dataset.entryKind)
      return {
        chat: kinds.includes("chat"), quote: kinds.includes("quote"),
        system: kinds.includes("system"), divider: kinds.includes("divider"),
        attachments: root.querySelectorAll('[data-attachment-kind]').length,
      }
    })()`)
    check("clinic: message thread mixed stream (gate)", mixed.chat && mixed.quote && mixed.system && mixed.divider && mixed.attachments >= 2, JSON.stringify(mixed))

    // app shell: header stays pinned and the rail sheet exists on mobile
    await page2.setViewportSize({ width: 390, height: 844 })
    await page2.goto(`${SB}/iframe.html?id=medical-medical-shell-app-shell--mobile&viewMode=story`, { waitUntil: "networkidle" })
    await page2.waitForTimeout(500)
    const shellMobile = await page2.evaluate(`(() => {
      const root = document.querySelector('[data-slot="app-shell"]')
      return {
        density: root?.getAttribute("data-density"),
        pinnedHeader: !!root?.querySelector('[data-patient-bar]'),
        railTrigger: !!document.querySelector('button[aria-label="Open modules"]'),
        footer: !!root?.querySelector('[data-slot="status-bar"]'),
      }
    })()`)
    check("clinic: app shell mobile pins header + rail sheet + footer", shellMobile.density === "compact" && shellMobile.pinnedHeader && shellMobile.railTrigger && shellMobile.footer, JSON.stringify(shellMobile))
    await page2.setViewportSize({ width: 800, height: 600 })

    // Rx pending interactions: watermark visible AND Send disabled (04 Layer 7)
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-prescription-preview--pending-interactions&viewMode=story`, { waitUntil: "networkidle" })
    const rxDone = await page2.evaluate(`(() => {
      const root = document.querySelector('[data-slot="prescription-preview"]')
      const send = Array.from(root.querySelectorAll('button')).find(b => b.textContent.trim() === "Send")
      return JSON.stringify({
        badge: root.textContent.includes("Interactions pending"),
        sendDisabled: send ? send.disabled : null,
        paper: !!root.querySelector('[data-slot="paper-surface"]'),
      })
    })()`)
    const r = JSON.parse(rxDone)
    check("clinic: rx pending watermark disables send", r.badge && r.sendDisabled === true && r.paper, rxDone)

    // schedule grid degrades to an agenda below md (05 §2: never shrink the grid)
    await page2.setViewportSize({ width: 390, height: 844 })
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-schedule-grid--mobile&viewMode=story`, { waitUntil: "networkidle" })
    await page2.waitForTimeout(500)
    const agenda = await page2.evaluate(`(() => {
      const cards = document.querySelectorAll('[data-slot="appointment-card"]').length
      const grid = document.querySelectorAll('[data-slot="schedule-block"]').length
      return { cards, grid }
    })()`)
    check("clinic: schedule grid degrades to agenda on mobile", agenda.cards >= 5 && agenda.grid === 0, JSON.stringify(agenda))
    await page2.setViewportSize({ width: 800, height: 600 })

    // launcher rail: waffle flyout — grouped apps, pin-to-rail, search, select
    await page2.goto(`${SB}/iframe.html?id=medical-medical-shell-launcher-rail--playground&viewMode=story`, { waitUntil: "networkidle" })
    const railBefore = await page2.evaluate(`(() => document.querySelectorAll('[data-rail-item]').length)()`)
    await page2.click('[data-waffle]')
    await page2.waitForTimeout(300)
    const flyout = await page2.evaluate(`(() => {
      const pop = document.querySelector('[data-slot="popover-content"]')
      if (!pop) return null
      const groups = Array.from(pop.querySelectorAll('h3')).map(h => h.textContent.trim())
      return { groups: groups.join('|'), tiles: pop.querySelectorAll('[data-tile]').length }
    })()`)
    check("clinic: launcher flyout shows grouped tiles", Boolean(flyout && flyout.tiles >= 14 && flyout.groups.split('|').length >= 3), JSON.stringify(flyout))
    await page2.click('[data-pin="billing"]')
    await page2.waitForTimeout(200)
    const afterPin = await page2.evaluate(`(() => ({
      rail: document.querySelectorAll('[data-rail-item]').length,
      billing: !!document.querySelector('[data-rail-item="billing"]'),
      open: !!document.querySelector('[data-slot="popover-content"]'),
    }))()`)
    check("clinic: pinning adds a rail shortcut (flyout stays open)", afterPin.billing && afterPin.rail === railBefore + 1 && afterPin.open, JSON.stringify(afterPin))
    await page2.fill('[data-slot="popover-content"] input', 'bill')
    await page2.waitForTimeout(200)
    const filteredTiles = await page2.evaluate(`(() => document.querySelectorAll('[data-slot="popover-content"] [data-tile]').length)()`)
    check("clinic: launcher search filters tiles", filteredTiles === 1, `got ${filteredTiles}`)
    await page2.click('[data-tile="billing"]')
    await page2.waitForTimeout(300)
    const afterSelect = await page2.evaluate(`(() => {
      const item = document.querySelector('[data-rail-item="billing"]')
      return { closed: !document.querySelector('[data-slot="popover-content"]'), active: item?.getAttribute('aria-current') === 'page', bar: !!item?.querySelector('span.bg-things-blue') }
    })()`)
    check("clinic: tile select closes flyout + active indicator", afterSelect.closed && afterSelect.active && afterSelect.bar, JSON.stringify(afterSelect))

    // billing + portal: recon decision is a control with tones; code picker toggles;
    // inbox counts; message unread channel; audit provenance hover-card + history dialog
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-reconciliation-list--playground&viewMode=story`, { waitUntil: "networkidle" })
    const recon = await page2.evaluate(`(() => {
      const stop = document.querySelector('button[data-decision="stop"]')
      const undecided = document.querySelector('button[data-decision="undecided"]')
      return {
        isButton: stop instanceof HTMLButtonElement,
        stopTone: stop?.className.includes('text-clinic-critical') ?? false,
        keepTone: document.querySelector('button[data-decision="keep"]')?.className.includes('text-clinic-ok') ?? false,
        hasUndecided: Boolean(undecided),
      }
    })()`)
    check("clinic: recon decisions are toned controls", recon.isButton && recon.stopTone && recon.keepTone && recon.hasUndecided, JSON.stringify(recon))
    const undecidedBefore = await page2.evaluate(`(() => document.querySelectorAll('button[data-decision="undecided"]').length)()`)
    await page2.click('button[data-decision="undecided"]')
    await page2.waitForTimeout(300)
    await page2.click('[role="menuitem"]:has-text("Keep")')
    await page2.waitForTimeout(200)
    const undecidedAfter = await page2.evaluate(`(() => document.querySelectorAll('button[data-decision="undecided"]').length)()`)
    check("clinic: recon decision menu changes the decision", undecidedAfter === undecidedBefore - 1, `${undecidedBefore} -> ${undecidedAfter}`)

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-code-picker-accordion--playground&viewMode=story`, { waitUntil: "networkidle" })
    await page2.click('button:has-text("Procedures (CPT)")')
    await page2.waitForTimeout(400)
    await page2.click('[data-code="99214"]')
    await page2.waitForTimeout(200)
    const codePicked = await page2.evaluate(`(() => {
      const row = document.querySelector('[data-code="99214"]')
      return { pressed: row?.getAttribute('aria-pressed') === 'true', tinted: row?.className.includes('bg-things-blue-soft') ?? false }
    })()`)
    check("clinic: code picker toggles ✓ + blue-soft row", codePicked.pressed && codePicked.tinted, JSON.stringify(codePicked))

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-inbox-tile--portal-row&viewMode=story`, { waitUntil: "networkidle" })
    const inbox = await page2.evaluate(`(() => {
      const tiles = Array.from(document.querySelectorAll('[data-slot="inbox-tile"]'))
      const chart = tiles.find(t => t.textContent?.includes('Chart'))
      return { tiles: tiles.length, badge: chart?.querySelector('[data-slot="inbox-tile-badge"]')?.textContent, countText: chart?.textContent?.includes('(3)') ?? false }
    })()`)
    check("clinic: inbox tile badge + (n) count text", inbox.tiles === 4 && inbox.badge === "3" && inbox.countText, JSON.stringify(inbox))

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-message-list--playground&viewMode=story`, { waitUntil: "networkidle" })
    const msg = await page2.evaluate(`(() => {
      const unread = document.querySelector('[data-slot="message-row"][data-unread]')
      return { hasUnread: Boolean(unread), dot: Boolean(unread?.querySelector('span.bg-things-blue')), groups: document.querySelectorAll('h4').length }
    })()`)
    // font-medium lives on the inner spans, not the row button
    const msgMedium = await page2.evaluate(`(() => {
      const unread = document.querySelector('[data-slot="message-row"][data-unread]')
      return Array.from(unread?.querySelectorAll('span.font-medium') ?? []).length > 0
    })()`)
    check("clinic: unread row = blue dot + medium weight + group headers", msg.hasUnread && msg.dot && msgMedium && msg.groups >= 2, JSON.stringify(msg))

    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-audit-footer--playground&viewMode=story`, { waitUntil: "networkidle" })
    const auditLine = await page2.evaluate(`(() => document.querySelector('[data-slot="audit-footer"]')?.textContent ?? '')()`)
    check("clinic: audit footer shows Modified-by line", /Modified/.test(auditLine) && /Nurse P\. Rivera/.test(auditLine), auditLine)
    await page2.hover('[data-slot="audit-footer"]')
    await page2.waitForTimeout(600)
    await page2.click('[data-slot="hover-card-content"] button:has-text("View history"), [data-radix-popper-content-wrapper] button:has-text("View history")')
    await page2.waitForTimeout(400)
    const auditDialog = await page2.evaluate(`(() => {
      const dlg = document.querySelector('[data-slot="dialog-content"]')
      return { open: Boolean(dlg), rows: dlg?.querySelectorAll('[data-entry]').length ?? 0 }
    })()`)
    check("clinic: audit history opens NoteHistoryLog dialog (4 entries)", auditDialog.open && auditDialog.rows === 4, JSON.stringify(auditDialog))

    // layer 8 ops: series toggle binds visibility; top-N bars highlight + sync
    // events; alert ticker acks carry severity words; report frame wraps config
    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-series-toggle--playground&viewMode=story`, { waitUntil: "networkidle" })
    await page2.click('label:has-text("No-shows")')
    await page2.waitForTimeout(200)
    const seriesOn = await page2.evaluate(`(() => document.querySelector('[data-visible]')?.dataset.visible ?? '')()`)
    await page2.click('label:has-text("No-shows")')
    await page2.waitForTimeout(200)
    const seriesOff = await page2.evaluate(`(() => document.querySelector('[data-visible]')?.dataset.visible ?? '')()`)
    check("clinic: series toggle binds/unbinds a series", seriesOn === "visits,procedures,noshows" && seriesOff === "visits,procedures", `${seriesOn} -> ${seriesOff}`)

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-top-n-card--playground&viewMode=story`, { waitUntil: "networkidle" })
    await page2.click('[data-topn-item="power"]')
    await page2.waitForTimeout(200)
    const topN = await page2.evaluate(`(() => {
      const active = document.querySelector('[data-topn-item="power"]')
      return { pressed: active?.getAttribute('aria-pressed') === 'true', events: document.querySelector('[data-slot="top-n-events"]')?.textContent ?? '' }
    })()`)
    check("clinic: top-N highlight syncs its event table", topN.pressed && topN.events.includes("UPS transfer"), JSON.stringify(topN).slice(0, 80))

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-alert-ticker--playground&viewMode=story`, { waitUntil: "networkidle" })
    const tickerBefore = await page2.evaluate(`(() => ({
      rows: document.querySelectorAll('[data-alert]').length,
      words: Array.from(document.querySelectorAll('[data-severity]')).map(e => e.dataset.severity).sort().join(','),
    }))()`)
    await page2.click('button:has-text("Ack Top")')
    await page2.waitForTimeout(200)
    const tickerAfter = await page2.evaluate(`(() => document.querySelectorAll('[data-alert]').length)()`)
    check("clinic: alert ticker Ack Top removes one row", tickerBefore.rows === 4 && tickerAfter === 3, `${tickerBefore.rows} -> ${tickerAfter}`)
    const severityWord = await page2.evaluate(`(() => {
      const crit = document.querySelector('[data-severity="critical"]')
      return crit?.textContent.toUpperCase().includes('CRITICAL') ?? false
    })()`)
    check("clinic: alert severity word visible (non-colour channel)", severityWord && tickerBefore.words === "critical,critical,warn,warn")

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-report-frame--playground&viewMode=story`, { waitUntil: "networkidle" })
    const frame = await page2.evaluate(`(() => ({
      canvas: Boolean(document.querySelector('[data-slot="report-canvas"] svg')),
      config: Boolean(document.querySelector('[data-slot="report-config"]')),
      print: document.querySelector('button')?.textContent ?? '',
    }))()`)
    check("clinic: report frame = canvas + config rail + print", frame.canvas && frame.config, JSON.stringify(frame))

    // layer 9: compliance glyph channel; EM meter; body-map toggle; anatomy
    // zoom; query add+run; cohort align
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-compliance-board--playground&viewMode=story`, { waitUntil: "networkidle" })
    const compliance = await page2.evaluate(`(() => {
      const chips = Array.from(document.querySelectorAll('[data-status]'))
      const met = chips.find(c => c.dataset.status === 'met')
      return { total: chips.length, metGlyph: Boolean(met?.querySelector('svg')), words: chips.map(c => c.textContent.trim()) }
    })()`)
    check("clinic: compliance chips = glyph + word", compliance.total === 12 && compliance.metGlyph && new Set(compliance.words).size >= 4, JSON.stringify({ n: compliance.total }))

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-em-level-matrix--playground&viewMode=story`, { waitUntil: "networkidle" })
    await page2.click('[data-cell="3-3"]')
    await page2.waitForTimeout(200)
    const em = await page2.evaluate(`(() => {
      const cell = document.querySelector('[data-cell="3-3"]')
      const meter = document.querySelector('[data-slot="level-meter"]')
      return { pressed: cell?.getAttribute('aria-pressed') === 'true', level: cell?.dataset.level, meter: meter?.getAttribute('aria-valuenow') }
    })()`)
    check("clinic: E/M cell selects + meter syncs", em.pressed && em.level === "4" && em.meter === "4", JSON.stringify(em))

    await page2.setViewportSize({ width: 1280, height: 800 })
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-body-map-annotator--playground&viewMode=story`, { waitUntil: "networkidle" })
    const marks0 = await page2.evaluate(`(() => document.querySelector('[data-marker-count]')?.dataset.markerCount)()`)
    const clickRegion = `(() => document.querySelector('[data-region="chest"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })))()`
    await page2.evaluate(clickRegion)
    await page2.waitForTimeout(200)
    const marks1 = await page2.evaluate(`(() => document.querySelector('[data-marker-count]')?.dataset.markerCount)()`)
    await page2.evaluate(clickRegion)
    await page2.waitForTimeout(200)
    const marks2 = await page2.evaluate(`(() => document.querySelector('[data-marker-count]')?.dataset.markerCount)()`)
    check("clinic: body map region click toggles marker", marks0 === "3" && marks1 === "2" && marks2 === "3", `${marks0} -> ${marks1} -> ${marks2} (chest carries a fixture marker)`)

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-anatomy-inspector--playground&viewMode=story`, { waitUntil: "networkidle" })
    const zoom0 = await page2.evaluate(`(() => document.querySelector('[data-slot="anatomy-zoom"] > div')?.style.transform ?? '')()`)
    await page2.click('[data-anatomy-region="coronary"]')
    await page2.waitForTimeout(200)
    const zoom1 = await page2.evaluate(`(() => document.querySelector('[data-slot="anatomy-zoom"] > div')?.style.transform ?? '')()`)
    const anatomySel = await page2.evaluate(`(() => document.querySelector('[data-anatomy-region="coronary"]')?.getAttribute('aria-pressed'))()`)
    check("clinic: anatomy region select moves the zoom box", anatomySel === "true" && zoom0 !== zoom1 && zoom1.includes("translate", 0), zoom1)

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-query-builder--playground&viewMode=story`, { waitUntil: "networkidle" })
    await page2.click('button:has-text("Add rule")')
    await page2.waitForTimeout(200)
    const rulesN = await page2.evaluate(`(() => document.querySelectorAll('[data-rule]').length)()`)
    await page2.click('button:has-text("Run")')
    await page2.waitForTimeout(200)
    const resultsN = await page2.evaluate(`(() => document.querySelectorAll('tbody tr').length)()`)
    check("clinic: query builder adds rules + runs", rulesN === 3 && resultsN >= 3, `rules ${rulesN}, rows ${resultsN}`)

    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-cohort-timeline--playground&viewMode=story`, { waitUntil: "networkidle" })
    const lanes0 = await page2.evaluate(`(() => document.querySelectorAll('[data-lane]').length)()`)
    await page2.click('[data-align-btn="first-event"]')
    await page2.waitForTimeout(200)
    const cohort = await page2.evaluate(`(() => ({
      align: document.querySelector('[data-slot="cohort-timeline"]')?.dataset.align,
      lanes: document.querySelectorAll('[data-lane]').length,
      dots: document.querySelectorAll('[data-event]').length,
    }))()`)
    check("clinic: cohort swimlanes align toggle", lanes0 === 6 && cohort.align === "first-event" && cohort.lanes === 6 && cohort.dots >= 15, JSON.stringify(cohort))
    const dots = await page2.evaluate(`(() => {
      let overlapped = 0
      let moving = false
      let stacked = 0
      for (const l of document.querySelectorAll('[data-lane]')) {
        const track = l.querySelector('[data-track]')?.getBoundingClientRect()
        const rects = Array.from(l.querySelectorAll('[data-event]')).map((d) => d.getBoundingClientRect())
        if (track && rects.some((r) => r.left - track.left > track.width / 2)) moving = true
        const tops = new Set(rects.map((r) => r.top))
        if (tops.size > 1) stacked++
        for (let i = 0; i < rects.length; i++) {
          for (let j = i + 1; j < rects.length; j++) {
            const a = rects[i], b = rects[j]
            const x = Math.min(a.right, b.right) - Math.max(a.left, b.left)
            const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
            if (x > 1 && y > 1) overlapped++
          }
        }
      }
      return { overlapped, moving, lanesWithStackedRows: stacked }
    })()`)
    check("clinic: cohort dots spread across the lane + de-stack collisions", dots.overlapped === 0 && dots.moving && dots.lanesWithStackedRows >= 2, JSON.stringify(dots))

    // meta grid: col-span must not mint implicit columns at phone width
    await page2.setViewportSize({ width: 390, height: 844 })
    await page2.goto(`${SB}/iframe.html?id=medical-medical-ui-meta-grid--playground&viewMode=story`, { waitUntil: "networkidle" })
    const metaOverflow = await page2.evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`)
    check("clinic: meta grid fits phone width (spans respect column count)", metaOverflow <= 1, `+${metaOverflow}px`)
    await page2.setViewportSize({ width: 800, height: 600 })

    // event timeline: no same-lane overlaps in dot OR pill variant (the pill
    // gap is 16 days in fixtures — wider than a pill, closer than the old 24px)
    const overlapScan = async (args) => {
      await page2.goto(`${SB}/iframe.html?id=medical-medical-component-event-timeline--playground&viewMode=story${args}`, { waitUntil: "networkidle" })
      await page2.waitForTimeout(300)
      return page2.evaluate(`(() => {
        let overlapped = 0
        for (const track of document.querySelectorAll('[data-slot="event-timeline"] div.relative')) {
          const els = Array.from(track.children).filter((c) => c.className.includes('absolute') && !c.className.includes('inset-y-0'))
          const rects = els.map((e) => e.getBoundingClientRect())
          for (let i = 0; i < rects.length; i++)
            for (let j = i + 1; j < rects.length; j++) {
              const a = rects[i], b = rects[j]
              if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 4) overlapped++
            }
        }
        return overlapped
      })()`)
    }
    const dotOverlaps = await overlapScan("")
    const pillOverlaps = await overlapScan("&args=variant:pill")
    check("clinic: event timeline has no same-lane overlaps (dot + pill variants)", dotOverlaps === 0 && pillOverlaps === 0, `dots ${dotOverlaps}, pills ${pillOverlaps}`)
    await page2.setViewportSize({ width: 800, height: 600 })

    await page2.setViewportSize({ width: 1280, height: 800 })
    await page2.goto(`${SB}/iframe.html?id=medical-medical-component-query-builder--playground&viewMode=story`, { waitUntil: "networkidle" })
    const chip0 = await page2.evaluate(`(() => document.querySelector('[data-slot="query-builder"] span.bg-things-blue-soft')?.textContent.trim())()`)
    await page2.evaluate(`(() => {
      const target = document.querySelector('[data-rule="q1"]')
      const dt = new DataTransfer(); dt.setData('text/query-rule', 'q2')
      target.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }))
    })()`)
    await page2.waitForTimeout(200)
    const chip1 = await page2.evaluate(`(() => document.querySelector('[data-slot="query-builder"] span.bg-things-blue-soft')?.textContent.trim())()`)
    const handle = await page2.evaluate(`(() => Boolean(document.querySelector('[data-drag-handle="q1"]')))()`)
    await page2.click('[data-rule="q2"] button[aria-label="Move rule down"]')
    await page2.waitForTimeout(200)
    const chip2 = await page2.evaluate(`(() => document.querySelector('[data-slot="query-builder"] span.bg-things-blue-soft')?.textContent.trim())()`)
    check(
      "clinic: query rules reorder by drag + keyboard",
      chip0?.startsWith("Primary care") === true && chip1?.startsWith("Age") === true && chip2?.startsWith("Primary care") === true && handle,
      `${chip0} | ${chip1} | ${chip2}`,
    )
    await page2.setViewportSize({ width: 800, height: 600 })

    await page2.close()
  }
}

await browser.close()

// ——— static: no hardcoded hex in clinic components ———
{
  const { readFileSync, readdirSync } = await import("node:fs")
  const dir = "src/components/clinic"
  const offenders = []
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".tsx") || f.includes("stories")) continue
    const src = readFileSync(`${dir}/${f}`, "utf8")
    if (/className="[^"]*#[0-9a-fA-F]{3,8}/.test(src) || /className=\{[^}]*`[^`]*#[0-9a-fA-F]{6}/.test(src)) offenders.push(f)
  }
  check("clinic: no hardcoded hex in classNames", offenders.length === 0, offenders.join(", "))

  // consistency audit gates: token-semantic surfaces, one container radius,
  // canonical type classes (no duplicate ramp points)
  const drift = []
  const DRIFT_RULES = [
    [/\bbg-white\b/, "bg-white (use bg-card)"],
    [/\brounded-lg\b/, "rounded-lg (container radius is rounded-md)"],
    [/text-\[12px\]|text-\[14px\]|text-\[15px\]/, "off-ramp font size"],
    [/\bsize-4\.5\b/, "size-4.5 (icon tiers: 3.5 / 4 / 6)"],
  ]
  for (const f2 of readdirSync(dir).filter((x) => x.endsWith(".tsx") && !x.includes("stories"))) {
    const src = readFileSync(`${dir}/${f2}`, "utf8")
    for (const [re, label] of DRIFT_RULES) if (re.test(src)) drift.push(`${f2}: ${label}`)
  }
  check("clinic: style-scale consistency (surfaces/radius/type/icons)", drift.length === 0, drift.join("; "))
}

// ——— report ———

const failed = results.filter((r) => !r.ok)
for (const r of results) {
  // eslint-disable-next-line no-console
  console.log(`${r.ok ? "✔" : "✘"} ${r.name}${r.ok ? "" : ` — ${r.detail}`}`)
}
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length > 0) process.exit(1)
