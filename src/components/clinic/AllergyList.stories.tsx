import type { Meta, StoryObj } from "@storybook/react-vite"
import { AllergyList } from "./ClinicalLists"
import { AtDensity, Monochrome } from "./story-utils"
import { allergiesA } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof AllergyList> = {
  title: "Medical/Medical Component/Allergy List",
  tags: ["autodocs"],
  component: AllergyList,
  parameters: { layout: "padded", docs: { description: { component: docsDesc("AllergyList") } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const rows = allergiesA.map((a, i) => ({ id: `al${i}`, allergen: a.allergen, reactions: [a.reaction ?? "—"], severity: a.severity, onsetAt: a.recordedAt, source: "Patient" }))

export const Playground: Story = { render: () => <div className="max-w-2xl rounded-md border border-things-hairline bg-card"><AllergyList allergies={rows} onRowClick={() => {}} /></div> }
export const MonochromeStory: Story = { name: "Monochrome", render: () => <Monochrome><div className="max-w-2xl rounded-md border border-things-hairline bg-card"><AllergyList allergies={rows} /></div></Monochrome> }
