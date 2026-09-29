import type { Meta, StoryObj } from "@storybook/react-vite"

const meta: Meta = {
  title: "Design System/Introduction",
  parameters: { layout: "padded" },
}

export default meta

export const ReadMe: StoryObj = {
  render: () => (
    <div className="max-w-[620px] bg-white p-8 font-sans">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-things-title">
        Shin Medical UI — Design System
      </h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-things-ink">
        A mobile-first task manager, expressed as a design system on top of{" "}
        <strong>shadcn/ui</strong> primitives. This Storybook is the{" "}
        <strong>spec</strong>: every component, state, and token the products are allowed
        to use lives here.
      </p>

      <h2 className="mt-6 text-[16px] font-semibold text-things-title">The contract</h2>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
        <li>
          <strong>Tokens</strong> — the palette lives once in{" "}
          <code>app/frontend/index.css</code> (<code>@theme</code> block), documented in{" "}
          <em>Design Tokens</em>. Components use generated utilities (
          <code>bg-things-blue</code>, <code>text-things-ink</code>…), never hardcoded hex
          values.
        </li>
        <li>
          <strong>Components</strong> — <code>components/ui/*</code> are untouched shadcn
          primitives; <code>components/things/*</code> are the Things-flavored design-system
          components. Every <code>things</code> component has a story here showing its states.
        </li>
        <li>
          <strong>Implementation</strong> — the Rails views (<code>/today</code>,{" "}
          <code>/projects/house</code>, …) may only compose what this spec defines.
        </li>
      </ol>

      <h2 className="mt-6 text-[16px] font-semibold text-things-title">
        Spec ↔ implementation verification
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-things-ink">
        <code>npm run verify:spec</code> (Playwright — <code>tools/verify-spec.mjs</code>)
        loads the live Rails routes and asserts, per route, that computed styles match the
        tokens above and that key component invariants hold (19px circular checkboxes, sidebar
        palette, separator blues, badge red…). It also cross-checks{" "}
        <code>design-tokens.json</code> against <code>index.css</code> and smoke-loads the
        Storybook stories. Run it whenever you touch tokens,{" "}
        <code>components/things/*</code>, or the views.
      </p>

      <h2 className="mt-6 text-[16px] font-semibold text-things-title">Adding to the system</h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
        <li>
          More shadcn primitives: <code>npx shadcn@latest add &lt;component&gt;</code> (lands
          in <code>components/ui</code>).
        </li>
        <li>
          New Things components: build in <code>components/things/</code>, use only tokens,
          add a story, extend <code>tools/verify-spec.mjs</code> if the component introduces a
          checkable invariant.
        </li>
      </ul>
    </div>
  ),
}
