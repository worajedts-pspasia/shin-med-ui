#!/usr/bin/env node
/**
 * shin-med-ui MCP server — lets local AI agents talk to the design system
 * over the Model Context Protocol (stdio).
 *
 * Tools:
 *   list_components      — every component with its story group + docs blurb
 *   get_component        — one component: files, exports, props, stories
 *   list_tokens          — the full things and clinic token table (css+mirror)
 *   get_token            — one token: hex, mirror value, where it's defined
 *   search_docs          — grep the living spec in docs/
 *   verify               — typecheck (fast) or the full verify-spec suite
 *
 * Run:  node tools/mcp-server.mjs   (or `npm run mcp`)
 * Register with any MCP client over stdio, e.g. in the agent's mcp config:
 *   { "shin-med-ui": { "command": "node", "args": ["<repo>/tools/mcp-server.mjs"] } }
 */
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SRC = path.join(ROOT, "src")

// ——— data helpers ———————————————————————————————————————————————

const COMPONENT_DIRS = ["clinic", "things", "ui"]

function storyFiles() {
  const out = []
  for (const dir of COMPONENT_DIRS) {
    const base = path.join(SRC, "components", dir)
    if (!existsSync(base)) continue
    for (const f of readdirSync(base)) {
      if (f.endsWith(".stories.tsx")) out.push(path.join(base, f))
    }
  }
  // design-system stories live at src root
  for (const f of readdirSync(SRC)) if (f.endsWith(".stories.tsx")) out.push(path.join(SRC, f))
  return out
}

let docsJson = {}
{
  const p = path.join(SRC, "i18n", "docs", "en.json")
  if (existsSync(p)) docsJson = JSON.parse(readFileSync(p, "utf8"))
}

function parseStories() {
  const comps = []
  for (const sf of storyFiles()) {
    const s = readFileSync(sf, "utf8")
    const title = s.match(/title:\s*"([^"]+)"/)?.[1]
    if (!title) continue
    const docsId = s.match(/docsDesc\("([^"]+)"\)/)?.[1]
    const desc = docsId ? (docsJson[docsId] ?? "") : ""
    const stories = [...s.matchAll(/export const (\w+):\s*(?:StoryObj|Story)/g)].map((m) => m[1])
    const compFile = sf.replace(".stories.tsx", ".tsx")
    comps.push({
      group: title.includes("/") ? title.slice(0, title.lastIndexOf("/")) : "",
      name: title.split("/").pop(),
      storyFile: path.relative(ROOT, sf),
      componentFile: existsSync(compFile) ? path.relative(ROOT, compFile) : "(story-only)",
      docs: desc.replace(/\\n/g, " ").split("**Watch out:**")[0].trim(),
      watchOut: desc.includes("**Watch out:**") ? desc.split("**Watch out:**")[1].trim() : "",
      stories,
    })
  }
  return comps
}

function parseTokens() {
  const css = readFileSync(path.join(SRC, "theme.css"), "utf8")
  const cssTokens = Object.fromEntries(
    [...css.matchAll(/--color-((?:things|clinic)-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2].toLowerCase()]),
  )
  const json = JSON.parse(readFileSync(path.join(SRC, "design-tokens.json"), "utf8"))
  const mirror = {}
  for (const g of json.groups ?? []) for (const t of g.tokens ?? []) mirror[t.name] = String(t.value).toLowerCase()
  return { cssTokens, mirror }
}

function searchDocs(query) {
  const hits = []
  const walk = (dir) => {
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name)
      if (f.isDirectory()) walk(p)
      else if (/\.(md|json)$/.test(f.name)) {
        const lines = readFileSync(p, "utf8").split("\n")
        lines.forEach((ln, i) => {
          if (ln.toLowerCase().includes(query.toLowerCase()))
            hits.push(`${path.relative(ROOT, p)}:${i + 1}: ${ln.trim().slice(0, 160)}`)
        })
      }
    }
  }
  walk(path.join(ROOT, "docs"))
  return hits.slice(0, 40)
}

// ——— server ————————————————————————————————————————————————————

const server = new McpServer({ name: "shin-med-ui", version: "0.1.0" })

server.tool(
  "list_components",
  "Every component in the design system with its story group, docs blurb and Watch-out note",
  {}, // hmm: zod schema optional
  async () => {
    const comps = parseStories()
    const byGroup = {}
    for (const c of comps) byGroup[c.group] ??= []
    for (const c of comps) byGroup[c.group].push(c)
    const lines = []
    for (const g of Object.keys(byGroup).sort()) {
      lines.push(`## ${g || "(ungrouped)"} (${byGroup[g].length})`)
      for (const c of byGroup[g].sort((a, b) => a.name.localeCompare(b.name)))
        lines.push(`- ${c.name} — ${c.docs.split(". ")[0]}. stories: ${c.stories.join(", ") || "—"} [${c.componentFile}]`)
    }
    return { content: [{ type: "text", text: lines.join("\n") || "no components found" }] }
  },
)

