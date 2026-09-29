import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoardCard } from "./BoardCard"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof BoardCard> = {
  title: "Medical/Medical UI/Board Card",
  tags: ["autodocs"],
  component: BoardCard,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("BoardCard") } },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: {
    title: "Zoetis",
    value: "$17,500",
    contact: "Desmond Garrison",
    contactInitials: "D",
    status: "ok",
  },
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    contact: { control: "text" },
    status: { control: "radio", options: ["ok", "waiting", "blocked", "quiet"] },
    statusLabel: { control: "text" },
    selected: { control: "boolean" },
    dense: { control: "boolean" },
  },
}
export default meta

export const Playground: StoryObj<typeof meta> = {
  render: (args: any) => (
    <div className="max-w-[260px] pt-2">
      <BoardCard {...args} onClick={() => {}} />
    </div>
  ),
}

export const AllStates: StoryObj<typeof meta> = {
  render: () => (
    <div className="grid max-w-[640px] grid-cols-4 gap-2 pt-2">
      <BoardCard title="Zoetis" value="$17,500" contact="Desmond" contactInitials="D" status="ok" />
      <BoardCard title="Kenvue" value="$42,000" contact="A. Novak" contactInitials="A" status="waiting" />
      <BoardCard title="BASF" value="$6,300" contact="R. Silva" contactInitials="R" status="blocked" />
      <BoardCard title="Brenntag" value="$9,900" status="quiet" />
      <BoardCard title="Selected" value="$11,250" status="ok" selected />
      <BoardCard title="Dense" value="$4,200" contact="Hidden when dense" contactInitials="H" status="waiting" dense />
      <BoardCard title="Custom label" value="12" status="ok" statusLabel="ปกติ" />
      <BoardCard title="No value" contact="Only a person" contactInitials="P" status="quiet" />
    </div>
  ),
}

export const Dense: StoryObj<typeof meta> = {
  render: () => (
    <div className="max-w-[220px] pt-2">
      <BoardCard title="Brenntag" value="$9,900" contact="Mia Chen" contactInitials="M" status="quiet" dense />
    </div>
  ),
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <div className="max-w-[260px] pt-2">
        <BoardCard
          title="สมชาย ใจดี"
          value="฿12,000"
          contact="สมหญิง ขยัน"
          contactInitials="ส"
          status="waiting"
          statusLabel="รอ"
        />
      </div>
    </ForcedLocale>
  ),
}
