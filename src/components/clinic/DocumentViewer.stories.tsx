import type { Meta, StoryObj } from "@storybook/react-vite"
import { DocumentViewer } from "./DocumentViewer"
import { PatientHeaderBar } from "./PatientHeaderBar"
import { AtDensity } from "./story-utils"
import { patientA } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof DocumentViewer> = {
  title: "Medical/Medical Component/Document Viewer",
  tags: ["autodocs"],
  component: DocumentViewer,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("DocumentViewer"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const SAMPLE_MARKUP = `LABCORP — COMP METAB PANEL  Accession 26-98765
GLUCOSE,FASTING      120 H  (70-99 mg/dL)
Impaired (fasting): 100-125 mg/dL
All other analytes within reference range.`

export const Playground: Story = {
  argTypes: {
    kind: { control: "radio", options: ["image", "markup"] },
    floating: { control: "boolean" },
    disableResend: { control: "boolean" },
  } as unknown as Meta<typeof DocumentViewer>["argTypes"],
  args: { kind: "markup", floating: false, disableResend: true } as Record<string, unknown>,
  render: (args: any) => (
    <div className="mx-auto flex h-[540px] max-w-3xl">
      <DocumentViewer
        kind={args.kind}
        src={args.kind === "image" ? "https://placehold.co/560x420/fdfcf7/2b2a26/png?text=LabCorp+Results.jpg" : SAMPLE_MARKUP}
        meta={{ filename: "LabCorp Results.jpg", size: "412 KB", id: "1970" }}
        breadcrumb={<>eDocuments / Lab Reports / 2026-09</>}
        patientSlot={<span className="truncate text-xs text-things-gray-3">Re: {patientA.name.given} {patientA.name.family} · {patientA.mrn}</span>}
        floating={args.floating}
        disabledActions={args.disableResend ? ["resend-fax"] : []}
      />
    </div>
  ),
}

export const FloatingChrome: Story = {
  render: () => (
    <div className="mx-auto flex h-[540px] max-w-3xl bg-things-sidebar/40 p-4">
      <DocumentViewer
        kind="markup"
        src={SAMPLE_MARKUP}
        meta={{ filename: "external-hl7.txt", size: "1.2 KB", id: "1971" }}
        floating
        breadcrumb={<>HIE / External content</>}
      />
    </div>
  ),
}
