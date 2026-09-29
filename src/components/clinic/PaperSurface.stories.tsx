import type { Meta, StoryObj } from "@storybook/react-vite"
import { TriangleAlert } from "lucide-react"
import { PaperSurface } from "./PaperSurface"
import { AtDensity } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof PaperSurface> = {
  title: "Medical/Medical Shell/Paper Surface",
  tags: ["autodocs"],
  component: PaperSurface,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("PaperSurface"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: {
    size: { control: "radio", options: ["a4", "letter", "auto"] },
    serif: { control: "boolean" },
    withWatermark: { control: "boolean" },
  } as unknown as Meta<typeof PaperSurface>["argTypes"],
  args: { size: "a4", serif: true, withWatermark: false } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-2xl bg-things-sidebar/40 p-4">
      <PaperSurface
        size={args.size}
        serif={args.serif}
        watermark={args.withWatermark ? { icon: TriangleAlert, label: "PENDING" } : undefined}
      >
        <p className="p-6 text-sm leading-relaxed">
          Bangkok Clinic — ตัวอย่าง. This block reads as a printed sheet, not app state: warm paper fill, hairline edge, print-friendly shadow.
        </p>
      </PaperSurface>
    </div>
  ),
}

export const A4: Story = {
  name: "A4 with watermark",
  render: () => (
    <div className="max-w-2xl bg-things-sidebar/40 p-4">
      <PaperSurface size="a4" serif watermark={{ icon: TriangleAlert, label: "PENDING" }}>
        <p className="p-6 text-sm leading-relaxed">A4 sheet with a faint centered watermark — used for pending interactions on an Rx.</p>
      </PaperSurface>
    </div>
  ),
}
