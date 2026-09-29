import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const meta: Meta<any> = {
  title: "UI/Containers/Resizable",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { dir: "horizontal", firstSize: 30 },
  argTypes: {
    dir: { control: "radio", options: ["horizontal", "vertical"] },
    firstSize: { control: { type: "range", min: 10, max: 80, step: 5 } },
  },
  render: (args: { dir?: "horizontal" | "vertical"; firstSize?: number }) => {
    const { dir = "horizontal", firstSize = 30 } = args
    return (
    <ResizablePanelGroup dir={dir} className={dir === "horizontal" ? "h-40 max-w-md" : "h-64 max-w-xs"}>
      <ResizablePanel defaultSize={firstSize}><div className="flex size-full items-center justify-center bg-things-sidebar text-[12px] text-things-ink">Sidebar</div></ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={100 - firstSize}><div className="flex size-full items-center justify-center text-[12px] text-things-ink">Content</div></ResizablePanel>
    </ResizablePanelGroup>
    )
  },
}

export const SidebarPreview: StoryObj = {
  render: () => (
    <ResizablePanelGroup className="h-40 max-w-md rounded-xl border border-things-hairline">
      <ResizablePanel defaultSize={30}><div className="flex size-full items-center justify-center bg-things-sidebar text-[12px] text-things-ink">Sidebar</div></ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}><div className="flex size-full items-center justify-center text-[12px] text-things-ink">Content</div></ResizablePanel>
    </ResizablePanelGroup>
  ),
}
