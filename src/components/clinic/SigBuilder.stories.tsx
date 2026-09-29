import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SigBuilder } from "./SigBuilder"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureDirectionCodes } from "@/fixtures/clinic"

const meta: Meta<typeof SigBuilder> = {
  title: "Medical/Medical Component/Sig Builder",
  tags: ["autodocs"],
  component: SigBuilder,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Dose, route, frequency \u2014 assembled into a human sentence as you pick: \"Take 1 tablet by mouth twice daily for 10 days\". The sentence is the source of truth the pharmacist will read, built from structured parts the system can check.\n\n**Watch out:** if a combination can't make a sane sentence, refuse it here \u2014 a garbled sig that reaches print is the worst-case scenario this component exists to prevent.",
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
