import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { AnatomyInspector, type AnatomyMode } from "./AnatomyInspector"
import { fixtureAnatomyRegions } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof AnatomyInspector> = {
  title: "Medical/Medical Component/Anatomy Inspector",
  tags: ["autodocs"],
  component: AnatomyInspector,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("AnatomyInspector"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => {
    const [mode, setMode] = useState<AnatomyMode>("arterial")
    const [selected, setSelected] = useState("aorta")
    return (
      <div className="max-w-2xl">
        <AnatomyInspector
          regions={fixtureAnatomyRegions}
          mode={mode}
          onMode={setMode}
          selectedId={selected}
          onSelect={setSelected}
        />
      </div>
    )
  },
}
