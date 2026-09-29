import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { RecipientPicker } from "./RecipientPicker"
import { AtDensity } from "./story-utils"
import { fixtureDirectory } from "@/fixtures/clinic"

const meta: Meta<typeof RecipientPicker> = {
  title: "Medical/Medical UI/Recipient Picker",
  tags: ["autodocs"],
  component: RecipientPicker,
  parameters: { layout: "padded", docs: { description: { component: "Choose message recipients from the directory as token chips \u2014 type to search, click to add, X to remove; tokens show name + role so \"Dr. Chen (Cardiology)\" is never ambiguous.\n\n**Watch out:** tokens are commitments \u2014 they go into the To: line. Keep the role context in the token, especially with common surnames." } } },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ max }: { max?: number }) {
  const [selected, setSelected] = useState<string[]>(["u1"])
  return (
    <div className="max-w-md rounded-md border border-things-hairline bg-card p-2">
      <RecipientPicker directory={[...fixtureDirectory]} selected={selected} onChange={setSelected} max={max} />
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }
export const MaxTwo: Story = { render: () => <Demo max={2} /> }
