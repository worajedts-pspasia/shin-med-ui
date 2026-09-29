import type { Meta, StoryObj } from "@storybook/react-vite"
import { NestedPanel } from "./NestedPanel"
import { AtDensity } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof NestedPanel> = {
  title: "Medical/Medical Shell/Nested Panel",
  tags: ["autodocs"],
  component: NestedPanel,
  parameters: { layout: "padded", docs: { description: { component: docsDesc("NestedPanel") } } },
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
