import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BarChart3, CalendarDays, FileText, MessageSquare, ReceiptText, Settings, UserRound } from "lucide-react"
import { ModuleRail, type ModuleItem } from "./ModuleRail"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof ModuleRail> = {
  title: "Medical/Medical Shell/Module Rail",
  tags: ["autodocs"],
  component: ModuleRail,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The left module switcher: icon + label + live counts, collapsing to icon-only with tooltips when space is tight. Active module reads as blue on the select tint; the count badge caps at 99+ and doubles as a tiny workload meter.\n\n**Watch out:** modules are fixed navigation with counts \u2014 user-pinnable app shortcuts are LauncherRail's job. The footer carries the user block, not modules.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const ICONS = [CalendarDays, UserRound, MessageSquare, FileText, ReceiptText, BarChart3]
const ITEMS: ModuleItem[] = [
  { id: "schedule", label: "Schedule", icon: ICONS[0], count: 12 },
  { id: "patients", label: "Patients", icon: ICONS[1] },
  { id: "messages", label: "Messages", icon: ICONS[2], count: 5 },
  { id: "documents", label: "Documents", icon: ICONS[3], count: 103 },
  { id: "billing", label: "Billing", icon: ICONS[4] },
  { id: "reports", label: "Reports", icon: ICONS[5] },
]

function Demo({ collapsed = false }: { collapsed?: boolean }) {
  const [active, setActive] = useState("schedule")
  return (
    <div className="flex h-80 gap-3">
      <ModuleRail items={ITEMS} activeId={active} onSelect={setActive} collapsed={collapsed}
        footer={<Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-things-gray-2"><Settings className="size-4" aria-hidden="true" />{collapsed ? "" : "Settings"}</Button>}
      />
    </div>
  )
}

export const Playground: Story = {
  argTypes: { collapsed: { control: "boolean" } },
  args: { collapsed: false } as Record<string, unknown>,
  render: (args: any) => <Demo collapsed={args.collapsed} />,
}
export const Default: Story = { name: "Default", render: () => <Demo /> }
export const Collapsed: Story = { render: () => <Demo collapsed /> }
