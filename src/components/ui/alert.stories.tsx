import type { Meta, StoryObj } from "@storybook/react-vite"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

const meta: Meta<typeof Alert> = {
  title: "UI/Display/Alert",
  component: Alert,
  parameters: { layout: "padded" },
  args: { variant: "default" },
  argTypes: {
    variant: { control: "radio", options: ["default", "destructive"] },
  },
  render: ({ variant }) => (
    <Alert className="max-w-sm" variant={variant}>
      <Terminal className="size-4" />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can compose the app shell from these primitives.</AlertDescription>
    </Alert>
  ),
}
export default meta

export const Playground: StoryObj<typeof Alert> = {}
