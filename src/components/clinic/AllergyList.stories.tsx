import type { Meta, StoryObj } from "@storybook/react-vite"
import { AllergyList } from "./ClinicalLists"
import { AtDensity, Monochrome } from "./story-utils"
import { allergiesA } from "@/fixtures/clinic"

const meta: Meta<typeof AllergyList> = {
  title: "Medical/Medical Component/Allergy List",
  tags: ["autodocs"],
  component: AllergyList,
  parameters: { layout: "padded", docs: { description: { component: "The chart's allergy section: allergen \u2192 reaction \u2192 severity \u2192 when recorded, in a calm table that groups by nothing and hides nothing. It's the reference a prescriber scans before signing.\n\n**Watch out:** severity here is clinical grading, and the not-recorded case still needs to *say so* \u2014 silence in an allergy list reads as \"none\", which is a dangerous assumption." } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const rows = allergiesA.map((a, i) => ({ id: `al${i}`, allergen: a.allergen, reactions: [a.reaction ?? "—"], severity: a.severity, onsetAt: a.recordedAt, source: "Patient" }))

export const Playground: Story = { render: () => <div className="max-w-2xl rounded-md border border-things-hairline bg-card"><AllergyList allergies={rows} onRowClick={() => {}} /></div> }
export const MonochromeStory: Story = { name: "Monochrome", render: () => <Monochrome><div className="max-w-2xl rounded-md border border-things-hairline bg-card"><AllergyList allergies={rows} /></div></Monochrome> }
