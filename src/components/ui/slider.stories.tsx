import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slider } from "@/components/ui/slider"

const meta: Meta<typeof Slider> = {
  title: "UI/Input/Slider",
  component: Slider,
  parameters: { layout: "padded" },
  args: { defaultValue: [30] },
  argTypes: {
    defaultValue: { control: "object" },
    max: { control: { type: "range", min: 10, max: 200, step: 10 } },
    step: { control: { type: "range", min: 1, max: 10 } },
  },
  render: ({ defaultValue, max, step }) => (
    <Slider className="w-64" defaultValue={defaultValue} max={max} step={step} />
  ),
}
export default meta

export const Playground: StoryObj<typeof Slider> = {}
