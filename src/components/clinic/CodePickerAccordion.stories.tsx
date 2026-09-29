import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CodePickerAccordion } from "./CodePickerAccordion"
import { fixtureCodeGroups } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof CodePickerAccordion> = {
  title: "Medical/Medical Component/Code Picker Accordion",
  tags: ["autodocs"],
  component: CodePickerAccordion,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("CodePickerAccordion"),
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
  parameters: { docs: { description: { story: docsDesc("CodePickerAccordion::SeededOnly") } } },
  render: () => (
    <div className="mx-auto max-w-xl">
      <CodePickerAccordion groups={fixtureCodeGroups} onToggle={() => {}} />
    </div>
  ),
}
