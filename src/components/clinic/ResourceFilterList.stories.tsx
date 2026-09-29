import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResourceFilterList } from "./ScheduleLists"
import { AtDensity } from "./story-utils"
import { fixtureResourceGroups } from "@/fixtures/clinic"

const meta: Meta<typeof ResourceFilterList> = {
  title: "Medical/Medical Component/Resource Filter List",
  tags: ["autodocs"],
  component: ResourceFilterList,
  parameters: { layout: "padded", docs: { description: { component: "Providers and rooms as checkbox groups with their schedule colors as swatches \u2014 check who to show on the grid, per-group select-all for the morning rush. Colors here *are* the grid's colors; the swatch is the promise.\n\n**Watch out:** filter state must actually drive the grid. A filter that lies once is dismissed forever." } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState(["r1", "r2", "r3"])
    return (
      <div className="max-w-56 rounded-md border border-things-hairline bg-card p-2">
        <ResourceFilterList groups={fixtureResourceGroups} value={value} onChange={setValue} />
      </div>
    )
  },
}
