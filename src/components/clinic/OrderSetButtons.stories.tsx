import type { Meta, StoryObj } from "@storybook/react-vite"
import { OrderSetButtons } from "./OrderSetButtons"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureOrderSets } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof OrderSetButtons> = {
  title: "Medical/Medical Component/Order Set Buttons",
  tags: ["autodocs"],
  component: OrderSetButtons,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("OrderSetButtons"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { render: () => <OrderSetButtons sets={fixtureOrderSets} onApply={() => {}} onSaveCurrent={() => {}} /> }
export const Thai: Story = { render: () => <ForcedLocale locale="th"><AtDensity density="compact"><OrderSetButtons sets={fixtureOrderSets} onApply={() => {}} onSaveCurrent={() => {}} /></AtDensity></ForcedLocale> }
