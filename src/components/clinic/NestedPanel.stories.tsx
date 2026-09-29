import type { Meta, StoryObj } from "@storybook/react-vite"
import { NestedPanel } from "./NestedPanel"
import { AtDensity } from "./story-utils"

const meta: Meta<typeof NestedPanel> = {
  title: "Medical/Medical Shell/Nested Panel",
  tags: ["autodocs"],
  component: NestedPanel,
  parameters: { layout: "padded", docs: { description: { component: "The titled sub-panel for adding *one more thing* inside a form \u2014 a header, a single add action, then the growing list of what was added. It answers \"where does the second diagnosis go?\" without a modal.\n\n**Watch out:** it's for homogeneous repeatable entries (findings, codes, line items). Heterogeneous content wants CollapsiblePanel." } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {
  render: () => (
    <div className="max-w-md space-y-3">
      <NestedPanel title="Findings" addLabel="+ ADD / EDIT" onAdd={() => {}}>
        <p className="text-sm text-things-title">LAD 90% pre, TIMI 2 · post 0%, TIMI 3</p>
      </NestedPanel>
      <NestedPanel title="Complications" emptyState={<p className="text-xs text-clinic-ok">None recorded</p>} />
    </div>
  ),
}
