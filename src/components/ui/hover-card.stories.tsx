import type { Meta, StoryObj } from "@storybook/react-vite"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const meta: Meta = {
  title: "UI/Display/HoverCard",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { trigger: "House", title: "House", detail: "2 open · everything about the apartment" },
  argTypes: { trigger: { control: "text" }, title: { control: "text" }, detail: { control: "text" } },
  render: (args: { trigger?: string; title?: string; detail?: string }) => {
    const { trigger = "", title = "", detail = "" } = args
    return (
      <HoverCard>
        <HoverCardTrigger className="cursor-pointer text-[13px] font-medium text-things-blue">{trigger}</HoverCardTrigger>
        <HoverCardContent className="w-56">
          <p className="text-[13px] font-semibold text-things-title">{title}</p>
          <p className="text-[12px] text-things-gray">{detail}</p>
        </HoverCardContent>
      </HoverCard>
    )
  },
}

export const ProjectPeek: StoryObj = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer text-[13px] font-medium text-things-blue">House</HoverCardTrigger>
      <HoverCardContent className="w-56">
        <p className="text-[13px] font-semibold text-things-title">House</p>
        <p className="text-[12px] text-things-gray">2 open · everything about the apartment</p>
      </HoverCardContent>
    </HoverCard>
  ),
}
