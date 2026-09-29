import type { Meta, StoryObj } from "@storybook/react-vite"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"

const meta: Meta = {
  title: "UI/Display/Sonner",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { kind: "success", message: "Completed" },
  argTypes: {
    kind: { control: "radio", options: ["success", "error", "info"] },
    message: { control: "text" },
  },
  render: (args: { kind?: "success" | "error" | "info"; message?: string }) => {
    const { kind = "success", message = "" } = args
    const fire = () => {
      if (kind === "error") toast.error(message)
      else if (kind === "info") toast(message)
      else toast.success(message, { action: { label: "Undo", onClick: () => {} } })
    }
    return (
      <div className="flex gap-2">
        <Button size="sm" onClick={fire}>Fire toast</Button>
        <Toaster position="bottom-center" />
      </div>
    )
  },
}

export const Toasts: StoryObj = {
  render: () => (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => toast.success("Completed", { action: { label: "Undo", onClick: () => {} } })}>Completed toast</Button>
      <Button size="sm" variant="outline" onClick={() => toast("Moved to Trash")}>Plain toast</Button>
      <Toaster position="bottom-center" />
    </div>
  ),
}
