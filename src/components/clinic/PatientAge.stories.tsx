import type { Meta, StoryObj } from "@storybook/react-vite"
import { PatientAge } from "./PatientAge"
import { AtDensity, ForcedLocale } from "./story-utils"
import { FIXTURE_AS_OF, patientA, patientB } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof PatientAge> = {
  title: "Medical/Medical UI/Patient Age",
  tags: ["autodocs"],
  component: PatientAge,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("PatientAge"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { dob: patientB.dob, asOf: FIXTURE_AS_OF },
  argTypes: {
    dob: { control: "text", description: "ISO date" },
    asOf: { control: "text", description: "ISO date — fixtures are deterministic" },
    precision: { control: "radio", options: ["auto", "y", "ym", "ymd"] },
  },
  render: (args: any) => {
    const { dob = patientB.dob, asOf = FIXTURE_AS_OF, precision = "auto" } = args
    return <PatientAge dob={dob} asOf={asOf} precision={precision} />
  },
}
export default meta

export const Playground: StoryObj<typeof PatientAge> = {}

export const AllStates: StoryObj<typeof PatientAge> = {
  render: () => (
    <div className="flex flex-col gap-2 text-[14px]">
      <span>Adult: <PatientAge dob={patientA.dob} asOf={FIXTURE_AS_OF} /></span>
      <span>Child (7y): <PatientAge dob="2019-01-15" asOf={FIXTURE_AS_OF} /></span>
      <span>Infant (14mo): <PatientAge dob="2025-07-14" asOf={FIXTURE_AS_OF} /></span>
      <span>Forced ymd: <PatientAge dob={patientB.dob} asOf={FIXTURE_AS_OF} precision="ymd" /></span>
    </div>
  ),
}

export const Thai: StoryObj<typeof PatientAge> = {
  parameters: { docs: { description: { story: docsDesc("PatientAge::Thai") } } },
  render: () => (
    <ForcedLocale locale="th">
      <PatientAge dob={patientB.dob} asOf={FIXTURE_AS_OF} precision="ymd" />
    </ForcedLocale>
  ),
}
