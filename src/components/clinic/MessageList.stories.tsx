import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { MessageList, MessageListRow } from "./MessageList"
import { fixtureMessageGroups } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof MessageListRow> = {
  title: "Medical/Medical Component/Message List",
  tags: ["autodocs"],
  component: MessageListRow,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("MessageList"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof MessageListRow>

function Demo() {
  const [page, setPage] = useState(1)
  return (
    <div className="mx-auto max-w-2xl">
      <MessageList
        groups={fixtureMessageGroups}
        total={36}
        page={page}
        pageCount={3}
        onPage={setPage}
        maxHeight={320}
      />
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }

export const RowStates: Story = {
  parameters: { docs: { description: { story: docsDesc("MessageList::RowStates") } } },
  render: () => (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-md border border-things-hairline bg-white">
      <MessageListRow sender="St. Mary's Lab" subject="Re: CMP — Smith, Michael" at="08:42" read={false} hasAttachment />
      <MessageListRow sender="Front Desk" subject="Check-in note for 9:30" at="08:15" />
      <MessageListRow sender="Billing Office" subject="Claim 2026-09-0011 adjusted" at="Sep 05" active />
    </div>
  ),
}
