import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { EMLevelMatrix } from "./EMLevelMatrix"
import { fixtureEmCols, fixtureEmRows } from "@/fixtures/clinic"

const meta: Meta<typeof EMLevelMatrix> = {
  title: "Medical/Medical Component/Em Level Matrix",
  tags: ["autodocs"],
  component: EMLevelMatrix,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The E/M coding engine: a 5\u00d75 decision grid (problem complexity \u00d7 risk) where each cell states its level, plus a LevelMeter that fills 1\u20135. Click a cell, the meter follows.\n\n**Watch out:** the default level rule is min(problem, risk) \u2014 a placeholder, not law. Coding rules are jurisdiction-specific; swap the rule before this touches billing.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { rowLabels: fixtureEmRows, colLabels: fixtureEmCols } as Record<string, unknown>,
  render: () => {
    const [selected, setSelected] = useState<{ row: number; col: number } | undefined>({ row: 2, col: 2 })
    return (
      <div className="max-w-3xl">
        <EMLevelMatrix
          rowLabels={fixtureEmRows}
          colLabels={fixtureEmCols}
          selected={selected}
          onSelect={(c) => setSelected({ row: c.row, col: c.col })}
        />
      </div>
    )
  },
}
