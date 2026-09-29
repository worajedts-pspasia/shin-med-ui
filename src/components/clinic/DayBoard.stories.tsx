import type { Meta, StoryObj } from "@storybook/react-vite"
import { DayBoard } from "./DayBoard"
import { ScheduleGrid } from "./ScheduleGrid"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ScheduleGrid> = {
  title: "Medical/Medical Shell/Day Board Blueprint",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: docsDesc("DayBoard"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = { parameters: { viewport: { defaultViewport: "desktop1280" } }, render: () => <DayBoard /> }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: "mobile390" } }, render: () => <DayBoard /> }
