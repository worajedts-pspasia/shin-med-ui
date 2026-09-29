import type { Meta, StoryObj } from "@storybook/react-vite"
import { Progress } from "@/components/ui/progress"

const meta: Meta<typeof Progress> = {
  title: "UI/Display/Progress",
  component: Progress,
  parameters: { layout: "padded" },
  args: { value: 60 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  render: ({ value }) => <Progress className="w-64" value={value} />,
}
export default meta

export const Playground: StoryObj<typeof Progress> = {}

export const Values: StoryObj<typeof Progress> = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Progress value={25} />
      <Progress value={60} />
      <Progress value={100} />
    </div>
  ),
}
