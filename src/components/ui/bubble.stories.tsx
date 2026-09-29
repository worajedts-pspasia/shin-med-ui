import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const meta: Meta = {
  title: "UI/Chat/Bubble",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { sent: "Did you book the flights?", received: "Done — deadline was today." },
  argTypes: { sent: { control: "text" }, received: { control: "text" } },
  render: (args: { sent?: string; received?: string }) => {
    const { sent = "", received = "" } = args
    return (
      <BubbleGroup className="max-w-xs">
        <Bubble variant="default"><BubbleContent>{sent}</BubbleContent></Bubble>
        <Bubble variant="muted"><BubbleContent>{received}</BubbleContent></Bubble>
      </BubbleGroup>
    )
  },
}

export const ChatBubbles: StoryObj = {
  render: () => (
    <BubbleGroup className="max-w-xs">
      <Bubble variant="default"><BubbleContent>Did you book the flights?</BubbleContent></Bubble>
      <Bubble variant="muted"><BubbleContent>Done — deadline was today.</BubbleContent></Bubble>
    </BubbleGroup>
  ),
}
