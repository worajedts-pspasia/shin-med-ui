import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CategoryLegend } from "./CategoryLegend"
import { CohortTimeline } from "./CohortTimeline"
import { fixtureCohortPatients } from "@/fixtures/clinic"

const meta: Meta<typeof CohortTimeline> = {
  title: "Medical/Medical Component/Cohort Timeline",
  tags: ["autodocs"],
  component: CohortTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Population health at a glance: one swimlane per patient, events as category-colored dots along a shared time axis, de-stacked into rows when they collide so every event stays countable. Align by calendar dates or each patient's first event; rank by name or onset.\n\n**Watch out:** desktop-only by design (below lg it reports counts). Dots use the *category* palette \u2014 this view never encodes severity.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const CATEGORIES = [
  { id: "medications", label: "Medications", color: "var(--color-things-blue)" },
  { id: "labs", label: "Labs", color: "var(--color-things-teal)" },
  { id: "appointments", label: "Appointments", color: "var(--color-things-gold)" },
  { id: "problems", label: "Problems", color: "var(--color-things-pink)" },
  { id: "notes", label: "Notes", color: "var(--color-things-glyph-blue)" },
  { id: "communications", label: "Communications", color: "var(--color-things-purple)" },
  { id: "immunizations", label: "Immunizations", color: "var(--color-things-tan)" },
]

function Demo() {
  const [align, setAlign] = useState<"dates" | "first-event">("dates")
  const [rank, setRank] = useState<"name" | "first-event">("name")
  const [visible, setVisible] = useState(CATEGORIES.map((c) => c.id))
  const counts = new Map(
    CATEGORIES.map((c) => [c.id, fixtureCohortPatients.flatMap((p) => p.events).filter((e) => e.category === c.id).length]),
  )
  return (
    <div className="max-w-3xl space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {(["dates", "first-event"] as const).map((a) => (
          <button
            key={a}
            type="button"
            data-align-btn={a}
            aria-pressed={align === a}
            onClick={() => setAlign(a)}
            className={`rounded-sm px-2.5 py-1 text-xs transition-colors ${align === a ? "bg-things-select font-medium text-things-blue" : "text-things-gray-2 hover:bg-things-hover"}`}
          >
            {a === "dates" ? "Align: calendar dates" : "Align: first event"}
          </button>
        ))}
        {(["name", "first-event"] as const).map((r) => (
          <button
            key={r}
            type="button"
            data-rank-btn={r}
            aria-pressed={rank === r}
            onClick={() => setRank(r)}
            className={`rounded-sm px-2.5 py-1 text-xs transition-colors ${rank === r ? "bg-things-select font-medium text-things-blue" : "text-things-gray-2 hover:bg-things-hover"}`}
          >
            {r === "name" ? "Rank: name" : "Rank: first event"}
          </button>
        ))}
      </div>
      <CohortTimeline patients={fixtureCohortPatients} align={align} rank={rank} visibleCategories={visible} />
      <CategoryLegend
        categories={CATEGORIES.map((c) => ({ ...c, count: counts.get(c.id) }))}
        value={visible}
        onChange={setVisible}
      />
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }
