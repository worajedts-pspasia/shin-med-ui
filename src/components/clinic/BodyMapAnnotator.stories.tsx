import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BodyMapAnnotator, type BodyMarker } from "./BodyMapAnnotator"
import { fixtureBodyMarkers } from "@/fixtures/clinic"

const meta: Meta<typeof BodyMapAnnotator> = {
  title: "Medical/Medical Component/Body Map Annotator",
  tags: ["autodocs"],
  component: BodyMapAnnotator,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Mark findings on a body: click a region to drop a \u2295 marker (tone = clinical judgment), click again to remove. The silhouette is schematic \u2014 a stand-in for a designed asset \u2014 but the region names and interactions are the real contract.\n\n**Watch out:** desktop canvas by design; below md it becomes the findings list plus a \"view diagram\" dialog. Marker tones are severity \u2014 keep them honest.",
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
