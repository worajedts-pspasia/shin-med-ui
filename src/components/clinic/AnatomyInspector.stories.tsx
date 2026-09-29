import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { AnatomyInspector, type AnatomyMode } from "./AnatomyInspector"
import { fixtureAnatomyRegions } from "@/fixtures/clinic"

const meta: Meta<typeof AnatomyInspector> = {
  title: "Medical/Medical Component/Anatomy Inspector",
  tags: ["autodocs"],
  component: AnatomyInspector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The cardiology vessel navigator: body silhouette on the left, a magnifier zoom box tracking your selection, Arterial/Venous as a segmented control, region list on the right. It's BodyMapAnnotator's calm sibling \u2014 it *inspects*, never edits.\n\n**Watch out:** desktop-only by design; below md it degrades to the current selection. The mode tints are decorative map keys \u2014 labeled by the control, so they don't need to survive grayscale.",
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
