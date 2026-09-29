import type { Meta, StoryObj } from "@storybook/react-vite"
import { Save, Send } from "lucide-react"
import { KeyHintButton } from "./KeyHintButton"
import { AtDensity, ForcedLocale } from "./story-utils"

const meta: Meta<typeof KeyHintButton> = {
  title: "Medical/Medical UI/Key Hint Button",
  tags: ["autodocs"],
  component: KeyHintButton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A button that shows its keyboard shortcut right on its face \u2014 \u2318K, /, G then D \u2014 so power features teach themselves. The hint renders in a subtle kbd style that whispers instead of shouts.\n\n**Watch out:** the hint is a promise. Bind the actual key or take the hint off; a lying shortcut is worse than none.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: {
    shortcut: { control: "text" },
    showHint: { control: "radio", options: ["always", "hover", "never"] },
    disabled: { control: "boolean" },
  },
  args: { shortcut: "F2", showHint: "always", disabled: false } as Record<string, unknown>,
  render: (args: any) => (
    <KeyHintButton label="Save record" shortcut={args.shortcut ?? "F2"} icon={Save} showHint={args.showHint} disabled={args.disabled} onSelect={() => {}} />
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => <KeyHintButton label="Save record" shortcut="F2" icon={Save} onSelect={() => {}} />,
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <KeyHintButton label="Save record" shortcut="F2" icon={Save} onSelect={() => {}} />
      <KeyHintButton label="Send to clinician" shortcut="Ctrl+S" icon={Send} showHint="hover" onSelect={() => {}} />
      <KeyHintButton label="Print" shortcut="Ctrl+P" showHint="never" onSelect={() => {}} />
      <KeyHintButton label="Close" shortcut="Esc" showHint="never" disabled onSelect={() => {}} />
    </div>
  ),
}

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <KeyHintButton label="Save record" shortcut="F2" icon={Save} onSelect={() => {}} />,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <KeyHintButton label="บันทึกประวัติ" shortcut="F2" icon={Save} onSelect={() => {}} />
      </AtDensity>
    </ForcedLocale>
  ),
}
