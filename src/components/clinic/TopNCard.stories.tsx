import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { TopNCard } from "./TopNCard"
import { fixtureTopDowntime } from "@/fixtures/clinic"

const meta: Meta<typeof TopNCard> = {
  title: "Medical/Medical Component/Top N Card",
  tags: ["autodocs"],
  component: TopNCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The \"Top Five Downtime\" pattern: ranked horizontal bars in operations-amber, click a bar to highlight it and its event list syncs beneath \u2014 the summary and the evidence in one card.\n\n**Watch out:** amber is this component's *attention* color (operations pain), not clinical severity \u2014 don't co-locate it with lab flags or the two ambers will collide.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { title: "Top Five Downtime — Q3 2026" } as Record<string, unknown>,
  render: () => {
    const [highlight, setHighlight] = useState<string | undefined>(undefined)
    return (
      <div className="max-w-xl">
        <TopNCard title="Top Five Downtime — Q3 2026" items={fixtureTopDowntime} highlightId={highlight} onHighlight={setHighlight} />
      </div>
    )
  },
}
