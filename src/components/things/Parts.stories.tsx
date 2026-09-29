import type { Meta, StoryObj } from "@storybook/react-vite"
import { Moon, Tag } from "lucide-react"
import { HeaderMenu } from "@/components/things/TaskRow"
import { ProgressPie, StarGlyph } from "@/components/things/icons"
import { GroupLabel, Sep, ViewHeader } from "@/views/parts"

const meta: Meta = {
  title: "Task Management/Headers & Separators",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[420px] rounded-xl bg-white p-4 font-sans shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <Story />
      </div>
    ),
  ],
}

export default meta

export const ViewHeaders: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8">
      <ViewHeader
        icon={<StarGlyph className="size-[22px]" />}
        title="Today"
        subtitle="Monday, September 28"
      />
      <ViewHeader title="Inbox" subtitle="4 To-Dos" />
      <ViewHeader
        icon={<ProgressPie fraction={0.5} size={22} />}
        title="House"
        subtitle="Everything about the apartment"
        right={<HeaderMenu />}
      />
      <ViewHeader icon={<Tag className="size-[19px] text-things-gray-2" strokeWidth={1.8} />} title="Personal" />
    </div>
  ),
}

export const Separators: StoryObj = {
  render: () => (
    <div className="flex flex-col">
      <Sep label="Morning" />
      <Sep label="Afternoon" />
      <Sep label="This Evening" moon />
      <GroupLabel>September</GroupLabel>
      <GroupLabel>This Week</GroupLabel>
    </div>
  ),
}

export const MoonIcon: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <Moon className="size-[13px] text-things-evening" strokeWidth={1.9} />
      <span className="text-[12.5px] text-things-gray">evening separator glyph</span>
    </div>
  ),
}
