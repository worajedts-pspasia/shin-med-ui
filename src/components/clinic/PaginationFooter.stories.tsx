import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { PaginationFooter } from "./PaginationFooter"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof PaginationFooter> = {
  title: "Medical/Medical UI/Pagination Footer",
  tags: ["autodocs"],
  component: PaginationFooter,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("PaginationFooter"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

function Demo({ total = 50, pageCount = 3, unit = "items" as const, initial = 1 }: { total?: number; pageCount?: number; unit?: "items" | "rows"; initial?: number }) {
  const [page, setPage] = useState(initial)
  return (
    <div className="max-w-md rounded-md border border-things-hairline bg-card">
      <PaginationFooter total={total} page={page} pageCount={pageCount} onPage={setPage} unit={unit} />
    </div>
  )
}

export const Playground: Story = {
  argTypes: {
    total: { control: "number" },
    pageCount: { control: "number" },
    unit: { control: "radio", options: ["items", "rows"] },
  },
  args: { total: 50, pageCount: 3, unit: "items" } as Record<string, unknown>,
  render: (args: any) => <Demo total={args.total} pageCount={Math.max(1, args.pageCount)} unit={args.unit} />,
}

export const Default: Story = { name: "Default", render: () => <Demo /> }

export const Bounds: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Demo initial={1} />
      <Demo initial={3} />
    </div>
  ),
}

export const RowsUnit: Story = { render: () => <Demo total={4} pageCount={4} unit="rows" initial={2} /> }

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <Demo />
      </AtDensity>
    </ForcedLocale>
  ),
}
