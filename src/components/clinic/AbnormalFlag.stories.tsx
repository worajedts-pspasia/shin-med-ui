import type { Meta, StoryObj } from "@storybook/react-vite"
import { AbnormalFlag } from "./AbnormalFlag"
import { AtDensity, ForcedLocale, Monochrome } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof AbnormalFlag> = {
  title: "Medical/Medical UI/Abnormal Flag",
  tags: ["autodocs"],
  component: AbnormalFlag,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("AbnormalFlag"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { flag: "H" },
  argTypes: { flag: { control: "radio", options: ["N", "H", "L", "HH", "LL", "A"] } },
  render: (args: { flag?: "N" | "H" | "L" | "HH" | "LL" | "A" }) => {
    const { flag = "H" } = args
    return <AbnormalFlag flag={flag} />
  },
}
export default meta

export const Playground: StoryObj<typeof AbnormalFlag> = {}

export const AllStates: StoryObj<typeof AbnormalFlag> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <AbnormalFlag flag="N" />
      <AbnormalFlag flag="H" />
      <AbnormalFlag flag="L" />
      <AbnormalFlag flag="HH" />
      <AbnormalFlag flag="LL" />
      <AbnormalFlag flag="A" />
    </div>
  ),
}

export const Grayscale: StoryObj<typeof AbnormalFlag> = {
  name: "Monochrome",
  parameters: { docs: { description: { story: docsDesc("AbnormalFlag::Grayscale") } } },
  render: () => (
    <Monochrome>
      <div className="flex flex-wrap items-center gap-2">
        <AbnormalFlag flag="N" />
        <AbnormalFlag flag="H" />
        <AbnormalFlag flag="L" />
        <AbnormalFlag flag="HH" />
        <AbnormalFlag flag="LL" />
      </div>
    </Monochrome>
  ),
}

export const Dense: StoryObj<typeof AbnormalFlag> = {
  render: () => (
    <AtDensity density="dense">
      <AbnormalFlag flag="HH" />
    </AtDensity>
  ),
}

export const Thai: StoryObj<typeof AbnormalFlag> = {
  render: () => (
    <ForcedLocale locale="th">
      <div className="flex gap-2">
        <AbnormalFlag flag="H" />
        <AbnormalFlag flag="HH" />
      </div>
    </ForcedLocale>
  ),
}
