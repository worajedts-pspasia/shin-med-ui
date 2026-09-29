import type { Meta, StoryObj } from "@storybook/react-vite"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"

const meta: Meta = {
  title: "UI/Input/InputGroup",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { addon: "⌘K", placeholder: "Search…", disabled: false },
  argTypes: { addon: { control: "text" }, placeholder: { control: "text" }, disabled: { control: "boolean" } },
  render: (args: { addon?: string; placeholder?: string; disabled?: boolean }) => {
    const { addon = "", placeholder = "", disabled = false } = args
    return (
      <InputGroup className="w-64">
        <InputGroupAddon align="inline-start"><InputGroupText>{addon}</InputGroupText></InputGroupAddon>
        <InputGroupInput placeholder={placeholder} disabled={disabled} />
      </InputGroup>
    )
  },
}

export const SearchBox: StoryObj = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon align="inline-start"><InputGroupText>⌘K</InputGroupText></InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>
  ),
}
