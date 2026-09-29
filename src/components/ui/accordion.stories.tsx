import type { Meta, StoryObj } from "@storybook/react-vite"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
    const entries = [["Inbox", "Everything that arrives without a home."], ["Today", "Your focus for the day."], ["Upcoming", "Scheduled ahead."], ["Anytime", "Remaining, unscheduled."], ["Logbook", "Completed and canceled."]].slice(0, items)
    return (
      <Accordion type="single" collapsible={collapsible} className="w-full max-w-sm">
        {entries.map(([t, d]) => (
          <AccordionItem key={t} value={t}>
            <AccordionTrigger>{t}</AccordionTrigger>
            <AccordionContent>{d}</AccordionContent>
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
        <AccordionTrigger>Inbox</AccordionTrigger>
        <AccordionContent>Everything that arrives without a home.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Today</AccordionTrigger>
        <AccordionContent>Your focus for the day.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
