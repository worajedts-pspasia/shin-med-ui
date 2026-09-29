import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueueTable } from "./QueueTable"
import { PaginationFooter } from "./PaginationFooter"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureQueue } from "@/fixtures/clinic"

const meta: Meta<typeof QueueTable> = {
  title: "Medical/Medical Component/Queue Table",
  tags: ["autodocs"],
  component: QueueTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The waiting queue, two axes visible at once: urgency (the triage tone) and flow state (the status dot) \u2014 because \"who's been waiting\" and \"how sick\" are different questions on the same rows. Compact by default; wait times in tabular figures.\n\n**Watch out:** never collapse the two axes into one color. And the queue is a living surface \u2014 stale timestamps here erode trust faster than anywhere else in the app.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

function Demo({ rows, maxHeight = 260, onRefresh }: { rows: typeof fixtureQueue; maxHeight?: number; onRefresh?: () => void }) {
  const [selectedId, setSelectedId] = useState<string>()
  return (
    <div className="max-w-3xl">
      <QueueTable
        rows={rows}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRefresh={onRefresh}
        maxHeight={maxHeight}
      />
    </div>
  )
}

export const Playground: Story = {
  argTypes: {
    maxHeight: { control: "number" },
    empty: { control: "boolean" },
  } as unknown as Meta<typeof QueueTable>["argTypes"],
  args: { maxHeight: 260, empty: false } as Record<string, unknown>,
  render: (args: any) => <Demo rows={args.empty ? [] : fixtureQueue} maxHeight={args.maxHeight} onRefresh={() => {}} />,
}

export const Default: Story = { name: "Default", render: () => <Demo rows={fixtureQueue} onRefresh={() => {}} /> }

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Full queue — urgency sort (urgent → rush → routine), held tinted, cancelled struck through</p>
        <Demo rows={fixtureQueue} maxHeight={220} />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Empty</p>
        <Demo rows={[]} maxHeight={140} />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">With pagination footer (blueprint 1 pairing)</p>
        <div className="max-w-3xl">
          <Demo rows={fixtureQueue} maxHeight={180} />
          <PaginationFooter total={50} page={1} pageCount={3} onPage={() => {}} />
        </div>
      </div>
    </div>
  ),
}

export const Empty: Story = { render: () => <Demo rows={[]} maxHeight={180} /> }

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <Demo rows={fixtureQueue} maxHeight={220} />,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <Demo rows={fixtureQueue} maxHeight={240} />
      </AtDensity>
    </ForcedLocale>
  ),
}

/** Scroll-locked proof: sticky header + sticky urgency & MRN columns at 390px. */
export const Narrow: Story = {
  render: () => (
    <AtDensity density="compact">
      <div className="max-w-[390px] rounded-md border border-things-hairline p-1">
        <Demo rows={fixtureQueue} maxHeight={220} />
      </div>
    </AtDensity>
  ),
}
