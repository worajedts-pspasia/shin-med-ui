import type { Meta, StoryObj } from "@storybook/react-vite"
import { Spinner } from "@/components/ui/spinner"

const meta: Meta<typeof Spinner> = {
  title: "UI/Display/Spinner",
  component: Spinner,
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-3">
      <Spinner className="size-4" />
      <span className="text-[13px] text-things-gray">Loading tasks…</span>
    </div>
  ),
}
export default meta

export const Playground: StoryObj = {
  args: { size: 16, label: "Loading tasks…" },
  argTypes: {
    size: { control: { type: "range", min: 12, max: 40, step: 2 } },
    label: { control: "text" },
  },
  render: (args: { size?: number; label?: string }) => {
    const { size = 16, label = "" } = args
    return (
      <div className="flex items-center gap-3">
        <Spinner style={{ width: size, height: size }} />
        <span className="text-[13px] text-things-gray">{label}</span>
      </div>
    )
  },
}

export const Loading: StoryObj<typeof Spinner> = {}
