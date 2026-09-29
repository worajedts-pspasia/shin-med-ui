import type { Meta, StoryObj } from "@storybook/react-vite"
import { StatusBar } from "./StatusBar"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof StatusBar> = {
  title: "Medical/Medical Shell/Status Bar",
  tags: ["autodocs"],
  component: StatusBar,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("StatusBar"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: { env: { control: "radio", options: ["none", "training", "staging"] } } as unknown as Meta<typeof StatusBar>["argTypes"],
  args: { env: "training" } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-2xl overflow-hidden rounded-md border border-things-hairline">
      <StatusBar
        left="Session 00:42:10"
        center="Dr. Test Physician"
        right="v1.0.0 · demo data"
        environment={args.env === "none" ? undefined : { label: args.env === "training" ? "Training" : "Staging", tone: args.env === "staging" ? "critical" : "warn" }}
      />
    </div>
  ),
}
export const Default: Story = { name: "Default", render: () => <div className="max-w-2xl overflow-hidden rounded-md border border-things-hairline"><StatusBar left="Session 00:42:10" center="Dr. Test Physician" right="v1.0.0" /></div> }
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile390" } },
  render: () => (
    <div className="max-w-[390px] overflow-hidden rounded-md border border-things-hairline">
      <StatusBar left="Session 00:42:10" center="Dr. Test Physician" right="v1.0.0" environment={{ label: "Training" }} />
    </div>
  ),
}
