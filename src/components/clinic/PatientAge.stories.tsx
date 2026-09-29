import type { Meta, StoryObj } from "@storybook/react-vite"
import { PatientAge } from "./PatientAge"
import { AtDensity, ForcedLocale } from "./story-utils"
import { FIXTURE_AS_OF, patientA, patientB } from "@/fixtures/clinic"

const meta: Meta<typeof PatientAge> = {
  title: "Medical/Medical UI/Patient Age",
  tags: ["autodocs"],
  component: PatientAge,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "An age that tells the truth in three locales \u2014 \"46y\" in English, \"42 \u0e1b\u0e35 6 \u0e40\u0e14\u0e37\u0e2d\u0e19\" in Thai, years-and-months precision for pediatric ranges, all computed from DOB against a fixed reference so tests never flake.\n\n**Watch out:** never hand-format ages from raw strings; the pediatric month precision and locale rules live here for a reason.",
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
  parameters: { docs: { description: { story: "42 ปี 6 ด. 8 ว. — matches the 02.1 screenshot exactly." } } },
  render: () => (
    <ForcedLocale locale="th">
      <PatientAge dob={patientB.dob} asOf={FIXTURE_AS_OF} precision="ymd" />
    </ForcedLocale>
  ),
}
