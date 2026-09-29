import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { MessageComposer } from "./MessageComposer"
import type { AttachmentRef } from "./AttachmentChip"
import { AtDensity } from "./story-utils"
import { fixtureDirectory } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof MessageComposer> = {
  title: "Medical/Medical Component/Message Composer",
  tags: ["autodocs"],
  component: MessageComposer,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("MessageComposer"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ withTask = true }: { withTask?: boolean }) {
  const [to, setTo] = useState<string[]>(["u1"])
  const [subject, setSubject] = useState("CMP result — MRN 000001")
  const [body, setBody] = useState("")
  const [attachments, setAttachments] = useState<AttachmentRef[]>([])
  return (
    <div className="max-w-2xl">
      <MessageComposer
        to={to} onToChange={setTo} directory={[...fixtureDirectory]}
        subject={subject} onSubjectChange={setSubject}
        body={body} onBodyChange={setBody}
        attachments={attachments}
        onAttach={(a) => setAttachments((v) => [...v, a])}
        onRemoveAttachment={(id) => setAttachments((v) => v.filter((a) => a.id !== id))}
        onSend={() => {}} onConvertToTask={withTask ? () => {} : undefined}
      />
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }

export const WithAttachment: Story = {
  render: () => {
    const [to, setTo] = useState<string[]>(["u5"])
    return (
      <div className="max-w-2xl">
        <MessageComposer
          to={to} onToChange={setTo} directory={[...fixtureDirectory]}
          body="Pharmacy: please verify the Lipitor interaction."
          onBodyChange={() => {}}
          attachments={[{ id: "at2", kind: "chart", chartId: "9562", patient: "Smith, Michael A. Jr.", meta: "Male · Age: 46y" }]}
          onAttach={() => {}} onRemoveAttachment={() => {}} onSend={() => {}}
        />
      </div>
    )
  },
}
