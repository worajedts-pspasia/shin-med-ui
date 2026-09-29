import type { Meta, StoryObj } from "@storybook/react-vite"
import { Skeleton } from "@/components/ui/skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "UI/Display/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
  args: { className: "h-3.5 w-64" },
  argTypes: {
    className: { control: "text", description: "Tailwind size classes, e.g. h-4 w-40" },
  },
  render: ({ className }) => <Skeleton className={className} />,
}
export default meta

export const Playground: StoryObj<typeof Skeleton> = {}

export const TaskRowLoading: StoryObj<typeof Skeleton> = {
  render: () => (
    <div className="flex w-72 items-center gap-3">
      <Skeleton className="size-[19px] rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
  ),
}
