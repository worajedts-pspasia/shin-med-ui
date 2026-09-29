import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NewTodoDialog } from "@/components/things/NewTodoDialog"
import { TaskRow } from "@/components/things/TaskRow"
import { fixtureTasks } from "@/fixtures"

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

/** Miniature app page shown behind the dialog, so stories/docs render the
 * dialog in context — dimmed overlay over a real Today list. */
function AppBackdrop() {
  return (
    <div className="flex h-full flex-col bg-things-window p-6">
      <div className="mx-auto flex h-full w-full max-w-[380px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/10">
        <div className="flex h-[52px] shrink-0 items-center border-b border-things-hairline px-4">
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-things-title">Today</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2">
          {fixtureTasks.slice(0, 5).map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
          <p className="px-3 pt-4 text-[12.5px] text-things-gray">
            + 3 more to-dos
          </p>
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof NewTodoDialog> = {
  title: "Task Management/New To-Do Dialog",
  component: NewTodoDialog,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Quick entry for a new to-do: title, When shortcut, and destination list. Rendered over a mock Today page to show the dimmed backdrop in context.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </QueryClientProvider>
    ),
  ],
  args: {
    open: true,
    defaultWhen: "today",
  },
  argTypes: {
    open: { control: "boolean", description: "Dialog visibility" },
    defaultWhen: {
      control: "radio",
      options: ["today", "tomorrow"],
      description: "Pre-selected When shortcut",
    },
  },
  render: ({ open, defaultWhen }) => (
    <>
      <AppBackdrop />
      <NewTodoDialog open={open} onOpenChange={() => {}} defaultWhen={defaultWhen} />
    </>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {}
