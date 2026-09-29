import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { GeneratedSummaryPanel, TemplateSelect } from "./TemplateSelect"
import { fixtureSummarySegments, fixtureTemplates } from "@/fixtures/clinic"

const meta: Meta<typeof TemplateSelect> = {
  title: "Medical/Medical Component/Template Select",
  tags: ["autodocs"],
  component: TemplateSelect,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Template-driven documentation: pick the template, and the narrative writes itself \u2014 each underlined phrase is a live link back to the control that produced it, so the prose can never drift from the structured data. Editing the field rewrites the sentence.\n\n**Watch out:** the panel is read-only by design \u2014 if users start typing into it, the template is wrong, not the component. Derived text is the whole point.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const CONTROL_HINTS: Record<string, string> = {
  bp: "Vitals → Blood pressure (128/78 mmHg)",
  meds: "Medications → Metformin 500 mg",
  a1c: "Results → HbA1c (6.8%)",
  plan: "Plan → recheck A1c in 6 months",
}

function Demo() {
  const [tpl, setTpl] = useState("ccf")
  const [jumped, setJumped] = useState<string | null>(null)
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <TemplateSelect templates={fixtureTemplates} value={tpl} onSelect={setTpl} />
      <GeneratedSummaryPanel
        templateLabel={fixtureTemplates.find((t) => t.id === tpl)?.label}
        segments={fixtureSummarySegments}
        onJump={(controlId) => setJumped(controlId)}
      />
      {jumped && (
        <p data-jumped={jumped} className="rounded-md bg-things-blue-soft px-3 py-2 text-xs text-things-blue">
          Jumped to: {CONTROL_HINTS[jumped] ?? jumped}
        </p>
      )}
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }

export const NoTemplate: Story = {
  parameters: { docs: { description: { story: "Nothing selected — the panel still renders its empty header state." } } },
  render: () => (
    <div className="mx-auto max-w-2xl">
      <TemplateSelect templates={fixtureTemplates} onSelect={() => {}} />
      <div className="mt-4">
        <GeneratedSummaryPanel segments={[]} />
      </div>
    </div>
  ),
}
