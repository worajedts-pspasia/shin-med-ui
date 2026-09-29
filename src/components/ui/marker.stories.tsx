import type { Meta, StoryObj } from "@storybook/react-vite"
import { Marker } from "@/components/ui/marker"

const meta: Meta = {
  title: "UI/Display/Marker",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { variant: "default", label: "W" },
  argTypes: {
    variant: { control: "radio", options: ["default", "border", "separator"] },
    label: { control: "text", description: "Fallback letter (border variant)" },
  },
  render: (args: { variant?: "default" | "border" | "separator"; label?: string }) => {
    const { variant = "default", label = "W" } = args
    return (
      <div className="flex items-center gap-3">
        {variant === "border" ? <Marker variant="border">{label}</Marker> : <Marker variant={variant} />}
      </div>
    )
  },
}

export const Dots: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <Marker />
      <Marker variant="border">W</Marker>
      <Marker variant="separator" />
    </div>
  ),
}
