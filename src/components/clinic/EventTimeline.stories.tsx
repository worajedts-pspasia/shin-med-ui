import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CategoryLegend } from "./CategoryLegend"
import { EventTimeline } from "./EventTimeline"
import { CATEGORY_COLORS } from "./tokens"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureTimelineEvents, fixtureTimelineLanes } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof EventTimeline> = {
  title: "Medical/Medical Component/Event Timeline",
  tags: ["autodocs"],
  component: EventTimeline,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("EventTimeline"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const TODAY = "2026-09-28T12:00"

function Demo({ variant = "dot", withLegend = true, today = true }: { variant?: "dot" | "pill"; withLegend?: boolean; today?: boolean }) {
  const [hidden, setHidden] = useState<string[]>([])
  return (
    <div className="flex max-w-3xl flex-col gap-2">
      {withLegend && (
        <CategoryLegend
          categories={fixtureTimelineLanes.map((l) => ({
            id: l.id,
            label: l.label,
            color: CATEGORY_COLORS[l.id]?.var ?? "var(--color-things-gray-3)",
            count: fixtureTimelineEvents.filter((e) => e.laneId === l.id).length,
          }))}
          value={fixtureTimelineLanes.map((l) => l.id).filter((id) => !hidden.includes(id))}
          onChange={(v) => setHidden(fixtureTimelineLanes.map((l) => l.id).filter((id) => !v.includes(id)))}
        />
      )}
      <EventTimeline
        lanes={fixtureTimelineLanes}
        events={fixtureTimelineEvents}
        variant={variant}
        hiddenLanes={hidden as never}
        todayColumn={today}
        today={TODAY}
        maxHeight={300}
        onSelect={(id) => console.log("select", id)}
      />
    </div>
  )
}

export const Playground: Story = {
  argTypes: {
    variant: { control: "radio", options: ["dot", "pill"] },
    withLegend: { control: "boolean" },
    today: { control: "boolean" },
  } as unknown as Meta<typeof EventTimeline>["argTypes"],
  args: { variant: "dot", withLegend: true, today: true } as Record<string, unknown>,
  render: (args: any) => <Demo variant={args.variant} withLegend={args.withLegend} today={args.today} />,
}

export const Default: Story = { name: "Default", render: () => <Demo /> }

export const PillVariant: Story = { render: () => <Demo variant="pill" withLegend={false} /> }

export const Narrow: Story = {
  render: () => (
    <AtDensity density="compact">
      <div className="max-w-[390px]">
        <Demo withLegend={false} />
      </div>
    </AtDensity>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <EventTimeline
          lanes={[
            { id: "medications", label: "ยา" },
            { id: "labs", label: "ผลแล็บ" },
            { id: "notes", label: "บันทึก" },
          ]}
          events={fixtureTimelineEvents.filter((e) => ["medications", "labs", "notes"].includes(e.laneId))}
          todayColumn
          today={TODAY}
          maxHeight={240}
        />
      </AtDensity>
    </ForcedLocale>
  ),
}
