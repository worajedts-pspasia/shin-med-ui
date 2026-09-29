import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { LineItemTable } from "./LineItemTable"
import { AtDensity } from "./story-utils"
import { fixtureLineItems } from "@/fixtures/clinic"

const meta: Meta<typeof LineItemTable> = {
  title: "Medical/Medical Component/Line Item Table",
  tags: ["autodocs"],
  component: LineItemTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Editable charge rows with a totals footer: quantity, unit price, amount \u2014 amount computed, not typed, and the totals row forever honest about the sum. One malformed row explains itself inline instead of breaking the math.\n\n**Watch out:** totals must recompute from the visible rows, always \u2014 a footer that lies once is a billing dispute.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => {
    const [bundle, setBundle] = useState(false)
    return (
      <div className="max-w-2xl">
        <LineItemTable
          headers={[{ label: "Item" }, { label: "Qty", numeric: true }, { label: "Unit" }, { label: "Sig" }, { label: "Cost (THB)", numeric: true }]}
          rows={fixtureLineItems.map((li) => ({
            id: li.id, status: li.status,
            cells: [{ node: li.name }, { node: String(li.qty), numeric: true }, { node: li.unit }, { node: <span className="font-mono text-xs">{li.sig}</span> }, { node: String(li.cost), numeric: true }],
          }))}
          onEdit={() => {}} onDelete={() => {}} onDuplicate={() => {}}
          totals={[{ label: "Total", value: String(fixtureLineItems.reduce((s, li) => s + (li.cost ?? 0), 0)) }]}
          bundleOption={{ label: "Bundle billing", checked: bundle, onChange: setBundle }}
        />
      </div>
    )
  },
}
