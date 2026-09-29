import type { Meta, StoryObj } from "@storybook/react-vite"
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"

const meta: Meta = {
  title: "UI/Containers/ContextMenu",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { label: "Task", defaultOpen: false },
  argTypes: { label: { control: "text" }, defaultOpen: { control: "boolean" } },
  render: (args: { label?: string; defaultOpen?: boolean }) => {
    const { label = "", defaultOpen = false } = args
    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-24 w-72 items-center justify-center rounded-xl border border-dashed border-things-box text-[13px] text-things-gray-2">
          Right-click this task
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>{label}</ContextMenuLabel>
          <ContextMenuItem>Complete</ContextMenuItem>
          <ContextMenuItem>When…</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  },
}

export const TaskContextMenu: StoryObj = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-24 w-72 items-center justify-center rounded-xl border border-dashed border-things-box text-[13px] text-things-gray-2">
        Right-click this task
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Task</ContextMenuLabel>
        <ContextMenuItem>Complete</ContextMenuItem>
        <ContextMenuItem>When…</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show notes</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
