import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChartTabNav } from "./ChartTabNav"
import { chartSections } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ChartTabNav> = {
  title: "Medical/Medical Shell/Chart Tab Nav",
  tags: ["autodocs"],
  component: ChartTabNav,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("ChartTabNav"),
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
