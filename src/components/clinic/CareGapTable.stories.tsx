import type { Meta, StoryObj } from "@storybook/react-vite"
import { CareGapTable } from "./ClinicalLists"
import { AtDensity, Monochrome } from "./story-utils"
import { fixtureCareGaps } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof CareGapTable> = {
  title: "Medical/Medical Component/Care Gap Table",
  tags: ["autodocs"],
  component: CareGapTable,
  parameters: { layout: "padded", docs: { description: { component: docsDesc("CareGapTable") } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { render: () => <div className="max-w-2xl"><CareGapTable rows={fixtureCareGaps} /></div> }
export const AllMet: Story = { render: () => <div className="max-w-2xl"><CareGapTable rows={fixtureCareGaps.map((g) => ({ ...g, due: false }))} /></div> }
export const MonochromeStory: Story = { name: "Monochrome", render: () => <Monochrome><div className="max-w-2xl"><CareGapTable rows={fixtureCareGaps} /></div></Monochrome> }
