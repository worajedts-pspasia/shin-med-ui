import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileText } from "lucide-react"
import { GroupedListPanel } from "./GroupedListPanel"
import { PaginationFooter } from "./PaginationFooter"
import { AtDensity } from "./story-utils"
import { fixtureFaxes, type FixtureFax } from "@/fixtures/clinic"

const meta: Meta<typeof GroupedListPanel<FixtureFax>> = {
  title: "Medical/Medical Component/Grouped List Panel",
  tags: ["autodocs"],
  component: GroupedListPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The \"Arranged By:\" panel from the documents console: items grouped under sticky headers (by date, by type, by sender), each group collapsible, the whole thing calm and scannable.\n\n**Watch out:** groups are for *scanning*, not hiding \u2014 collapsed-by-default groups that users must open to find today's item defeat the purpose.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

const DAY_LABEL: Record<string, string> = {
  "2026-09-28": "Today",
  "2026-09-27": "Yesterday",
  "2026-09-26": "Sep 26",
  "2026-09-25": "Sep 25",
}

const GROUPS = [
  { id: "day", label: "Date received" },
  { id: "from", label: "Sender" },
]

function dayGroup(f: FixtureFax) {
  return f.day
}
function fromGroup(f: FixtureFax) {
  return f.from
}

function renderFax(f: FixtureFax) {
  return (
    <div className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-things-hover">
      <FileText className="size-4 shrink-0 text-things-gray-3" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-things-title">{f.subject}</p>
        <p className="truncate text-xs text-things-gray-3">{f.from}</p>
      </div>
      <span className="clinic-num shrink-0 text-xs text-things-gray-3">{f.pages}p</span>
    </div>
  )
}

function Demo({ footer }: { footer?: boolean }) {
  const [group, setGroup] = useState("day")
  return (
    <div className="max-w-md">
      <GroupedListPanel<FixtureFax>
        title="Fax inbox"
        items={fixtureFaxes}
        itemKey={(f) => f.id}
        groups={group === "day" ? Object.entries(DAY_LABEL).map(([id, label]) => ({ id, label })) : Array.from(new Set(fixtureFaxes.map(fromGroup))).map((id) => ({ id, label: id }))}
        groupOf={group === "day" ? dayGroup : fromGroup}
        renderItem={renderFax}
        activeGroup={group}
        onGroupChange={setGroup}
        maxHeight={280}
        footer={footer ? <PaginationFooter total={6} page={1} pageCount={1} onPage={() => {}} /> : undefined}
      />
    </div>
  )
}

export const Playground: Story = {
  argTypes: { footer: { control: "boolean" } },
  args: { footer: true } as Record<string, unknown>,
  render: (args: any) => <Demo footer={args.footer} />,
}

export const Default: Story = { name: "Default", render: () => <Demo footer /> }

export const ArrangedBySender: Story = {
  render: () => {
    const senders = Array.from(new Set(fixtureFaxes.map((f) => f.from)))
    return (
      <div className="max-w-md">
        <GroupedListPanel<FixtureFax>
          title="Fax inbox"
          items={fixtureFaxes}
          itemKey={(f) => f.id}
          groups={senders.map((s) => ({ id: s, label: s }))}
          groupOf={(f) => f.from}
          renderItem={renderFax}
          maxHeight={280}
        />
      </div>
    )
  },
}

export const Empty: Story = {
  render: () => (
    <div className="max-w-md">
      <GroupedListPanel<FixtureFax>
        title="Fax inbox"
        items={[]}
        itemKey={(f) => f.id}
        groups={[{ id: "day", label: "Date received" }]}
        groupOf={(f) => f.day}
        renderItem={renderFax}
        maxHeight={160}
      />
    </div>
  ),
}

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <Demo />,
}
