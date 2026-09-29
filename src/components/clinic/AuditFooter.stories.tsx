import type { Meta, StoryObj } from "@storybook/react-vite"
import { AuditFooter } from "./AuditFooter"
import { fixtureAudit, fixtureNoteHistory } from "@/fixtures/clinic"

const meta: Meta<typeof AuditFooter> = {
  title: "Medical/Medical UI/Audit Footer",
  tags: ["autodocs"],
  component: AuditFooter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "One quiet line of provenance \u2014 \"Modified 09/15/2026, 9:05 AM by Nurse P. Rivera\" \u2014 because every clinical record deserves a paper trail without a click. Hover for the full story (created, modified, revision) in a hover-card; pass `history` and the full `NoteHistoryLog` opens in a dialog.\n\n**Watch out:** readers trust this line implicitly, so feed it real data \u2014 a fabricated timestamp is worse than none.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { ...fixtureAudit, history: fixtureNoteHistory } as Record<string, unknown>,
  render: (args) => (
    <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-things-hairline">
      <AuditFooter
        createdBy={String(args.createdBy)}
        createdAt={String(args.createdAt)}
        modifiedBy={args.modifiedBy ? String(args.modifiedBy) : undefined}
        modifiedAt={args.modifiedAt ? String(args.modifiedAt) : undefined}
        revision={typeof args.revision === "number" ? args.revision : undefined}
        history={fixtureNoteHistory}
      />
    </div>
  ),
}

export const WithoutHistory: Story = {
  parameters: { docs: { description: { story: "No history → provenance only, no dialog button." } } },
  render: () => (
    <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-things-hairline">
      <AuditFooter createdBy={fixtureAudit.createdBy} createdAt={fixtureAudit.createdAt} />
    </div>
  ),
}
