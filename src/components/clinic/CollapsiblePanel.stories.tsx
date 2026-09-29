import type { Meta, StoryObj } from "@storybook/react-vite"
import { CollapsiblePanel } from "./CollapsiblePanel"
import { AtDensity } from "./story-utils"

const meta: Meta<typeof CollapsiblePanel> = {
  title: "Medical/Medical Shell/Collapsible Panel",
  tags: ["autodocs"],
  component: CollapsiblePanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The universal titled panel that opens and closes: header with title, meta and its chevron, content that collapses with a height animation you never have to think about. Open state can be controlled; the chevron rotates, the header stays clickable.\n\n**Watch out:** panels host content, they don't own it \u2014 actions live in the header's trailing slot, not floating inside the body.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { title: "Medications", variant: "panel", defaultOpen: true },
  argTypes: {
    title: { control: "text" },
    variant: { control: "radio", options: ["panel", "section", "inline"] },
    defaultOpen: { control: "boolean" },
    status: { control: "radio", options: ["none", "ok", "warn", "critical"] },
  },
  render: (args: any) => {
    const { title = "Medications", variant = "panel", defaultOpen = true, status = "none" } = args
    return (
      <div className="w-full max-w-[360px]">
        <CollapsiblePanel title={title} variant={variant} defaultOpen={defaultOpen} status={status}>
          <p className="text-[13px] text-things-ink">Panel body — aspirin 81 mg · lisinopril 30 mg</p>
        </CollapsiblePanel>
      </div>
    )
  },
}
export default meta

export const Playground: StoryObj<typeof CollapsiblePanel> = {}

export const AllStates: StoryObj<typeof CollapsiblePanel> = {
  render: () => (
    <div className="flex w-full max-w-[360px] flex-col gap-3">
      <CollapsiblePanel title="Medications" variant="panel">
        <p className="text-[13px] text-things-ink">Rail panel body</p>
      </CollapsiblePanel>
      <CollapsiblePanel title="Review of Systems" variant="section" status="warn">
        <p className="text-[13px] text-things-ink">Workspace section body</p>
      </CollapsiblePanel>
      <CollapsiblePanel title="Findings" variant="inline" defaultOpen={false}>
        <p className="text-[13px] text-things-ink">Nested inline body</p>
      </CollapsiblePanel>
    </div>
  ),
}

export const Dense: StoryObj<typeof CollapsiblePanel> = {
  render: () => (
    <AtDensity density="dense">
      <div className="w-full max-w-[360px]">
        <CollapsiblePanel title="Medications" variant="panel">
          <p className="text-[13px] text-things-ink">Dense body</p>
        </CollapsiblePanel>
      </div>
    </AtDensity>
  ),
}
