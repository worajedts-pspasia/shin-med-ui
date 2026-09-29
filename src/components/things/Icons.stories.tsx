import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  BoxGlyph,
  CalendarGlyph,
  CheckGlyph,
  InboxGlyph,
  LayersGlyph,
  ListGlyph,
  LogbookGlyph,
  ProgressPie,
  StarGlyph,
} from "@/components/things/icons"

const meta: Meta = {
  title: "Task Management/Icons & Progress",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}

export default meta

export const SidebarGlyphs: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-8 bg-white p-6 font-sans">
      {[
        { name: "Inbox", node: <InboxGlyph className="size-6" /> },
        { name: "Today", node: <StarGlyph className="size-6" /> },
        { name: "Upcoming", node: <CalendarGlyph className="size-6" /> },
        { name: "Anytime", node: <LayersGlyph className="size-6" /> },
        { name: "Someday", node: <BoxGlyph className="size-6" /> },
        { name: "Logbook", node: <LogbookGlyph className="size-6" /> },
      ].map(({ name, node }) => (
        <div key={name} className="flex w-20 flex-col items-center gap-2">
          {node}
          <span className="text-[11px] text-things-gray-4">{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const ListGlyphs: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-8 bg-white p-6 font-sans">
      {[
        { name: "House", color: "#4a7cf5" },
        { name: "Quarter Close", color: "#f0923f" },
        { name: "Side Project", color: "#7c5cd6" },
        { name: "Trip to Chiang Mai", color: "#2db8a6" },
      ].map(({ name, color }) => (
        <div key={name} className="flex w-32 flex-col items-center gap-2">
          <ListGlyph color={color} className="size-6 rounded-lg" />
          <span className="text-center text-[11px] text-things-gray-4">{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const ProgressPies: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8 bg-white p-6 font-sans">
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
        <div key={fraction} className="flex w-20 flex-col items-center gap-2">
          <ProgressPie fraction={fraction} size={26} />
          <span className="text-[11px] text-things-gray-4">{Math.round(fraction * 100)}%</span>
        </div>
      ))}
    </div>
  ),
}

export const CompletedCheck: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8 bg-white p-6 font-sans">
      <span className="flex size-6 items-center justify-center rounded-full bg-things-blue">
        <CheckGlyph className="size-3.5" />
      </span>
      <span className="flex size-8 items-center justify-center rounded-full bg-things-blue">
        <CheckGlyph className="size-4.5" />
      </span>
      <span className="flex size-10 items-center justify-center rounded-full bg-things-blue">
        <CheckGlyph className="size-5.5" />
      </span>
    </div>
  ),
}
