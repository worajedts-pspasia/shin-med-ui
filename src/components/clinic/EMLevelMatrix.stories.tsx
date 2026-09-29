import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { EMLevelMatrix } from "./EMLevelMatrix"
import { fixtureEmCols, fixtureEmRows } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof EMLevelMatrix> = {
  title: "Medical/Medical Component/Em Level Matrix",
  tags: ["autodocs"],
  component: EMLevelMatrix,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("EMLevelMatrix"),
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
