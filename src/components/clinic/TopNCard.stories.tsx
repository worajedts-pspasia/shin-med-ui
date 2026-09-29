import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { TopNCard } from "./TopNCard"
import { fixtureTopDowntime } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof TopNCard> = {
  title: "Medical/Medical Component/Top N Card",
  tags: ["autodocs"],
  component: TopNCard,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("TopNCard"),
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
