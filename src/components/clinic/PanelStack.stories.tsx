import type { Meta, StoryObj } from "@storybook/react-vite"
import { CollapsiblePanel } from "./CollapsiblePanel"
import { PanelStack } from "./PanelStack"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof PanelStack> = {
  title: "Medical/Medical Shell/Panel Stack",
  tags: ["autodocs"],
  component: PanelStack,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("PanelStack"),
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
