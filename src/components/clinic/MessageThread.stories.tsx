import type { Meta, StoryObj } from "@storybook/react-vite"
import { MessageThread } from "./MessageThread"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureDirectory, fixtureThread } from "@/fixtures/clinic"

const meta: Meta<typeof MessageThread> = {
  title: "Medical/Medical Component/Message Thread",
  tags: ["autodocs"],
  component: MessageThread,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The conversation, clinical style: messages, calls and result-notices interleaved in one stream \u2014 because that's how care actually happens. Bubbles align by sender, attachments ride as chips, and the whole thread stays one scrollable truth.\n\n**Watch out:** the mixed stream is the point (a lab landing mid-conversation is context, not noise). Don't split it into tabs; filter instead.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const PARTICIPANTS = Object.fromEntries(fixtureDirectory.map((d) => [d.id, { name: d.name, role: d.role }]))

export const Playground: Story = { render: () => (
  <div className="max-w-2xl">
    <MessageThread entries={fixtureThread} participants={PARTICIPANTS} currentUserId="u6" patientContext={{ chartId: "9562", name: "Smith, Michael A. Jr." }} unreadBefore="t6" onEntryClick={() => {}} />
  </div>
) }

export const MixedStream: Story = {
  parameters: { docs: { description: { story: "The wave-4 gate story: chat + quote + system + unread divider in one scroll." } } },
  render: () => (
    <div className="max-w-2xl">
      <MessageThread entries={fixtureThread} participants={PARTICIPANTS} currentUserId="u6" patientContext={{ chartId: "9562", name: "Smith, Michael A. Jr." }} unreadBefore="t6" />
    </div>
  ),
}

export const Thai: Story = { render: () => (
  <ForcedLocale locale="th">
    <AtDensity density="compact">
      <div className="max-w-2xl">
        <MessageThread entries={fixtureThread} participants={PARTICIPANTS} currentUserId="u6" unreadBefore="t6" />
      </div>
    </AtDensity>
  </ForcedLocale>
) }
