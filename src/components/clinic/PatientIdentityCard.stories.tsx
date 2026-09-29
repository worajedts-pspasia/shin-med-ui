import type { Meta, StoryObj } from "@storybook/react-vite"
import { PatientIdentityCard } from "./PatientIdentityCard"
import { ForcedLocale } from "./story-utils"
import { patientA, patientB, patientBAddress } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof PatientIdentityCard> = {
  title: "Medical/Medical UI/Patient Identity Card",
  tags: ["autodocs"],
  component: PatientIdentityCard,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("PatientIdentityCard"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: {
    orientation: { control: "radio", options: ["portrait", "row"] },
    withPhotoAction: { control: "boolean" },
    full: { control: "boolean" },
  } as unknown as Meta<typeof PatientIdentityCard>["argTypes"],
  args: { orientation: "portrait", withPhotoAction: true, full: false } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-xs">
      <PatientIdentityCard
        patient={patientA}
        phone="(317) 555-0100"
        insurance="DemoCare — OPD"
        orientation={args.orientation}
        onChangePhoto={args.withPhotoAction ? () => {} : undefined}
        fields={args.full ? ["dob", "sex", "phone", "address", "insurance", "mrn"] : ["dob", "sex", "mrn"]}
      />
    </div>
  ),
}

export const Portrait: Story = { render: () => <div className="max-w-xs"><PatientIdentityCard patient={patientA} phone="(317) 555-0100" onChangePhoto={() => {}} /></div> }

export const Row: Story = {
  render: () => (
    <div className="max-w-md">
      <PatientIdentityCard patient={patientB} phone="(317) 555-0102" address={patientBAddress} fields={["dob", "sex", "phone", "address", "mrn"]} orientation="row" />
    </div>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <div className="max-w-xs">
        <PatientIdentityCard patient={patientB} address={patientBAddress} fields={["dob", "sex", "mrn", "address"]} />
      </div>
    </ForcedLocale>
  ),
}
