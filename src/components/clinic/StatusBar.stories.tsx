import type { Meta, StoryObj } from "@storybook/react-vite"
import { StatusBar } from "./StatusBar"

const meta: Meta<typeof StatusBar> = {
  title: "Medical/Medical Shell/Status Bar",
  tags: ["autodocs"],
  component: StatusBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The quiet strip along the bottom: connection state, sync freshness, the current user, maybe a global shortcut hint. It's ambient \u2014 present in every peripheral vision, read once an hour.\n\n**Watch out:** if something here *demands* attention, it's in the wrong component \u2014 alerts belong in banners or the ticker, not the status furniture.",
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
