import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { DocumentTree } from "./Paper"
import { AtDensity } from "./story-utils"
import { fixtureDocTree } from "@/fixtures/clinic"

const meta: Meta<typeof DocumentTree> = {
  title: "Medical/Medical Component/Document Tree",
  tags: ["autodocs"],
  component: DocumentTree,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "The folder tree for documents: Lab Reports \u203a COMP METAB PANEL (6), zero-count folders dimmed, recursively expandable with counts at every level. Selection is yours to control.\n\n**Watch out:** dimmed \u2260 empty \u2014 a zero count means \"nothing *today*\", and users read it that way. Keep counts live from the same source as the viewer beside it.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | undefined>("lab-cmp")
    return (
      <div className="max-w-xs rounded-md border border-things-hairline bg-card p-1.5">
        <DocumentTree nodes={fixtureDocTree} selected={selected} onSelect={setSelected} />
      </div>
    )
  },
}
