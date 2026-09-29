import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileStack, FolderCheck, MessagesSquare, ShieldPlus } from "lucide-react"
import { TaskCountList } from "./TaskCountList"
import { AtDensity, ForcedLocale } from "./story-utils"

const meta: Meta<typeof TaskCountList> = {
  title: "Medical/Medical Shell/Task Count List",
  tags: ["autodocs"],
  component: TaskCountList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The worklist with live counts \u2014 Tasks (12), Results to review (5), Refills (3) \u2014 each row a destination, each count a heartbeat. Counts cap at 99+ and stale counts are worse than no counts.\n\n**Watch out:** this list answers \"where is the work?\" \u2014 the numbers must come from the same source the destinations show, or users stop trusting the whole rail.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

const ITEMS = [
  { id: "refills", label: "Refill requests", icon: FileStack, count: 7 },
  { id: "results", label: "Results to review", icon: FolderCheck, count: 3 },
  { id: "messages", label: "Staff messages", icon: MessagesSquare, count: 12 },
  { id: "exchange", label: "Health Exchange", icon: ShieldPlus, count: 0 },
]

function Demo({ variant = "list", activeId }: { variant?: "list" | "chips"; activeId?: string }) {
  return <TaskCountList items={ITEMS} activeId={activeId} onSelect={() => {}} variant={variant} />
}

export const Playground: Story = {
  argTypes: {
    variant: { control: "radio", options: ["list", "chips"] },
    activeId: { control: "select", options: ["", "refills", "results", "messages", "exchange"] },
  },
  args: { variant: "list", activeId: "" } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-xs">
      <Demo variant={args.variant} activeId={args.activeId || undefined} />
    </div>
  ),
}

export const Default: Story = { name: "Default", render: () => <div className="max-w-xs"><Demo activeId="refills" /></div> }

export const Chips: Story = { render: () => <Demo variant="chips" activeId="messages" /> }

export const ZeroCounts: Story = {
  parameters: { docs: { description: { story: "Zero renders muted — never hidden." } } },
  render: () => <Demo />,
}

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <div className="max-w-xs"><Demo activeId="refills" /></div>,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-xs">
          <TaskCountList
            items={[
              { id: "refills", label: "คำขอจ่ายยาซ้ำ", icon: FileStack, count: 7 },
              { id: "results", label: "ผลตรวจที่ต้องทบทวน", icon: FolderCheck, count: 3 },
              { id: "exchange", label: "Health Exchange", icon: ShieldPlus, count: 0 },
            ]}
            onSelect={() => {}}
          />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}
