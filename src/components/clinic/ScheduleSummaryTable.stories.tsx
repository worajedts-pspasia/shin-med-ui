import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScheduleSummaryTable } from "./ScheduleLists"
import { AtDensity } from "./story-utils"
import { fixtureSummaryRows } from "@/fixtures/clinic"

const meta: Meta<typeof ScheduleSummaryTable> = {
  title: "Medical/Medical Component/Schedule Summary Table",
  tags: ["autodocs"],
  component: ScheduleSummaryTable,
  parameters: { layout: "padded", docs: { description: { component: "Six numbers that answer \"how is today going\": Scheduled / Checked-in / Checked-out / No-shows \u00d7 Mine and Total, tabular and clickable \u2014 every cell is a shortcut into the filtered queue.\n\n**Watch out:** the cells are links in disguise; wire the click or remove the affordance. Totals must reconcile with the grid above or one of them is wrong." } } },
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
