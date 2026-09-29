import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@/components/ui/input"

const meta: Meta<typeof Input> = {
  title: "UI/Input/Input",
  component: Input,
  parameters: { layout: "padded" },
  args: { placeholder: "New To-Do" },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    type: { control: "radio", options: ["text", "email", "password", "number"] },
  },
  render: ({ placeholder, disabled, type }) => (
    <Input className="w-64" placeholder={placeholder} disabled={disabled} type={type} />
  ),
}
export default meta

export const Playground: StoryObj<typeof Input> = {}

export const States: StoryObj<typeof Input> = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Input placeholder="New To-Do" />
      <Input defaultValue="Buy groceries" />
      <Input disabled placeholder="Disabled" />
    </div>
  ),
}
