import type { Meta, StoryObj } from "@storybook/react-vite"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const meta: Meta<any> = {
  title: "UI/Display/Tooltip",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { side: "top" },
  argTypes: {
    side: { control: "radio", options: ["top", "bottom", "left", "right"] },
  },
  render: (args: { side?: "top" | "bottom" | "left" | "right" }) => {
    const { side = "bottom" } = args
    return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="rounded-lg border border-things-border px-3 py-1.5 text-[13px] text-things-gray-4">＋</TooltipTrigger>
        <TooltipContent side={side}>New To-Do ⌘N</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    )
  },
}

export const ToolbarHint: StoryObj = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="rounded-lg border border-things-border px-3 py-1.5 text-[13px] text-things-gray-4">＋</TooltipTrigger>
        <TooltipContent side="top">New To-Do ⌘N</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
