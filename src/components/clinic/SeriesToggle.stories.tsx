import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SeriesToggle } from "./SeriesToggle"
import { fixtureOpsSeries } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof SeriesToggle> = {
  title: "Medical/Medical UI/Series Toggle",
  tags: ["autodocs"],
  component: SeriesToggle,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("SeriesToggle"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { series: fixtureOpsSeries, value: ["visits", "procedures"] } as Record<string, unknown>,
  render: (args) => {
    const [value, setValue] = useState<string[]>((args.value as string[]) ?? ["visits"])
    return (
      <div className="max-w-xs rounded-md border border-things-hairline bg-white p-3">
        <SeriesToggle series={fixtureOpsSeries} value={value} onChange={setValue} />
        <p data-visible={value.join(",")} className="clinic-num mt-3 border-t border-things-hairline pt-2 text-xs text-things-gray-2">
          visible: {value.join(", ") || "—"}
        </p>
      </div>
    )
  },
}

export const AllOn: Story = { render: () => <div className="max-w-xs"><SeriesToggle series={fixtureOpsSeries} value={fixtureOpsSeries.map((s) => s.id)} /></div> }
