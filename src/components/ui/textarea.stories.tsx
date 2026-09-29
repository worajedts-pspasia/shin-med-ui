import type { Meta, StoryObj } from "@storybook/react-vite"
import { Textarea } from "@/components/ui/textarea"

const meta: Meta<typeof Textarea> = {
  title: "UI/Input/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
  args: { placeholder: "Notes — 26 g in, 45 s, 1:2 ratio" },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    rows: { control: { type: "range", min: 1, max: 10 } },
  },
  render: ({ placeholder, disabled, rows }) => (
    <Textarea className="w-64" placeholder={placeholder} disabled={disabled} rows={rows} />
  ),
}
export default meta

export const Playground: StoryObj<typeof Textarea> = {}
