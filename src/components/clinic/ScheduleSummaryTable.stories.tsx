import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScheduleSummaryTable } from "./ScheduleLists"
import { AtDensity } from "./story-utils"
import { fixtureSummaryRows } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ScheduleSummaryTable> = {
  title: "Medical/Medical Component/Schedule Summary Table",
  tags: ["autodocs"],
  component: ScheduleSummaryTable,
  parameters: { layout: "padded", docs: { description: { component: docsDesc("ScheduleSummaryTable") } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {
  render: () => (
    <div className="max-w-xs rounded-md border border-things-hairline bg-card p-2">
      <ScheduleSummaryTable date="Mon, Sep 28, 2026" rows={fixtureSummaryRows} onCell={(s, mine) => console.log("filter", s, mine)} />
    </div>
  ),
}
