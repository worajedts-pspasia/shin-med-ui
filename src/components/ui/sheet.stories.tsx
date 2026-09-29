import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const meta: Meta<any> = {
  title: "UI/Containers/Sheet",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { side: "left", defaultOpen: true },
  argTypes: {
    side: { control: "radio", options: ["left", "right", "top", "bottom"] },
    defaultOpen: { control: "boolean" },
  },
  render: (args: { side?: "top" | "bottom" | "left" | "right"; defaultOpen?: boolean }) => {
    const { side = "bottom", defaultOpen = true } = args
    return (
    <div className="p-8">
      <Sheet defaultOpen={defaultOpen}>
        <SheetTrigger className="rounded-lg border border-things-border px-3 py-1.5 text-[13px]">Open sheet</SheetTrigger>
        <SheetContent side={side} className={side === "left" || side === "right" ? "w-72" : ""}>
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>App navigation lives in this drawer on mobile.</SheetDescription>
        </SheetContent>
      </Sheet>
    </div>
    )
  },
}

export const SidebarDrawer: StoryObj = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="p-8">
      <Sheet>
        <SheetTrigger asChild><Button variant="outline">Open sidebar drawer</Button></SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>App navigation lives in this drawer on mobile.</SheetDescription>
        </SheetContent>
      </Sheet>
    </div>
  ),
}
