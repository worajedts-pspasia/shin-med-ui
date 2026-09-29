import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { AlertTicker } from "./AlertTicker"
import { fixtureOpsAlerts } from "@/fixtures/clinic"

const meta: Meta<typeof AlertTicker> = {
  title: "Medical/Medical Component/Alert Ticker",
  tags: ["autodocs"],
  component: AlertTicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The alarm strip from the operations world, now minding the clinic: severity-worded alert chips with counters (\"CRITICAL Freezer A temp \u00d73\"), running as one horizontal ticker on wide screens and stacking into banners below md. Ack Top / Ack All, one click each.\n\n**Watch out:** the severity *word* is always visible \u2014 color is never the only channel. Acknowledging is a commitment; make sure something records it.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {} as Record<string, unknown>,
  render: () => {
    const [alerts, setAlerts] = useState(fixtureOpsAlerts)
    return (
      <div className="max-w-3xl space-y-4">
        <AlertTicker
          alerts={alerts}
          onAck={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
          onAckAll={() => setAlerts([])}
        />
        <p data-alert-count={alerts.length} className="clinic-num text-xs text-things-gray-2">
          {alerts.length} open
        </p>
      </div>
    )
  },
}

export const Empty: Story = { render: () => <div className="max-w-3xl"><AlertTicker alerts={[]} /></div> }
