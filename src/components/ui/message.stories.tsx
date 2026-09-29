import type { Meta, StoryObj } from "@storybook/react-vite"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message"

const meta: Meta = {
  title: "UI/Chat/Message",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { sender: "W", content: "Booked the flights for October.", time: "10:31", withFooter: true },
  argTypes: { sender: { control: "text" }, content: { control: "text" }, time: { control: "text" }, withFooter: { control: "boolean" } },
  render: (args: { sender?: string; content?: string; time?: string; withFooter?: boolean }) => {
    const { sender = "", content = "", time = "", withFooter = true } = args
    return (
      <MessageGroup className="max-w-xs">
        <Message>
          <MessageAvatar>{sender}</MessageAvatar>
          <MessageContent>{content}</MessageContent>
          {withFooter && <MessageFooter>{time}</MessageFooter>}
        </Message>
      </MessageGroup>
    )
  },
}

export const ChatThread: StoryObj = {
  render: () => (
    <MessageGroup className="max-w-xs">
      <Message>
        <MessageAvatar>W</MessageAvatar>
        <MessageContent>Booked the flights for October.</MessageContent>
        <MessageFooter>10:31</MessageFooter>
      </Message>
    </MessageGroup>
  ),
}
