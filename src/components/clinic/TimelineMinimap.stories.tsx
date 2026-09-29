import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { TimelineMinimap } from "./TimelineMinimap"
import { AtDensity } from "./story-utils"
import { fixtureMinimapBuckets } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof TimelineMinimap> = {
  title: "Medical/Medical Component/Timeline Minimap",
  tags: ["autodocs"],
  component: TimelineMinimap,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("TimelineMinimap"),
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
