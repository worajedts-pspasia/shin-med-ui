import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import i18n from "@/i18n"

const meta: Meta = {
  title: "UI/Input/ButtonGroup",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { items: 3, withText: false },
  argTypes: {
    items: { control: { type: "range", min: 2, max: 5, step: 1 } },
    withText: { control: "boolean" },
  },
  render: (args: { items?: number; withText?: boolean }) => {
    const { items = 3, withText = false } = args
    const labels = ["All", "Open", "Scheduled", "Deadlines", "Tags"].slice(0, items)
    return (
      <ButtonGroup>
        {labels.map((l) => <Button key={l} variant="outline">{l}</Button>)}
        {withText && <ButtonGroupText>Saved</ButtonGroupText>}
      </ButtonGroup>
    )
  },
}

export const Segmented: StoryObj = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">{i18n.t("view.all")}</Button>
      <Button variant="outline">Open</Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>{i18n.t("clinic.appt.status.scheduled")}</ButtonGroupText>
    </ButtonGroup>
  ),
}
