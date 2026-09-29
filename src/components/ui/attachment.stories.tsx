import type { Meta, StoryObj } from "@storybook/react-vite"
import { Attachment, AttachmentContent, AttachmentDescription, AttachmentTitle } from "@/components/ui/attachment"

const meta: Meta = {
  title: "UI/Chat/Attachment",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { title: "Q3-report.pdf", description: "1.2 MB · PDF" },
  argTypes: { title: { control: "text" }, description: { control: "text" } },
  render: (args: { title?: string; description?: string }) => {
    const { title = "", description = "" } = args
    return (
      <Attachment className="w-64">
        <AttachmentContent>
          <AttachmentTitle>{title}</AttachmentTitle>
          <AttachmentDescription>{description}</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    )
  },
}

export const FileCard: StoryObj = {
  render: () => (
    <Attachment className="w-64">
      <AttachmentContent>
        <AttachmentTitle>Q3-report.pdf</AttachmentTitle>
        <AttachmentDescription>1.2 MB · PDF</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  ),
}
