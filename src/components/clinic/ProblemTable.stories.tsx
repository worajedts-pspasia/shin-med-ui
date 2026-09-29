import type { Meta, StoryObj } from "@storybook/react-vite"
import { ProblemTable } from "./ClinicalLists"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureProblems } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ProblemTable> = {
  title: "Medical/Medical Component/Problem Table",
  tags: ["autodocs"],
  component: ProblemTable,
  parameters: { layout: "padded", docs: { description: { component: docsDesc("ProblemTable") } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { render: () => <div className="max-w-3xl"><ProblemTable rows={fixtureProblems} /></div> }
export const Thai: Story = { render: () => <ForcedLocale locale="th"><AtDensity density="compact"><div className="max-w-3xl"><ProblemTable rows={fixtureProblems} /></div></AtDensity></ForcedLocale> }
