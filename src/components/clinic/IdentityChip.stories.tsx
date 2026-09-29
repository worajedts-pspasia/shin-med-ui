import type { Meta, StoryObj } from "@storybook/react-vite"
import { IdentityChip, FollowerStack } from "./IdentityChip"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof IdentityChip> = {
  title: "Medical/Medical UI/Identity Chip",
  tags: ["autodocs"],
  component: IdentityChip,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("IdentityChip") } },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { name: "Jamie", role: "Owner", tone: "gold", variant: "menu" },
  argTypes: {
    name: { control: "text" },
    role: { control: "text" },
    tone: { control: "radio", options: ["gold", "blue", "gray"] },
    variant: { control: "radio", options: ["static", "menu", "add"] },
    dense: { control: "boolean" },
  },
  render: (args: any) => (
    <div className="flex flex-wrap items-center gap-2.5 pt-2">
      <IdentityChip {...args} onClick={() => {}} />
    </div>
  ),
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Variants: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex flex flex-wrap items-center gap-2.5 pt-2">
      <IdentityChip name="Jamie" role="Owner" tone="gold" variant="menu" onClick={() => {}} />
      <IdentityChip name="Desmond Garrison" role="Contact" tone="blue" />
      <IdentityChip name="Nurse P." tone="gray" dense />
      <IdentityChip name="Add people" variant="add" onClick={() => {}} />
      <FollowerStack
        followers={[{ initials: "J", tone: "gold" }, { initials: "W", tone: "gray" }]}
        label="2 followers"
        title="Jamie, Worajedt"
      />
    </div>
  ),
}

export const Dense: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex items-center gap-2 pt-2">
      <IdentityChip name="Nurse P." tone="gray" dense />
      <IdentityChip name="Dr. Chen" role="Attending" tone="blue" dense />
    </div>
  ),
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <IdentityChip name="ดร. วรเจตน์" role="เจ้าของ" tone="blue" variant="menu" onClick={() => {}} />
        <IdentityChip name="พยาบาลพร" role="ผู้ติดตาม" tone="gold" dense />
        <IdentityChip name="เพิ่มผู้ร่วม" variant="add" onClick={() => {}} />
      </div>
    </ForcedLocale>
  ),
}
