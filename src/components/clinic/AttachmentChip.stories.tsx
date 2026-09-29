import type { Meta, StoryObj } from "@storybook/react-vite"
import { AttachmentChip, type AttachmentRef } from "./AttachmentChip"
import { AtDensity } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof AttachmentChip> = {
  title: "Medical/Medical UI/Attachment Chip",
  tags: ["autodocs"],
  component: AttachmentChip,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("AttachmentChip"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: { kind: { control: "radio", options: ["file", "chart"] } } as unknown as Meta<typeof AttachmentChip>["argTypes"],
  args: { kind: "file" } as Record<string, unknown>,
  render: (args: any) => {
    const a: AttachmentRef =
      args.kind === "chart"
        ? { id: "at2", kind: "chart", chartId: "9562", patient: "Smith, Michael A. Jr.", meta: "Male · Age: 46y" }
        : { id: "at1", kind: "file", name: "LabCorp Results.jpg", size: "412 KB", docId: "1970" }
    return <div className="max-w-sm"><AttachmentChip attachment={a} onOpen={() => {}} onRemove={() => {}} /></div>
  },
}

export const BothKinds: Story = {
  render: () => (
    <div className="flex max-w-xl flex-wrap gap-2">
      <AttachmentChip attachment={{ id: "at1", kind: "file", name: "LabCorp Results.jpg", size: "412 KB", docId: "1970" }} />
      <AttachmentChip attachment={{ id: "at2", kind: "chart", chartId: "9562", patient: "Smith, Michael A. Jr.", meta: "Male · Age: 46y" }} />
    </div>
  ),
}
