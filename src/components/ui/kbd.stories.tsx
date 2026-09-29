import type { Meta, StoryObj } from "@storybook/react-vite"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const meta: Meta<typeof Kbd> = {
  title: "UI/Display/Kbd",
  component: Kbd,
  parameters: { layout: "padded" },
  args: { children: "⌘" },
  argTypes: { children: { control: "text" } },
  render: ({ children }) => (
    <div className="flex items-center gap-3">
      <KbdGroup>
        <Kbd>{children}</Kbd>
        <Kbd>N</Kbd>
      </KbdGroup>
      <span className="text-[13px] text-things-gray-2">New To-Do</span>
    </div>
  ),
}
export default meta

export const Playground: StoryObj<typeof Kbd> = {}
