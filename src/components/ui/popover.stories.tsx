import type { Meta, StoryObj } from "@storybook/react-vite"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

const meta: Meta<any> = {
  title: "UI/Containers/Popover",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { align: "center", defaultOpen: true },
  argTypes: {
    align: { control: "radio", options: ["start", "center", "end"] },
    side: { control: "radio", options: ["top", "bottom", "left", "right"] },
    defaultOpen: { control: "boolean" },
  },
  render: (args: { align?: "start" | "center" | "end"; side?: "top" | "bottom" | "left" | "right"; defaultOpen?: boolean }) => {
    const { align = "start", side = "bottom", defaultOpen = true } = args
    return (
    <div className="p-12">
      <Popover defaultOpen={defaultOpen}>
        <PopoverTrigger className="rounded-lg border border-things-border px-3 py-1.5 text-[13px]">When…</PopoverTrigger>
        <PopoverContent align={align} side={side} className="w-52 text-[13px] text-things-ink" forceMount>
          Pick a date for this to-do.
        </PopoverContent>
      </Popover>
    </div>
    )
  },
}

export const Simple: StoryObj = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">When…</Button></PopoverTrigger>
      <PopoverContent className="w-52 text-[13px] text-things-ink">Pick a date for this to-do.</PopoverContent>
    </Popover>
  ),
}
