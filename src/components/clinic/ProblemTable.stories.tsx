import type { Meta, StoryObj } from "@storybook/react-vite"
import { ProblemTable } from "./ClinicalLists"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureProblems } from "@/fixtures/clinic"

const meta: Meta<typeof ProblemTable> = {
  title: "Medical/Medical Component/Problem Table",
  tags: ["autodocs"],
  component: ProblemTable,
  parameters: { layout: "padded", docs: { description: { component: "The problem list: coded problems with status (active/resolved), onset dates and code badges, sorted so what matters today is on top. It's the chart's table of contents and every other component links into it.\n\n**Watch out:** resolved problems stay visible \u2014 the history is the value. Every problem should carry its code; free-text problems lose you the decision support." } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { render: () => <div className="max-w-3xl"><ProblemTable rows={fixtureProblems} /></div> }
export const Thai: Story = { render: () => <ForcedLocale locale="th"><AtDensity density="compact"><div className="max-w-3xl"><ProblemTable rows={fixtureProblems} /></div></AtDensity></ForcedLocale> }
