import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { DrugSearchTree, type DrugTreeFilters } from "./DrugSearchTree"
import { AtDensity } from "./story-utils"
import { fixtureDrugTree } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof DrugSearchTree> = {
  title: "Medical/Medical Component/Drug Search Tree",
  tags: ["autodocs"],
  component: DrugSearchTree,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("DrugSearchTree"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ variant = "tree" }: { variant?: "tree" | "flat" }) {
  const [filters, setFilters] = useState<DrugTreeFilters>({ route: true, dosage: true, strength: true, autoExpand: false })
  const [favs, setFavs] = useState<string[]>(["lip-20"])
  return (
    <div className="max-w-md">
      <DrugSearchTree
        nodes={fixtureDrugTree} onSelect={() => {}} filters={filters} onFiltersChange={setFilters}
        favorites={favs} onToggleFavorite={(id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))}
        variant={variant}
      />
    </div>
  )
}

export const Playground: Story = {
  argTypes: { variant: { control: "radio", options: ["tree", "flat"] } } as unknown as Meta<typeof DrugSearchTree>["argTypes"],
  args: { variant: "tree" } as Record<string, unknown>,
  render: (args: any) => <Demo variant={args.variant} />,
}
export const FlatMobile: Story = { render: () => <div className="max-w-[390px]"><Demo variant="flat" /></div> }