server.tool(
  "get_component",
  "One component by story name: files, docs, Watch-out note, stories, exported props",
  { name: z.string().describe("Story name, e.g. 'Reconciliation List' or 'Task Row'") },
  async ({ name }) => {
    const comps = parseStories()
    const c = comps.find((x) => x.name.toLowerCase() === name.toLowerCase())
      ?? comps.find((x) => x.name.toLowerCase().includes(name.toLowerCase()))
    if (!c) return { content: [{ type: "text", text: `no component matches '${name}'` }] }
    let props = []
    const cf = path.join(ROOT, c.componentFile)
    if (existsSync(cf)) {
      const src = readFileSync(cf, "utf8")
      const block =
        src.match(/(?:interface|type)\s+\w*Props\w*\s*(?:=|{)([\s\S]{0,2500}?})(?:\s|$)/) ??
        src.match(/export function \w+\([\s\S]*?\):\s*{([\s\S]{0,2500}?})\n}/)
      if (block) props = [...block[1].matchAll(/^\s{2,}(\w+)(\?)?:/gm)].map((m) => m[1] + (m[2] ? "?" : ""))
    }
    const text = [
      `# ${c.group}/${c.name}`,
      `component: ${c.componentFile}   stories: ${c.storyFile}`,
      c.docs,
      c.watchOut ? `**Watch out:** ${c.watchOut}` : "",
      `stories: ${c.stories.join(", ")}`,
      props.length ? `props: ${props.join(", ")}` : "",
    ].filter(Boolean).join("\n")
    return { content: [{ type: "text", text }] }
  },
)

server.tool(
  "list_tokens",
  "The full design-token table: every things and clinic color with its CSS and mirror values",
  {},
  async () => {
    const { cssTokens, mirror } = parseTokens()
    const names = [...new Set([...Object.keys(cssTokens), ...Object.keys(mirror)])].sort()
    const lines = names.map((n) => {
      const c = cssTokens[n] ?? "—"
      const m = mirror[n] ?? "—"
      const flag = c === m ? "" : c !== "—" && m !== "—" ? "  (!! MIRROR MISMATCH)" : ""
      return `${n}: css ${c} · mirror ${m}${flag}`
    })
    return { content: [{ type: "text", text: `${names.length} tokens\n` + lines.join("\n") }] }
  },
)

server.tool(
  "get_token",
  "One token by name: css value, mirror value, and whether they agree",
  { name: z.string().describe("e.g. 'clinic-critical' or 'things-blue'") },
  async ({ name }) => {
    const { cssTokens, mirror } = parseTokens()
    const c = cssTokens[name]
    const m = mirror[name]
    if (!c && !m) {
      const near = Object.keys({ ...cssTokens, ...mirror }).filter((k) => k.includes(name)).slice(0, 8)
      return { content: [{ type: "text", text: `no token '${name}'. near matches: ${near.join(", ") || "none"}` }] }
    }
    return {
      content: [{
        type: "text",
        text: `${name}\ncss (src/theme.css): ${c ?? "missing"}\nmirror (src/design-tokens.json): ${m ?? "missing"}\nagreement: ${c === m ? "ok" : "MISMATCH"}`,
      }],
    }
  },
)

server.tool(
  "search_docs",
  "Grep the living spec (docs/) for a term; returns file:line matches",
  { query: z.string().describe("search term, e.g. 'severity' or 'fishbone'") },
  async ({ query }) => {
    const hits = searchDocs(query)
    return { content: [{ type: "text", text: hits.length ? hits.join("\n") : `no matches for '${query}' in docs/` }] }
  },
)

server.tool(
  "verify",
  "Run verification: typecheck by default; full=the ~300-check verify-spec suite (needs Rails :3000 + Storybook :6006 running)",
  { full: z.boolean().optional().describe("run the full verify-spec suite too") },
  async ({ full }) => {
    const run = (cmd) => {
      try {
        return execFileSync(cmd, { cwd: ROOT, shell: true, encoding: "utf8", timeout: 600_000, stdio: ["ignore", "pipe", "pipe"] }).slice(-4000)
      } catch (e) {
        return `FAILED:\n${String(e.stdout || e.message).slice(-4000)}`
      }
    }
    const tsc = run("npx tsc --noEmit")
    const tscOk = !tsc.startsWith("FAILED")
    let report = `typecheck: ${tscOk ? "PASS" : tsc}`
    if (full) report += `\n\nverify-spec:\n${run("node tools/verify-spec.mjs").slice(-4000)}`
    return { content: [{ type: "text", text: report }] }
  },
)

// ——— go ————————————————————————————————————————————————————————
const transport = new StdioServerTransport()
await server.connect(transport)
