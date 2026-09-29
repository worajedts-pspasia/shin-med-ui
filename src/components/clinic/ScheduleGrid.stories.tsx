import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScheduleGrid } from "./ScheduleGrid"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureGridSlots, scheduleResources } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ScheduleGrid> = {
  title: "Medical/Medical Component/Schedule Grid",
  tags: ["autodocs"],
  component: ScheduleGrid,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("ScheduleGrid"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ view = "day" }: { view?: "day" | "week" }) {
  return (
    <ScheduleGrid
      view={view}
      resources={scheduleResources}
      slots={fixtureGridSlots}
      rangeLabel={view === "week" ? "Sep 28 – Oct 2, 2026" : "Monday, Sep 28, 2026"}
      onNavigate={() => {}}
      onCreate={(s) => console.log("create", s)}
      onMove={(id, s) => console.log("move", id, s)}
      interval={30}
      businessHours={["08:00", "16:00"]}
    />
  )
}

export const Playground: Story = {
  argTypes: { view: { control: "radio", options: ["day", "week"] } },
  args: { view: "day" } as Record<string, unknown>,
  render: (args: any) => <Demo view={args.view} />,
}
export const DayView: Story = { name: "Day (desktop)", parameters: { viewport: { defaultViewport: "desktop1280" } }, render: () => <Demo view="day" /> }
export const WeekView: Story = { name: "Week (desktop)", parameters: { viewport: { defaultViewport: "desktop1280" } }, render: () => <Demo view="week" /> }
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile390" }, docs: { description: { story: docsDesc("ScheduleGrid::Mobile") } } },
  render: () => <Demo view="week" />,
}
export const Thai: Story = {
  render: () => <ForcedLocale locale="th"><AtDensity density="compact"><Demo view="day" /></AtDensity></ForcedLocale>,
}
