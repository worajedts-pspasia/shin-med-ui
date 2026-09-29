import type { Meta, StoryObj } from "@storybook/react-vite"
import { PatientName } from "./PatientName"
import { AtDensity, ForcedLocale } from "./story-utils"
import { patientA, patientB } from "@/fixtures/clinic"

const meta: Meta<typeof PatientName> = {
  title: "Medical/Medical UI/Patient Name",
  tags: ["autodocs"],
  component: PatientName,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Names are locale puzzles \u2014 Thai needs title given family, Japanese wants family first, Western names get middle initials and suffixes. This formatter renders them all correctly from structured parts, with a compact mode that drops the middle name before it ever drops the family name.\n\n**Watch out:** it takes `parts`, never a pre-joined string. Once you concatenate a name yourself, localization is gone forever.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { parts: patientA.name, format: "full" },
  argTypes: ({
    format: { control: "radio", options: ["full", "list", "short"] },
    "parts.title": { control: "text" },
    "parts.given": { control: "text" },
    "parts.family": { control: "text" },
  }) as unknown as Meta<typeof PatientName>["argTypes"],
  render: (args: any) => {
    const { parts = patientA.name, format = "full" } = args
    return <PatientName parts={parts} format={format} />
  },
}
export default meta

export const Playground: StoryObj<typeof PatientName> = {}

export const AllStates: StoryObj<typeof PatientName> = {
  render: () => (
    <div className="flex flex-col gap-2">
      <PatientName parts={patientA.name} />
      <PatientName parts={patientA.name} format="list" />
      <PatientName parts={patientA.name} format="short" />
      <PatientName parts={patientB.name} />
    </div>
  ),
}

export const Thai: StoryObj<typeof PatientName> = {
  parameters: { docs: { description: { story: "นาย วรวุฒิ ศิริธรรม — title given family order." } } },
  render: () => (
    <ForcedLocale locale="th">
      <PatientName parts={patientB.name} />
    </ForcedLocale>
  ),
}

export const Japanese: StoryObj<typeof PatientName> = {
  render: () => (
    <ForcedLocale locale="ja">
      <PatientName parts={patientA.name} />
    </ForcedLocale>
  ),
}
