import type { Meta, StoryObj } from "@storybook/react-vite"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const meta: Meta<any> = {
  title: "UI/Containers/DropdownMenu",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { side: "bottom", align: "start", defaultOpen: true },
  argTypes: {
    side: { control: "radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "radio", options: ["start", "center", "end"] },
    defaultOpen: { control: "boolean" },
  },
  render: (args: { side?: "top" | "bottom" | "left" | "right"; align?: "start" | "center" | "end"; defaultOpen?: boolean }) => {
    const { side = "bottom", align = "start", defaultOpen = true } = args
    return (
    <div className="p-8">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger className="rounded-lg border border-things-border px-3 py-1.5 text-[13px]">Open menu</DropdownMenuTrigger>
        <DropdownMenuContent side={side} align={align} className="w-48" forceMount>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    )
  },
}

export const TaskMenu: StoryObj = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Open menu</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
