import type { Meta, StoryObj } from "@storybook/react-vite"
import { Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EventDetailPopover } from "./EventDetailPopover"
import { AtDensity } from "./story-utils"
import { fixtureTimelineEvents } from "@/fixtures/clinic"

const meta: Meta<typeof EventDetailPopover> = {
  title: "Medical/Medical Component/Event Detail Popover",
  tags: ["autodocs"],
  component: EventDetailPopover,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The anchored detail card for one timeline event: title, timestamp, lane and its icon, then the label\u2192value pairs that explain the event \u2014 order sets, result components, referral targets.\n\n**Watch out:** it's a popover, so it disappears. Anything a user must copy or compare belongs in a panel, not here.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const rich = fixtureTimelineEvents[0]

function Anchored() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">Open event detail</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <EventDetailPopover title={rich.label!} at={rich.at} laneLabel="Medications" laneIcon={Pill} detail={rich.detail} actions={<Button size="xs" variant="outline">Edit</Button>} />
      </PopoverContent>
    </Popover>
  )
}

export const Playground: Story = { render: () => <Anchored /> }

export const Default: Story = {
  name: "Default",
  render: () => (
    <div className="max-w-xs rounded-md border border-things-hairline bg-card p-3 shadow-sm">
      <EventDetailPopover title={rich.label!} at={rich.at} laneLabel="Medications" laneIcon={Pill} detail={rich.detail} />
    </div>
  ),
}

export const NoDetail: Story = {
  render: () => (
    <div className="max-w-xs rounded-md border border-things-hairline bg-card p-3 shadow-sm">
      <EventDetailPopover title="SOAP — cough" at="2026-08-20T15:20" laneLabel="Notes" />
    </div>
  ),
}
