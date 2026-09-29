import type { Meta, StoryObj } from "@storybook/react-vite"
import { CollapsiblePanel } from "./CollapsiblePanel"
import { PanelStack } from "./PanelStack"

const meta: Meta<typeof PanelStack> = {
  title: "Medical/Medical Shell/Panel Stack",
  tags: ["autodocs"],
  component: PanelStack,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A vertical stack of CollapsiblePanels with optional accordion mode \u2014 open one, the others fold, because five open panels is a wall, not a layout. Remembers nothing between renders unless you control it.\n\n**Watch out:** accordion mode trades exploration for focus. Forms where users cross-reference two panels should not be accordions.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const Panels = () => (
  <>
    <CollapsiblePanel title="Today" variant="panel" className="bg-card" defaultOpen>
      <p className="text-sm text-things-gray-2">8 appointments · 2 walk-ins</p>
    </CollapsiblePanel>
    <CollapsiblePanel title="Calendar" variant="panel" className="bg-card">
      <p className="text-sm text-things-gray-2">September 2026 — 4 markers</p>
    </CollapsiblePanel>
    <CollapsiblePanel title="Providers" variant="panel" className="bg-card">
      <p className="text-sm text-things-gray-2">3 providers on duty</p>
    </CollapsiblePanel>
  </>
)

export const Playground: Story = {
  argTypes: { mode: { control: "radio", options: ["independent", "accordion"] } },
  args: { mode: "accordion" } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-xs">
      <PanelStack mode={args.mode}>
        <Panels />
      </PanelStack>
    </div>
  ),
}
export const Accordion: Story = { render: () => <div className="max-w-xs"><PanelStack mode="accordion"><Panels /></PanelStack></div> }
