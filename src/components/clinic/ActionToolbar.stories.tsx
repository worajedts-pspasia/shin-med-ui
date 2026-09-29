import type { Meta, StoryObj } from "@storybook/react-vite"
import { FilePlus2, Printer, Save, Send, Trash2, UserPlus } from "lucide-react"
import { ActionToolbar, type ToolbarAction } from "./ActionToolbar"
import { AtDensity, ForcedLocale } from "./story-utils"

const meta: Meta<typeof ActionToolbar> = {
  title: "Medical/Medical Shell/Action Toolbar",
  tags: ["autodocs"],
  component: ActionToolbar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The icon toolbar that sits above content and does things *to* it: related actions as icon buttons, split buttons where one action has variants, and an overflow kebab menu instead of a degrading button pile. Tooltips are mandatory, not optional \u2014 an unlabeled icon is a riddle.\n\n**Watch out:** this is an *object* toolbar (acts on what's below). Navigating somewhere else is a job for tabs or a menu, not a button here.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  argTypes: {
    withSplit: { control: "boolean" },
    withDestructive: { control: "boolean" },
    disabled: { control: "boolean" },
  } as unknown as Meta<typeof ActionToolbar>["argTypes"],
  args: { withSplit: true, withDestructive: true, disabled: false } as Record<string, unknown>,
}
export default meta

type Story = StoryObj<typeof meta>

const BASE_ACTIONS: ToolbarAction[] = [
  { id: "new", icon: FilePlus2, label: "New", onSelect: () => {} },
  { id: "save", icon: Save, label: "Save", onSelect: () => {} },
  { id: "send", icon: Send, label: "Send", onSelect: () => {}, menu: [
    { id: "send-lab", label: "Send to lab", onSelect: () => {} },
    { id: "send-pharmacy", label: "Send to pharmacy", onSelect: () => {} },
  ] },
  { id: "print", icon: Printer, label: "Print", onSelect: () => {} },
]

export const Playground: Story = {
  render: (args: any) => {
    const actions: ToolbarAction[] = BASE_ACTIONS
      .filter((a) => (args.withSplit ? true : !a.menu))
      .map((a) => ({ ...a, disabled: Boolean(args.disabled) }))
    if (args.withDestructive) actions.push({ id: "delete", icon: Trash2, label: "Delete", destructive: true, onSelect: () => {} })
    return (
      <div className="rounded-md border border-things-hairline bg-card p-1">
        <ActionToolbar actions={actions} label="Chart actions" />
      </div>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Full toolbar (split button + destructive in overflow)</p>
        <div className="rounded-md border border-things-hairline bg-card p-1">
          <ActionToolbar actions={BASE_ACTIONS.concat([{ id: "delete", icon: Trash2, label: "Delete", destructive: true, onSelect: () => {} }])} label="Chart actions" />
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Disabled actions</p>
        <div className="rounded-md border border-things-hairline bg-card p-1">
          <ActionToolbar actions={BASE_ACTIONS.map((a) => ({ ...a, disabled: true }))} label="Chart actions" />
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Single action</p>
        <div className="w-fit rounded-md border border-things-hairline bg-card p-1">
          <ActionToolbar actions={[BASE_ACTIONS[0]]} label="New record" />
        </div>
      </div>
    </div>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => (
    <div className="rounded-md border border-things-hairline bg-card p-1">
      <ActionToolbar actions={BASE_ACTIONS} label="Chart actions" />
    </div>
  ),
}

/** At 390px the non-first actions collapse into the ⋯ overflow (open it). */
export const Mobile: Story = {
  render: () => (
    <AtDensity density="compact">
      <div className="max-w-[390px] rounded-md border border-things-hairline bg-card p-1">
        <ActionToolbar actions={BASE_ACTIONS.concat([{ id: "delete", icon: Trash2, label: "Delete", destructive: true, onSelect: () => {} }])} label="Chart actions" />
      </div>
    </AtDensity>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="rounded-md border border-things-hairline bg-card p-1">
          <ActionToolbar
            actions={[
              { id: "new", icon: UserPlus, label: "เพิ่มใหม่", onSelect: () => {} },
              { id: "save", icon: Save, label: "บันทึก", onSelect: () => {} },
              { id: "print", icon: Printer, label: "พิมพ์", onSelect: () => {} },
            ]}
            label="การกระทำ"
          />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}
