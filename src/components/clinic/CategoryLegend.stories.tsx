import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CategoryLegend } from "./CategoryLegend"
import { CATEGORY_COLORS } from "./tokens"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureTimelineLanes, fixtureTimelineEvents } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof CategoryLegend> = {
  title: "Medical/Medical UI/Category Legend",
  tags: ["autodocs"],
  component: CategoryLegend,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("CategoryLegend"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const CATS = fixtureTimelineLanes.map((l) => ({
  id: l.id,
  label: l.label,
  color: CATEGORY_COLORS[l.id]?.var ?? "var(--color-things-gray-3)",
  count: fixtureTimelineEvents.filter((e) => e.laneId === l.id).length,
}))

function Demo({ variant = "panel" }: { variant?: "panel" | "popover" }) {
  const [value, setValue] = useState<string[]>(CATS.map((c) => c.id))
  return <CategoryLegend categories={CATS} value={value} onChange={setValue} variant={variant} />
}

export const Playground: Story = {
  argTypes: { variant: { control: "radio", options: ["panel", "popover"] } },
  args: { variant: "panel" } as Record<string, unknown>,
  render: (args: any) => <Demo variant={args.variant} />,
}

export const Default: Story = { name: "Default", render: () => <div className="max-w-56"><Demo /></div> }

export const Popover: Story = { render: () => <Demo variant="popover" /> }

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-56">
          <CategoryLegend
            categories={[
              { id: "meds", label: "ยา", color: CATEGORY_COLORS.medications.var, count: 3 },
              { id: "labs", label: "ผลแล็บ", color: CATEGORY_COLORS.labs.var, count: 3 },
              { id: "docs", label: "เอกสาร", color: CATEGORY_COLORS.documents.var, count: 2 },
            ]}
            value={["meds", "labs", "docs"]}
            onChange={() => {}}
          />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}
