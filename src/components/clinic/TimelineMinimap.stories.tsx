import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { TimelineMinimap } from "./TimelineMinimap"
import { AtDensity } from "./story-utils"
import { fixtureMinimapBuckets } from "@/fixtures/clinic"

const meta: Meta<typeof TimelineMinimap> = {
  title: "Medical/Medical Component/Timeline Minimap",
  tags: ["autodocs"],
  component: TimelineMinimap,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The two-year histogram as a time brush: every bar is a month's event count, the window is draggable by its edges (or centers on a bar click), and what you select is what the main timeline shows. Hidden below lg.\n\n**Watch out:** the brush must *actually* drive the timeline \u2014 a decorative minimap trains users to ignore it, and this component is too useful to waste on that.",
      },
    },
  },
  decorators: [(Story) => <div className="w-full max-w-[1024px]"><AtDensity density="compact"><Story /></AtDensity></div>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => {
    const [win, setWin] = useState<[string, string]>(["2026-01-01", "2026-09-30"])
    return (
      <div className="max-w-2xl">
        <TimelineMinimap buckets={fixtureMinimapBuckets} window={win} onWindowChange={setWin} />
      </div>
    )
  },
}
