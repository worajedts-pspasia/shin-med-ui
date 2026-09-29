import type { Meta, StoryObj } from "@storybook/react-vite"
import { DayBoard } from "./DayBoard"
import { ScheduleGrid } from "./ScheduleGrid"

const meta: Meta<typeof ScheduleGrid> = {
  title: "Medical/Medical Shell/Day Board Blueprint",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A screen blueprint (exam-room day view) showing how the shell, schedule, queue and summary components compose into one clinician-facing page. Not a catalog component itself \u2014 read it as a recipe, steal the composition, not the file.\n\n**Watch out:** blueprints demonstrate wiring (state, density, layout persistence), so treat divergence from it as a design decision to justify, not a quick fix.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = { parameters: { viewport: { defaultViewport: "desktop1280" } }, render: () => <DayBoard /> }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: "mobile390" } }, render: () => <DayBoard /> }
