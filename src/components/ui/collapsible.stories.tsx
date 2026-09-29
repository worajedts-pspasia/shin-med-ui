import type { Meta, StoryObj } from "@storybook/react-vite"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const meta: Meta<any> = {
  title: "UI/Containers/Collapsible",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { defaultOpen: true },
  argTypes: { defaultOpen: { control: "boolean" } },
  render: (args: { defaultOpen?: boolean }) => {
    const { defaultOpen = true } = args
    return (
    <Collapsible defaultOpen={defaultOpen} className="max-w-sm">
      <CollapsibleTrigger className="text-[13px] font-medium text-things-blue">Show checklist</CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-2 list-disc pl-5 text-[13px] text-things-ink">
          <li>Pull Q3 metrics</li>
          <li>Write summary</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
    )
  },
}

export const Expandable: StoryObj = {
  render: () => (
    <Collapsible defaultOpen className="max-w-sm">
      <CollapsibleTrigger className="text-[13px] font-medium text-things-blue">Show checklist</CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-2 list-disc pl-5 text-[13px] text-things-ink">
          <li>Pull Q3 metrics</li>
          <li>Write summary</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  ),
}
