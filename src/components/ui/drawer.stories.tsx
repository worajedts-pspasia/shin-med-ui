import type { Meta, StoryObj } from "@storybook/react-vite"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

const meta: Meta<any> = {
  title: "UI/Containers/Drawer",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { defaultOpen: true },
  argTypes: { defaultOpen: { control: "boolean" } },
  render: (args: { defaultOpen?: boolean }) => {
    const { defaultOpen = true } = args
    return (
    <div className="p-8">
      <Drawer defaultOpen={defaultOpen}>
        <DrawerTrigger className="rounded-lg border border-things-border px-3 py-1.5 text-[13px]">Open drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Move to…</DrawerTitle>
            <DrawerDescription>Swipe-friendly bottom sheet on mobile.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
    )
  },
}

export const BottomSheet: StoryObj = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move to…</DrawerTitle>
          <DrawerDescription>Swipe-friendly bottom sheet on mobile.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
}
