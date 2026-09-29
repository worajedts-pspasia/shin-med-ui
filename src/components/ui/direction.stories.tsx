import type { Meta, StoryObj } from "@storybook/react-vite"
import { DirectionProvider } from "@/components/ui/direction"

const meta: Meta = {
  title: "UI/Display/Direction",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { dir: "rtl", text: "RTL direction wrapper for locales that need it." },
  argTypes: { dir: { control: "radio", options: ["ltr", "rtl"] }, text: { control: "text" } },
  render: (args: { dir?: "ltr" | "rtl"; text?: string }) => {
    const { dir = "rtl", text = "" } = args
    return (
      <DirectionProvider dir={dir}>
        <div className="rounded-lg border border-things-hairline p-4 text-[13px] text-things-ink" dir={dir}>
          {text}
        </div>
      </DirectionProvider>
    )
  },
}

export const RtlWrapper: StoryObj = {
  render: () => (
    <DirectionProvider dir="rtl">
      <div className="rounded-lg border border-things-hairline p-4 text-[13px] text-things-ink" dir="rtl">
        RTL direction wrapper for locales that need it.
      </div>
    </DirectionProvider>
  ),
}
