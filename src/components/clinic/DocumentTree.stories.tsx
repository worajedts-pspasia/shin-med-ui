import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { DocumentTree } from "./Paper"
import { AtDensity } from "./story-utils"
import { fixtureDocTree } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof DocumentTree> = {
  title: "Medical/Medical Component/Document Tree",
  tags: ["autodocs"],
  component: DocumentTree,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("DocumentTree"),
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
