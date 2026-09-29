import type { Meta, StoryObj } from "@storybook/react-vite"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const meta: Meta = {
  title: "UI/Input/Command",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { placeholder: "Type a command or search…", heading: "Suggestions" },
  argTypes: { placeholder: { control: "text" }, heading: { control: "text" } },
  render: (args: { placeholder?: string; heading?: string }) => {
    const { placeholder = "", heading = "" } = args
    return (
      <Command className="w-72 rounded-xl border border-things-hairline shadow-sm">
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={heading}>
            <CommandItem>New To-Do</CommandItem>
            <CommandItem>New List</CommandItem>
            <CommandItem>Quick Find</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )
  },
}

export const InlinePalette: StoryObj = {
  render: () => (
    <Command className="w-72 rounded-xl border border-things-hairline shadow-sm">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>New To-Do</CommandItem>
          <CommandItem>New List</CommandItem>
          <CommandItem>Quick Find</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
