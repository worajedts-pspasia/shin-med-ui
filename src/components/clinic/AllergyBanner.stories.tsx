import type { Meta, StoryObj } from "@storybook/react-vite"
import { AllergyBanner } from "./AllergyBanner"
import { AtDensity, ForcedLocale, Monochrome } from "./story-utils"
import { allergiesA, allergiesB } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof AllergyBanner> = {
  title: "Medical/Medical UI/Allergy Banner",
  tags: ["autodocs"],
  component: AllergyBanner,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("AllergyBanner"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { state: "has-allergies", allergies: allergiesA },
  argTypes: {
    state: { control: "radio", options: ["has-allergies", "no-known", "none-recorded"] },
    confirmedAt: { control: "text" },
  },
  render: (args: any) => {
    const { state = "has-allergies", allergies = allergiesA, confirmedAt } = args
    return <AllergyBanner state={state} allergies={allergies} confirmedAt={confirmedAt} />
  },
}
export default meta

export const Playground: StoryObj<typeof AllergyBanner> = {}

export const HasAllergies: StoryObj<typeof AllergyBanner> = {
  args: { state: "has-allergies", allergies: allergiesA },
}

export const NoKnownAllergies: StoryObj<typeof AllergyBanner> = {
  args: { state: "no-known", confirmedAt: "2026-08-01" },
}

export const NotRecorded: StoryObj<typeof AllergyBanner> = {
  args: { state: "none-recorded" },
  render: () => <AllergyBanner state="none-recorded" onRecord={() => {}} />,
}

export const AllStates: StoryObj<typeof AllergyBanner> = {
  render: () => (
    <div className="flex w-full max-w-[420px] flex-col gap-3">
      <AllergyBanner state="has-allergies" allergies={allergiesA} />
      <AllergyBanner state="no-known" confirmedAt="2026-08-01" />
      <AllergyBanner state="none-recorded" onRecord={() => {}} />
    </div>
  ),
}

export const Grayscale: StoryObj<typeof AllergyBanner> = {
  name: "Monochrome",
  render: () => (
    <Monochrome>
      <AllergyBanner state="has-allergies" allergies={allergiesA} />
    </Monochrome>
  ),
}

export const Thai: StoryObj<typeof AllergyBanner> = {
  parameters: { docs: { description: { story: docsDesc("AllergyBanner::Thai") } } },
  render: () => (
    <ForcedLocale locale="th">
      <div className="flex w-full max-w-[420px] flex-col gap-3">
        <AllergyBanner state="has-allergies" allergies={allergiesB} />
        <AllergyBanner state="no-known" confirmedAt="2026-08-01" />
        <AllergyBanner state="none-recorded" />
      </div>
    </ForcedLocale>
  ),
}

export const Dense: StoryObj<typeof AllergyBanner> = {
  render: () => (
    <AtDensity density="dense">
      <AllergyBanner state="has-allergies" allergies={allergiesA} />
    </AtDensity>
  ),
}
