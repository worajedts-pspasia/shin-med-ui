import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ClinicalSummaryColumn, ClinicalSummaryTriptych } from "./ClinicalSummaryColumn"
import { AtDensity, ForcedLocale } from "./story-utils"
import { summaryAllergies, summaryMeds, summaryProblems } from "@/fixtures/clinic"

const meta: Meta<typeof ClinicalSummaryColumn> = {
  title: "Medical/Medical Component/Clinical Summary Column",
  tags: ["autodocs"],
  component: ClinicalSummaryColumn,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The attested chart overview: problems, meds, allergies and vitals as three calm columns (or one, on a phone), each section carrying its reviewed-at date. It's what a specialist reads in the first thirty seconds.\n\n**Watch out:** \"attested\" means the reviewed dates must be real \u2014 a summary with a fabricated attestation date is a compliance problem, not a UI one.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <div className="max-w-xs">
      <ClinicalSummaryColumn title="Medications" items={summaryMeds} reviewedAt="2026-05-03" onReattest={() => {}} onAdd={() => {}} />
    </div>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => (
    <ClinicalSummaryTriptych
      columns={[
        { title: "Allergies", items: summaryAllergies, reviewedAt: "2026-05-03", onReattest: () => {} },
        { title: "Medications", items: summaryMeds, onAdd: () => {} },
        { title: "Problems", items: summaryProblems, reviewedAt: "2026-08-20", onReattest: () => {} },
      ]}
    />
  ),
}

export const ReattestFlow: Story = {
  render: () => {
    const [attested, setAttested] = useState("2026-05-03")
    return (
      <div className="max-w-xs">
        <ClinicalSummaryColumn title="Allergies" items={summaryAllergies} reviewedAt={attested} onReattest={() => setAttested("2026-09-28")} />
        <p className="mt-2 text-xs text-things-gray-3">Click the reviewed stamp — it re-attests to today.</p>
      </div>
    )
  },
}

export const Loading: Story = { render: () => <div className="max-w-xs"><ClinicalSummaryColumn title="Medications" items={[]} loading /></div> }

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-xs">
          <ClinicalSummaryColumn title="ประวัติแพ้" items={summaryAllergies} reviewedAt="2026-05-03" onReattest={() => {}} />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}
