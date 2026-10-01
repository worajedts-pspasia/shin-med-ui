# shin-med-ui

The design system for the clinic and task-management product family: **~450 stories** of
React 19 components — a full shadcn/ui registry vendored and Things-themed, a
clinical layer of 97 components (from patient identity to the four-pane clinic
shell), the token set they all share, and the verifier that keeps them honest.
Runs standalone in Storybook; consumed by apps as a package (first consumer:
**[Sample Tasks UI](https://github.com/worajedts-pspasia/Sample-Task-UI)**, the Rails task-management app).

## Quickstart

```bash
npm install
npm run storybook        # http://localhost:6006
npm run typecheck        # tsc --noEmit
npm run verify:spec      # targets via SPEC_TARGET_URL / SPEC_STORYBOOK_URL (default localhost:3000 / 6006)
```

## The sidebar map

| Group | What lives there |
|---|---|
| **Design System** | tokens, typography — the ground truth demo |
| **UI / Display · Input · Navigation · Containers · Chat** | the vendored shadcn primitives, bucketed |
| **Charts** | Area, Bar, Line, Donut, Radial, Sparkline |
| **Recipes** | compositions of existing components, registered as stories |
| **Medical UI** | clinic atoms & molecules: formatters, flags, dots, pills, form kit, inputs, `DataTable` |
| **Medical Shell** | frames: `AppShell`, both rails, panels, `PaperSurface`, the three screen blueprints |
| **Medical Component** | clinic organisms: queues, schedules, results, timelines, orders, documents, messaging, specialist tools |
| **Task Management** | the task-manager family (task rows, sidebar, dialogs…) |

Every group sorts A–Z; every component has a Docs page (purpose, when to reach
for it, a **Watch out** callout).

## Where things live

- **Tokens** — `src/theme.css` (the `@theme` block; import-free so consumers can
  inline it) + `src/index.css` (the standalone chain this repo's Storybook
  uses) + `src/design-tokens.json` (the mirror the verifier cross-checks).
- **Components** — `src/components/{ui,things,clinic}/`, stories colocated.
- **Category palette & style conventions** — `src/components/clinic/tokens.ts`
  (the comment header is the conventions card: surfaces, radii, type ramp,
  icon tiers).
- **Fixtures** — `src/fixtures/` (deterministic, PHI-free, EN+TH patients).
- **i18n** — `src/i18n/{en,th,ja}.json` + `src/lib/i18n-shim.ts`.
- **Spec** — `docs/spec/` (the living, adjudicated spec; analyzed
  products are referred to generically and no screenshots are kept in the repo).
- **Verifier** — `tools/verify-spec.mjs` (~300 checks: token mirror, live
  route compliance, every Storybook story, channel discipline, density,
  mobile degradation, drag interactions, print states).

## Contribution rules

1. **Colors are tokens only** — `things-*` / `clinic-*`; no raw hex in
   classNames, no Tailwind default palette. New color ⇒ `theme.css` **and**
   `design-tokens.json` in the same change (the verifier enforces the mirror).
2. **Severity means severity.** `clinic-*` is clinical judgment; flow,
   categories and navigation use `things-*`. Never the other way around.
3. **Color never works alone** — every severity signal carries a glyph, letter
   or shape (the Monochrome stories prove it).
4. **Stay on the scale** — the drift gate blocks `bg-white`, `rounded-lg`,
   off-ramp font sizes and non-tier icon sizes. See the conventions card in
   `clinic/tokens.ts`.
5. **Sidebar stays A–Z** within its fixed group order; new components get a
   Docs page (`tags: ["autodocs"]`) with purpose + **Watch out**.
6. **Fixtures stay deterministic** — fixed ISO dates, no `Date.now()`, no
   randomness, PHI-free.
7. Stories are new files; vendored `ui/*.tsx` primitives are never edited.
8. **No password components.** The clinic product signs in by email code,
   magic link or passkey — never add password fields or password-rule
   components (issue #1 §6). Composition patterns live under the
   **Recipes** group, registered as stories, not components.

## Consumer guide (how an app uses this package)

[Sample Tasks UI](https://github.com/worajedts-pspasia/Sample-Task-UI) (the Rails app) is the reference wiring — copy these five decisions:

1. **Install** — `"shin-med-ui": "file:../shin-med-ui"` (or a git URL). npm
   symlinks the folder; the package keeps its own `node_modules` so its
   Storybook still runs standalone.
2. **Declare what your app imports directly** — npm does not hoist the
   package's deps into your tree. Anything your own code imports (`react`,
   `react-query`, `lucide-react`…) goes in your `package.json` too.
3. **Dedupe the shared runtime** — the package resolves its own copies of
   libs; without dedupe you get two `@tanstack/react-query` instances and a
   broken context. Generate the list from the manifest (see
   Sample Tasks UI's `vite.config.ts`).
4. **`@/` resolution** — Sample Tasks UI enumerates its app-local modules as
   regex aliases and falls back to this package's `src/` for everything else
   (plus a resolver plugin that outranks the vite-ruby alias).
   `tsconfig.json` paths mirror the order for typechecking.
5. **Tailwind** — your app owns a small Tailwind-root stylesheet that inlines
   this package's **`src/theme.css`** (import-free by design) and declares
   `@source` for this package's source tree plus your own templates. Do not
   `@import` this package's `index.css` from another project root — nested
   cross-root imports leak.

## History note

Both repos were **flattened to a single commit** by the owner's decision on
2026-09-29 — the phased split history and the `pre-split` anchors no longer
exist. Rollback from here means restoring from an external clone/backup, not
git operations.

## MCP server (AI agents)

`tools/mcp-server.mjs` exposes the design system to local AI agents over the
Model Context Protocol (stdio). Tools: `list_components`, `get_component`
(files, docs, Watch-out, stories, props), `list_tokens` / `get_token` (CSS ↔
design-tokens.json agreement), `search_docs` (the living spec), `verify`
(typecheck, or the full suite with `{"full": true}` — needs both servers up).

Register it with any MCP client, pointing at this checkout:

```json
{
  "mcpServers": {
    "shin-med-ui": { "command": "node", "args": ["/absolute/path/to/shin-med-ui/tools/mcp-server.mjs"] }
  }
}
```

(ZCode: Settings → MCP servers; Claude Desktop: `claude_desktop_config.json`;
Cursor/Codex use the same `mcpServers` shape.)
