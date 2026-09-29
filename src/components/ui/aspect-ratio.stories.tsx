import type { Meta, StoryObj } from "@storybook/react-vite"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
  title: "UI/Containers/AspectRatio",
  component: AspectRatio,
  parameters: { layout: "padded" },
  args: { ratio: 16 / 9 },
  argTypes: {
    ratio: { control: { type: "range", min: 0.5, max: 3, step: 0.05 } },
  },
  render: ({ ratio = 16 / 9 }) => (
    <div className="w-64 overflow-hidden rounded-xl">
      <AspectRatio ratio={ratio}>
        <div className="flex size-full items-center justify-center bg-things-chip text-[13px] text-things-gray-2">
          {ratio.toFixed(2)} : 1
        </div>
      </AspectRatio>
    </div>
  ),
}
export default meta

export const Playground: StoryObj<typeof AspectRatio> = {}
