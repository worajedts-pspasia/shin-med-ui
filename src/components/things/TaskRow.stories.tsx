import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TaskRow } from "@/components/things/TaskRow"
import { fixtureTasks } from "@/fixtures"

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

/**
 * Uses the args pattern with nested argTypes (`task.*`), so the Controls panel
 * exposes every visual lever: status, evening, deadline, reminder, title/notes…
 */
const meta: Meta<typeof TaskRow> = {
  title: "Task Management/Task Row",
  tags: ["autodocs"],
  component: TaskRow,
  parameters: {
    layout: "padded",
    viewport: { defaultViewport: "mobile390" },
    docs: {
      description: {
        component:
          "A single to-do. Collapsed shows title + chips (reminder, deadline, tags); expanded opens the inline editor. Toggle every state from Controls.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="w-[360px] rounded-xl bg-white p-2 font-sans shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <Story />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    ),
  ],
  args: {
    task: fixtureTasks[2],
    expanded: false,
  },
  // Dot-notation argTypes are supported by Storybook at runtime; the CSF
  // types do not model them, hence the cast.
  argTypes: ({
    "task.title": { control: "text", description: "To-do title" },
    "task.notes": { control: "text", description: "Notes preview / editor content" },
    "task.status": {
      control: "radio",
      options: ["open", "completed", "canceled"],
      description: "Completed grays the title; canceled shows a struck icon",
    },
    "task.when_date": { control: "text", description: "Scheduled date, YYYY-MM-DD" },
    "task.evening": { control: "boolean", description: "Scheduled for This Evening" },
    "task.someday": { control: "boolean" },
    "task.deadline_date": { control: "text", description: "Deadline date, YYYY-MM-DD — red when ≤ today" },
    "task.reminder_at": { control: "text", description: "Reminder time, HH:MM" },
    expanded: { control: "boolean", description: "Open the inline editor" },
    contextLabel: { control: "text", description: "Project/area label shown above notes" },
  }) as unknown as Meta<typeof TaskRow>["argTypes"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Expanded: Story = { args: { expanded: true } }

export const Completed: Story = {
  args: { task: { ...fixtureTasks[2], status: "completed" as const } },
}

export const EveningWithDeadline: Story = {
  args: {
    task: { ...fixtureTasks[2], evening: true, deadline_date: new Date().toISOString().slice(0, 10) },
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col">
      {fixtureTasks.map((t) => (
        <TaskRow key={t.id} task={t} />
      ))}
    </div>
  ),
}
