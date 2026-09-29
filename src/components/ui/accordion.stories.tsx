import type { Meta, StoryObj } from "@storybook/react-vite"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import i18n from "@/i18n"

const meta: Meta = {
  title: "UI/Containers/Accordion",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { collapsible: true, items: 3 },
  argTypes: {
    collapsible: { control: "boolean" },
    items: { control: { type: "range", min: 1, max: 5, step: 1 } },
  },
  render: (args: { collapsible?: boolean; items?: number }) => {
    const { collapsible = true, items = 3 } = args
    const all: [string, string, string][] = [
      ["inbox", i18n.t("sidebar.inbox"), i18n.t("design.ui.accD1")],
      ["today", i18n.t("task.today"), i18n.t("design.ui.accD2")],
      ["upcoming", i18n.t("sidebar.upcoming"), i18n.t("design.ui.accD3")],
      ["anytime", i18n.t("sidebar.anytime"), i18n.t("design.ui.accD4")],
      ["logbook", i18n.t("sidebar.logbook"), i18n.t("design.ui.accD5")],
    ]
    const entries = all.slice(0, items)
    return (
      <Accordion type="single" collapsible={collapsible} className="w-full max-w-sm">
        {entries.map(([id, title, desc]) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent>{desc}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  },
}

export const Single: StoryObj = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-sm">
      <AccordionItem value="a">
        <AccordionTrigger>{i18n.t("sidebar.inbox")}</AccordionTrigger>
        <AccordionContent>{i18n.t("design.ui.accD1")}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>{i18n.t("task.today")}</AccordionTrigger>
        <AccordionContent>{i18n.t("design.ui.accD2")}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
