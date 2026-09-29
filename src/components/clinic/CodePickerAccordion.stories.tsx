import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CodePickerAccordion } from "./CodePickerAccordion"
import { fixtureCodeGroups } from "@/fixtures/clinic"

const meta: Meta<typeof CodePickerAccordion> = {
  title: "Medical/Medical Component/Code Picker Accordion",
  tags: ["autodocs"],
  component: CodePickerAccordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Browse codes by group \u2014 the superbill's daily driver where you *know* the five codes you bill and want to tap them, not type them. Selected codes get the check and a soft blue row; each group ends in a lookup row for the one-off.\n\n**Watch out:** `multiple=false` makes a group radio-like. Selection state should be controlled (`value`) or it resets when the accordion closes.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ multiple = true }: { multiple?: boolean }) {
  const [value, setValue] = useState<string[]>(["99213", "E11.9", "I10"])
  return (
    <div className="mx-auto max-w-xl">
      <CodePickerAccordion
        groups={fixtureCodeGroups}
        value={value}
        multiple={multiple}
        onToggle={(code) =>
          setValue((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
        }
        onLookup={(g, q) => console.info("lookup", g, q)}
      />
    </div>
  )
}

export const Playground: Story = {
  argTypes: { multiple: { control: "boolean" } },
  args: { multiple: true },
  render: (args) => <Demo multiple={Boolean(args.multiple)} />,
}

export const SeededOnly: Story = {
  parameters: { docs: { description: { story: "Uncontrolled — each code's `selected` seed applies." } } },
  render: () => (
    <div className="mx-auto max-w-xl">
      <CodePickerAccordion groups={fixtureCodeGroups} onToggle={() => {}} />
    </div>
  ),
}
