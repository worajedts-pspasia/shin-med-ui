import type { Meta, StoryObj } from "@storybook/react-vite"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"

const meta: Meta = {
  title: "UI/Display/Avatar",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { fallback: "W", size: "md", grouped: false },
  argTypes: {
    fallback: { control: "text" },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    grouped: { control: "boolean", description: "Show as a group" },
  },
  render: (args: { fallback?: string; size?: "sm" | "md" | "lg"; grouped?: boolean }) => {
    const { fallback = "W", size = "md", grouped = false } = args
    const cls = size === "sm" ? "size-8" : size === "lg" ? "size-12" : "size-10"
    return grouped ? (
      <AvatarGroup>
        <Avatar className={cls}><AvatarFallback>{fallback}</AvatarFallback></Avatar>
        <Avatar className={cls}><AvatarFallback>DN</AvatarFallback></Avatar>
        <Avatar className={cls}><AvatarFallback>+</AvatarFallback></Avatar>
      </AvatarGroup>
    ) : (
      <Avatar className={cls}>
        <AvatarImage src="https://i.pravatar.cc/64?img=12" alt={fallback} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    )
  },
}

export const FallbackAndGroup: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="Nim" />
        <AvatarFallback>N</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar><AvatarFallback>WS</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>DN</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>+</AvatarFallback></Avatar>
      </AvatarGroup>
    </div>
  ),
}
