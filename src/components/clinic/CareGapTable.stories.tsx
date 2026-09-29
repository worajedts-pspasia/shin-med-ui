import type { Meta, StoryObj } from "@storybook/react-vite"
import { CareGapTable } from "./ClinicalLists"
import { AtDensity, Monochrome } from "./story-utils"
import { fixtureCareGaps } from "@/fixtures/clinic"

const meta: Meta<typeof CareGapTable> = {
  title: "Medical/Medical Component/Care Gap Table",
  tags: ["autodocs"],
  component: CareGapTable,
  parameters: { layout: "padded", docs: { description: { component: "Protocol compliance as a to-do list: each gap (screening due, vaccine due) with its interval, its status and the date that matters. Due rows carry amber \u2014 *due \u2260 dangerous*, deliberately not red.\n\n**Watch out:** the table motivates, it doesn't alarm. If everything is amber, nothing is; sort by most-overdue and let the top rows speak." } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { render: () => <div className="max-w-2xl"><CareGapTable rows={fixtureCareGaps} /></div> }
export const AllMet: Story = { render: () => <div className="max-w-2xl"><CareGapTable rows={fixtureCareGaps.map((g) => ({ ...g, due: false }))} /></div> }
export const MonochromeStory: Story = { name: "Monochrome", render: () => <Monochrome><div className="max-w-2xl"><CareGapTable rows={fixtureCareGaps} /></div></Monochrome> }
