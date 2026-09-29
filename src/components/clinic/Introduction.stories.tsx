import type { Meta, StoryObj } from "@storybook/react-vite"

const meta: Meta = {
  title: "Medical/Introduction",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Start here. What this library is, how the sidebar is organized, and the five rules every component follows.",
      },
    },
  },
}
export default meta

export const ReadMe: StoryObj = {
  render: () => (
    <div className="max-w-[620px] rounded-md border border-things-hairline bg-card p-8 font-sans">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-things-title">Medical — the clinic component library</h1>
      <p className="mt-3 text-[13.5px] leading-relaxed text-things-ink">
        Ninety-six components for clinic software — from a patient's name to the four-pane
        workstation shell — built on one token set and five rules. Every story here is live:
        poke the controls, resize the viewport, switch the locale. If a component can't
        survive you doing that, it's a bug.
      </p>

      <h2 className="mt-6 text-[16px] font-semibold text-things-title">How the sidebar is organized</h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
        <li>
          <strong>Medical UI</strong> — the pure pieces: formatters, flags, dots, pills, the
          form kit, the search inputs, the table primitive. If you're building a clinical
          surface, these are your vocabulary words.
        </li>
        <li>
          <strong>Medical Shell</strong> — the frames: the app shell, both navigation rails,
          panels, the paper surface, and the three screen blueprints that prove the parts
          compose into real screens.
        </li>
        <li>
          <strong>Medical Component</strong> — the organisms: queues, schedules, results,
          timelines, orders, documents, messages, the specialist tools. Real data, real
          interactions, built from the vocabulary above.
        </li>
      </ul>

      <h2 className="mt-6 text-[16px] font-semibold text-things-title">Open these five first</h2>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
        <li><strong>AllergyBanner</strong> — the tone of the whole library: loud where it must be, honest about what it doesn't know.</li>
        <li><strong>DataTable</strong> — the dense table eleven other components are built on. Learn its props once, read every table forever.</li>
        <li><strong>QueueTable</strong> — two channels (urgency and flow state) sharing one row without competing. This pattern repeats everywhere.</li>
        <li><strong>PaperSurface</strong> — how this system separates "document" from "app": different surface, different ink, print styles included.</li>
        <li><strong>AppShell</strong> — where everything lives at the end of the day. Drag its splitters; reload; notice it remembered.</li>
      </ol>

      <h2 className="mt-6 text-[16px] font-semibold text-things-title">The five rules (the short version)</h2>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
        <li><strong>Severity means severity.</strong> <code>clinic-*</code> reds/ambers/greens are clinical judgment. Flow, categories and navigation use <code>things-*</code> — never the other way around.</li>
        <li><strong>Color never works alone.</strong> Every severity signal carries a glyph, letter or shape. Check any Monochrome story.</li>
        <li><strong>Patient identity is never bare.</strong> MRN + DOB render in every density and every locale, always.</li>
        <li><strong>Names, ages and dates are formatted, never concatenated.</strong> Thai and Japanese orderings are real and handled.</li>
        <li><strong>Numbers wear tabular figures.</strong> Anything countable gets <code>clinic-num</code>, so columns compare downward.</li>
      </ol>

      <p className="mt-6 rounded-md bg-things-blue-soft px-3 py-2 text-[13px] leading-relaxed text-things-blue">
        The long version — gotchas, wiring patterns, how to choose a component — lives in{" "}
        <code>app/frontend/components/clinic/README.md</code>. The spec that adjudicated every
        decision lives in <code>docs/spec/</code>.
      </p>
    </div>
  ),
}
