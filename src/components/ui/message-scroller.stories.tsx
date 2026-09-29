import type { Meta, StoryObj } from "@storybook/react-vite"
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerViewport } from "@/components/ui/message-scroller"
import { Message, MessageContent, MessageGroup } from "@/components/ui/message"

const meta: Meta = {
  title: "UI/Chat/MessageScroller",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { count: 8 },
  argTypes: { count: { control: { type: "range", min: 3, max: 15, step: 1 } } },
  render: (args: { count?: number }) => {
    const { count = 8 } = args
    return (
      <div className="w-72">
        <MessageScroller>
          <MessageScrollerViewport className="h-40">
            <MessageScrollerContent>
              {Array.from({ length: count }).map((_, i) => (
                <MessageScrollerItem key={i}>
                  <MessageGroup>
                    <Message><MessageContent>Message {i + 1}</MessageContent></Message>
                  </MessageGroup>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </div>
    )
  },
}

export const ScrollToNew: StoryObj = {
  render: () => (
    <div className="w-72">
      <MessageScroller>
        <MessageScrollerViewport className="h-40">
          <MessageScrollerContent>
            {Array.from({ length: 8 }).map((_, i) => (
              <MessageScrollerItem key={i}>
                <MessageGroup>
                  <Message>
                    <MessageContent>Message {i + 1}</MessageContent>
                  </Message>
                </MessageGroup>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </div>
  ),
}
