import type { Meta, StoryObj } from "@storybook/react-vite"
import { OrderSetButtons } from "./OrderSetButtons"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureOrderSets } from "@/fixtures/clinic"

const meta: Meta<typeof OrderSetButtons> = {
  title: "Medical/Medical Component/Order Set Buttons",
  tags: ["autodocs"],
  component: OrderSetButtons,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Apply a template or save the current one \u2014 the two buttons a clinic that treats the same five conditions all day actually lives on. Scope is explicit: *my* sets vs *clinic* sets.\n\n**Watch out:** applying a set is a bulk action with consequences; make the diff visible before it lands in the chart.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { render: () => <OrderSetButtons sets={fixtureOrderSets} onApply={() => {}} onSaveCurrent={() => {}} /> }
export const Thai: Story = { render: () => <ForcedLocale locale="th"><AtDensity density="compact"><OrderSetButtons sets={fixtureOrderSets} onApply={() => {}} onSaveCurrent={() => {}} /></AtDensity></ForcedLocale> }
