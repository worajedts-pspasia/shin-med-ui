import type { Meta, StoryObj } from "@storybook/react-vite"

const meta: Meta = {
  title: "Design System/Typography & Rhythm",
  parameters: { layout: "padded" },
}

export default meta

const SCALE = [
  { label: "View title", cls: "text-[27px] font-bold leading-none tracking-[-0.022em] text-things-title", sample: "Today" },
  { label: "Project header", cls: "text-[16.5px] font-semibold tracking-[-0.01em] text-things-title", sample: "Quarter Close" },
  { label: "Task title", cls: "text-[14.5px] leading-[1.45] text-things-ink", sample: "Reply to Sarah about the venue" },
  { label: "Sidebar row", cls: "text-[13px] text-things-ink", sample: "Upcoming" },
  { label: "Subtitle / notes", cls: "text-[12.5px] leading-[1.5] text-things-gray", sample: "Monday, September 28" },
  { label: "Blue separator label", cls: "text-[12.5px] font-semibold text-things-blue", sample: "This Evening" },
  { label: "Chip text", cls: "text-[11px] text-things-gray-2", sample: "9:00 AM" },
  { label: "Sidebar section label", cls: "text-[11px] font-semibold tracking-wide text-things-gray", sample: "LISTS" },
]

export const Scale: StoryObj = {
  render: () => (
    <div className="bg-white p-6 font-sans">
      <h1 className="mb-1 text-[22px] font-bold text-things-title">Typography scale</h1>
      <p className="mb-6 text-[13px] text-things-gray">
        System font stack (SF Pro on macOS) — the face the product UIs use.
      </p>
      <div className="flex flex-col divide-y divide-things-hairline">
        {SCALE.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-8 py-3">
            <span className={row.cls}>{row.sample}</span>
            <code className="shrink-0 text-[10.5px] text-things-gray">{row.label}</code>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const Rhythm: StoryObj = {
  render: () => (
    <div className="bg-white p-6 font-sans">
      <h1 className="mb-1 text-[22px] font-bold text-things-title">Spacing & rhythm</h1>
      <p className="mb-6 max-w-[440px] text-[13px] leading-relaxed text-things-gray">
        Measured from the reference product screenshots this system was built from.
        Row hover uses <code>bg-things-hover</code>; the selected row uses{" "}
        <code>bg-things-blue-soft</code>; separators are 1px <code>things-hairline</code>{" "}
        with the label in <code>things-blue</code>.
      </p>
      <table className="text-left text-[12.5px] text-things-ink">
        <tbody className="[&_td]:py-1.5 [&_td]:pr-10">
          <tr><td>Task row</td><td className="text-things-gray">py-[7px] px-3, gap-3 → ~44px tall</td></tr>
          <tr><td>Checkbox circle</td><td className="text-things-gray">19px, border 1.5px things-box, fully round</td></tr>
          <tr><td>Checklist mini-circle</td><td className="text-things-gray">15px</td></tr>
          <tr><td>Sidebar row</td><td className="text-things-gray">30px tall, icon 17px, gap-2.5</td></tr>
          <tr><td>Sidebar width</td><td className="text-things-gray">224px desktop / 286px drawer</td></tr>
          <tr><td>Tag pill</td><td className="text-things-gray">19px tall, 11px text, things-tag-border</td></tr>
          <tr><td>Bottom toolbar</td><td className="text-things-gray">54px tall; floating on desktop, docked on mobile</td></tr>
          <tr><td>View header</td><td className="text-things-gray">pt-7 pb-3; title 27px; subtitle 13.5px things-gray</td></tr>
        </tbody>
      </table>
    </div>
  ),
}
