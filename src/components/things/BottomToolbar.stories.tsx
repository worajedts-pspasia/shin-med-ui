import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BottomToolbar } from "@/components/things/BottomToolbar"
import { NewTodoDialog } from "@/components/things/NewTodoDialog"
import { TaskRow } from "@/components/things/TaskRow"
import { fixtureTasks } from "@/fixtures"
import { docsDesc } from "@/lib/docs-desc"

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

const meta: Meta<typeof BottomToolbar> = {
  title: "Task Management/Bottom Toolbar",
  tags: ["autodocs"],
  component: BottomToolbar,
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: docsDesc("BottomToolbar"),
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="relative h-full w-full bg-white font-sans">
            <Story />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    ),
  ],
  args: {
    floating: true,
    hasSelection: false,
  },
  argTypes: {
    floating: { control: "boolean", description: "Floating card (desktop) vs docked bar (mobile)" },
    hasSelection: { control: "boolean", description: "Enable the task tools" },
  },
  render: ({ floating, hasSelection }) => (
    <div className={floating ? "absolute bottom-4 left-4" : "absolute inset-x-0 bottom-0"}>
      <BottomToolbar
        floating={floating}
        hasSelection={hasSelection}
        onNewTodo={() => {}}
        onQuickFind={() => {}}
        onSchedule={() => {}}
        onDeadline={() => {}}
        onChecklist={() => {}}
      />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const DockedMobileWithSelection: Story = {
  parameters: { viewport: { defaultViewport: "mobile390" } },
  args: { floating: false, hasSelection: true },
}

export const OpensNewTodoDialog: Story = {
  parameters: { viewport: { defaultViewport: "desktop1280" } },
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <div className="flex flex-col gap-0.5 p-16 pb-24">
          {fixtureTasks.slice(0, 5).map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
        <div className="absolute bottom-4 left-4">
          <BottomToolbar
            floating
            hasSelection={false}
            onNewTodo={() => setOpen(true)}
            onQuickFind={() => {}}
            onSchedule={() => {}}
            onDeadline={() => {}}
            onChecklist={() => {}}
          />
        </div>
        <NewTodoDialog open={open} onOpenChange={setOpen} />
      </>
    )
  },
}
