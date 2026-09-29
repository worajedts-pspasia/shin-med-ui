import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChartTabNav } from "./ChartTabNav"
import { chartSections } from "@/fixtures/clinic"

const meta: Meta<typeof ChartTabNav> = {
  title: "Medical/Medical Shell/Chart Tab Nav",
  tags: ["autodocs"],
  component: ChartTabNav,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Vertical section navigation for the chart \u2014 Problems, Meds, Allergies, Vitals \u2014 with counts as quiet badges so the nav itself reports workload. Active section carries the blue indicator; counts cap at 99+.\n\n**Watch out:** the nav expects to scroll *with* or *to* sections \u2014 wire it to your scroll container or the active state is decorative.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" | "auto" }) {
  const [active, setActive] = useState("summary")
  return <ChartTabNav sections={chartSections} activeId={active} onSelect={setActive} orientation={orientation} />
}

export const Playground: Story = {
  argTypes: { orientation: { control: "radio", options: ["vertical", "horizontal", "auto"] } },
  args: { orientation: "vertical" } as Record<string, unknown>,
  render: (args: any) => <div className="max-w-44"><Demo orientation={args.orientation} /></div>,
}
export const Vertical: Story = { render: () => <div className="max-w-44"><Demo /></div> }
export const Horizontal: Story = { render: () => <Demo orientation="horizontal" /> }
