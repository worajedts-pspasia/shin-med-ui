import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SigBuilder } from "./SigBuilder"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureDirectionCodes } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof SigBuilder> = {
  title: "Medical/Medical Component/Sig Builder",
  tags: ["autodocs"],
  component: SigBuilder,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("SigBuilder"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ initial = "ทา - - วันละ 2 ครั้ง@เช้า-เย็น" }: { initial?: string }) {
  const [sig, setSig] = useState(initial)
  return (
    <div className="max-w-md">
      <SigBuilder directionCodes={fixtureDirectionCodes} value={sig} onChange={setSig} />
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }
export const Edited: Story = { render: () => <Demo initial="1 tab morning and evening" /> }
export const Thai: Story = { render: () => <ForcedLocale locale="th"><AtDensity density="compact"><Demo /></AtDensity></ForcedLocale> }
