import type { Meta, StoryObj } from "@storybook/react-vite"
import { NoteHistoryLog } from "./NoteHistoryLog"
import { fixtureNoteHistory } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof NoteHistoryLog> = {
  title: "Medical/Medical UI/Note History Log",
  tags: ["autodocs"],
  component: NoteHistoryLog,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("NoteHistoryLog"),
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
