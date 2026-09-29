import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { PrescriptionPreview } from "./PrescriptionPreview"
import { ForcedLocale } from "./story-utils"
import { fixturePharmacy, fixturePrescriber, fixtureRx, patientA } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof PrescriptionPreview> = {
  title: "Medical/Medical Component/Prescription Preview",
  tags: ["autodocs"],
  component: PrescriptionPreview,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("PrescriptionPreview"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ interactionsVerified = true }: { interactionsVerified?: boolean }) {
  const [sent, setSent] = useState(false)
  return (
    <div className="max-w-3xl rounded-md border border-things-hairline bg-things-sidebar/40 p-4">
      <PrescriptionPreview
        rx={fixtureRx}
        patient={{ name: patientA.name, dob: patientA.dob, mrn: patientA.mrn }}
        prescriber={fixturePrescriber}
        pharmacy={fixturePharmacy}
        interactionsVerified={interactionsVerified}
        actions={[
          { label: "Coverage", onSelect: () => {} },
          { label: "Save", onSelect: () => {} },
          { label: "Print", onSelect: () => {}, variant: "outline" },
        ]}
        onSend={() => setSent(true)}
      />
      {sent && <p className="mt-2 text-center text-xs text-clinic-ok">Sent to Siri Pharmacy.</p>}
    </div>
  )
}

export const Playground: Story = {
  argTypes: { interactionsVerified: { control: "boolean" } },
  args: { interactionsVerified: true } as Record<string, unknown>,
  render: (args: any) => <Demo interactionsVerified={args.interactionsVerified} />,
}
export const Default: Story = { name: "Default", render: () => <Demo /> }
export const PendingInteractions: Story = {
  parameters: { docs: { description: { story: docsDesc("PrescriptionPreview::PendingInteractions") } } },
  render: () => <Demo interactionsVerified={false} />,
}
export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <Demo />
    </ForcedLocale>
  ),
}
