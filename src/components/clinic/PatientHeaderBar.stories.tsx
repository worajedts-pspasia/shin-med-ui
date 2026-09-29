import type { Meta, StoryObj } from "@storybook/react-vite"
import { PatientHeaderBar } from "./PatientHeaderBar"
import { AtDensity, ForcedLocale } from "./story-utils"
import { allergiesA, FIXTURE_AS_OF, patientA, patientB } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof PatientHeaderBar> = {
  title: "Medical/Medical Component/Patient Header Bar",
  tags: ["autodocs"],
  component: PatientHeaderBar,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("PatientHeaderBar"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: {
    patient: patientA,
    asOf: FIXTURE_AS_OF,
    alerts: [
      { kind: "allergy", label: `Allergies: ${allergiesA.map((a) => a.allergen).join(", ")}` },
      { kind: "flag", label: "Fall risk" },
    ],
  },
  argTypes: {
    compact: { control: "boolean" },
    favorite: { control: "boolean" },
  },
  render: (args: any) => {
    const { patient = patientA, asOf = FIXTURE_AS_OF, alerts, compact = false, favorite = false } = args
    return (
      <PatientHeaderBar
        patient={patient}
        asOf={asOf}
        alerts={alerts}
        compact={compact}
        favorite={favorite}
        onToggleFavorite={() => {}}
        nextAppointment={{ date: "2026-10-14", time: "09:30", with: "Dr. Tan" }}
      />
    )
  },
}
export default meta

export const Playground: StoryObj<typeof PatientHeaderBar> = {}

export const AllStates: StoryObj<typeof PatientHeaderBar> = {
  render: () => (
    <div className="flex w-full max-w-[520px] flex-col gap-4">
      <PatientHeaderBar patient={patientA} asOf={FIXTURE_AS_OF} alerts={[{ kind: "allergy", label: "Allergies: Penicillin, Latex" }]} />
      <PatientHeaderBar patient={patientA} asOf={FIXTURE_AS_OF} compact />
      <PatientHeaderBar patient={patientA} asOf={FIXTURE_AS_OF} favorite onToggleFavorite={() => {}} />
    </div>
  ),
}

export const Thai: StoryObj<typeof PatientHeaderBar> = {
  parameters: { docs: { description: { story: docsDesc("PatientHeaderBar::Thai") } } },
  render: () => (
    <ForcedLocale locale="th">
      <PatientHeaderBar
        patient={patientB}
        asOf={FIXTURE_AS_OF}
        alerts={[{ kind: "allergy", label: "แพ้ Penicillin — ผื่น" }]}
        nextAppointment={{ date: "2026-10-14", time: "09:30", with: "พญ. ใจดี" }}
      />
    </ForcedLocale>
  ),
}

export const Dense: StoryObj<typeof PatientHeaderBar> = {
  render: () => (
    <AtDensity density="dense">
      <PatientHeaderBar patient={patientA} asOf={FIXTURE_AS_OF} compact />
    </AtDensity>
  ),
}
