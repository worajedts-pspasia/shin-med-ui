import type { Meta, StoryObj } from "@storybook/react-vite"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Trash2 } from "lucide-react"

const meta: Meta<any> = {
  title: "UI/Display/Empty",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { variant: "default", title: "Trash is Empty" },
  argTypes: {
    variant: { control: "radio", options: ["default", "icon"] },
    title: { control: "text" },
  },
  render: (args: { variant?: "default" | "icon"; title?: string }) => {
    const { variant = "default", title = "Are you sure?" } = args
    return (
    <Empty className="w-64">
      <EmptyHeader>
        <EmptyMedia variant={variant}><Trash2 className="size-6" /></EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>Deleted to-dos appear here first.</EmptyDescription>
      </EmptyHeader>
    </Empty>
    )
  },
}

export const TrashEmpty: StoryObj = {
  render: () => (
    <Empty className="w-64">
      <EmptyHeader>
        <EmptyMedia variant="icon"><Trash2 className="size-6" /></EmptyMedia>
        <EmptyTitle>Trash is Empty</EmptyTitle>
        <EmptyDescription>Deleted to-dos appear here first.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}
