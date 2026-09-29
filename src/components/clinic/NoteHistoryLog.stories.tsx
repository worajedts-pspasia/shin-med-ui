import type { Meta, StoryObj } from "@storybook/react-vite"
import { NoteHistoryLog } from "./NoteHistoryLog"
import { fixtureNoteHistory } from "@/fixtures/clinic"

const meta: Meta<typeof NoteHistoryLog> = {
  title: "Medical/Medical UI/Note History Log",
  tags: ["autodocs"],
  component: NoteHistoryLog,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The append-only audit trail: newest first, timestamp in quiet tabular gray, author, and the note itself \u2014 which wraps, always, because a truncated audit entry is a lie of omission.\n\n**Watch out:** there is no edit and no delete in this component, on purpose. If you need corrections, append a correction entry.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: { reverse: { control: "boolean" } },
  args: { entries: fixtureNoteHistory, reverse: false },
  render: (args) => (
    <div className="mx-auto max-w-2xl">
      <NoteHistoryLog entries={args.entries ?? fixtureNoteHistory} reverse={args.reverse} />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="mx-auto max-w-2xl">
      <NoteHistoryLog entries={[]} />
    </div>
  ),
}
