import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BodyMapAnnotator, type BodyMarker } from "./BodyMapAnnotator"
import { fixtureBodyMarkers } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof BodyMapAnnotator> = {
  title: "Medical/Medical Component/Body Map Annotator",
  tags: ["autodocs"],
  component: BodyMapAnnotator,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("BodyMapAnnotator"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => {
    const [markers, setMarkers] = useState<BodyMarker[]>(fixtureBodyMarkers)
    const toggle = (regionId: string) =>
      setMarkers((prev) =>
        prev.some((m) => m.regionId === regionId)
          ? prev.filter((m) => m.regionId !== regionId)
          : [...prev, { id: `bm-new-${regionId}`, regionId, tone: "warn" }],
      )
    return (
      <div className="max-w-sm">
        <BodyMapAnnotator markers={markers} onToggleMarker={toggle} />
        <p data-marker-count={markers.length} className="clinic-num mt-2 text-xs text-things-gray-2">
          {markers.length} findings marked
        </p>
      </div>
    )
  },
}
