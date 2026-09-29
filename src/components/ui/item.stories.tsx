import type { Meta, StoryObj } from "@storybook/react-vite"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"

const meta: Meta = {
  title: "UI/Chat/Item",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { title: "Buy groceries", description: "Milk, eggs, sourdough", withMedia: true },
  argTypes: { title: { control: "text" }, description: { control: "text" }, withMedia: { control: "boolean" } },
  render: (args: { title?: string; description?: string; withMedia?: boolean }) => {
    const { title = "", description = "", withMedia = true } = args
    return (
      <ItemGroup className="w-72">
        <Item>
          {withMedia && <ItemMedia>☑</ItemMedia>}
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    )
  },
}

export const TaskItems: StoryObj = {
  render: () => (
    <ItemGroup className="w-72">
      <Item>
        <ItemMedia>☑</ItemMedia>
        <ItemContent>
          <ItemTitle>Buy groceries</ItemTitle>
          <ItemDescription>Milk, eggs, sourdough</ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia>☐</ItemMedia>
        <ItemContent>
          <ItemTitle>Call the bank</ItemTitle>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
}
