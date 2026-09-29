import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResourceFilterList } from "./ScheduleLists"
import { AtDensity } from "./story-utils"
import { fixtureResourceGroups } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ResourceFilterList> = {
  title: "Medical/Medical Component/Resource Filter List",
  tags: ["autodocs"],
  component: ResourceFilterList,
  parameters: { layout: "padded", docs: { description: { component: docsDesc("ResourceFilterList") } } },
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
