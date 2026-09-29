import type { Meta, StoryObj } from "@storybook/react-vite"
import { AuditFooter } from "./AuditFooter"
import { fixtureAudit, fixtureNoteHistory } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof AuditFooter> = {
  title: "Medical/Medical UI/Audit Footer",
  tags: ["autodocs"],
  component: AuditFooter,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("AuditFooter"),
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
  parameters: { docs: { description: { story: docsDesc("AuditFooter::WithoutHistory") } } },
  render: () => (
    <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-things-hairline">
      <AuditFooter createdBy={fixtureAudit.createdBy} createdAt={fixtureAudit.createdAt} />
    </div>
  ),
}
