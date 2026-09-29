import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScrollArea } from "@/components/ui/scroll-area"

const meta: Meta = {
  title: "UI/Containers/ScrollArea",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { rows: 15, height: 160 },
  argTypes: {
    rows: { control: { type: "range", min: 5, max: 30, step: 1 } },
    height: { control: { type: "range", min: 80, max: 320, step: 20 } },
  },
  render: (args: { rows?: number; height?: number }) => {
    const { rows = 15, height = 160 } = args
    return (
      <ScrollArea style={{ height }} className="w-64 rounded-xl border border-things-hairline p-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="py-1.5 text-[13px] text-things-ink">Task {i + 1}</div>
        ))}
      </ScrollArea>
    )
  },
}

export const TaskListScroll: StoryObj = {
  render: () => (
    <ScrollArea className="h-40 w-64 rounded-xl border border-things-hairline p-3">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="py-1.5 text-[13px] text-things-ink">Task {i + 1}</div>
      ))}
    </ScrollArea>
  ),
}
