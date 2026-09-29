import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ReconciliationList,
  type ReconciliationDecision,
  type ReconciliationItem,
  type ReconciliationKind,
} from "./ReconciliationList"
import { fixtureReconItems } from "@/fixtures/clinic"
import { ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ReconciliationList> = {
  title: "Medical/Medical Component/Reconciliation List",
  tags: ["autodocs"],
  component: ReconciliationList,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("ReconciliationList"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ sections, initial = fixtureReconItems }: { sections?: ReconciliationKind[]; initial?: ReconciliationItem[] }) {
  const [items, setItems] = useState(initial)
  const onAction = (id: string, decision: ReconciliationDecision) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, decision } : it)))
  return (
    <div className="mx-auto max-w-2xl">
      <ReconciliationList
        sections={sections}
        items={items}
        onAction={onAction}
        onMarkReviewed={() => {}}
        onPreview={() => {}}
        onSave={() => {}}
      />
    </div>
  )
}

export const Playground: Story = {
  argTypes: {
    sections: {
      control: "check",
      options: ["allergy", "medication", "problem"],
      description: "Kinds to show (none checked = all three)",
    },
  },
  args: { sections: [] } as Record<string, unknown>,
  render: (args) => {
    const sections = (args.sections as ReconciliationKind[]) ?? []
    return <Demo sections={sections.length ? sections : undefined} />
  },
}

export const MedicationsOnly: Story = {
  parameters: { docs: { description: { story: docsDesc("ReconciliationList::MedicationsOnly") } } },
  render: () => <Demo sections={["medication"]} />,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <Demo />
    </ForcedLocale>
  ),
}
