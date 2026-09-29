import type { Meta, StoryObj } from "@storybook/react-vite"
import { AllergyBanner } from "./AllergyBanner"
import { AtDensity, ForcedLocale, Monochrome } from "./story-utils"
import { allergiesA, allergiesB } from "@/fixtures/clinic"

const meta: Meta<typeof AllergyBanner> = {
  title: "Medical/Medical UI/Allergy Banner",
  tags: ["autodocs"],
  component: AllergyBanner,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The loudest thing on the screen, on purpose. A soft red band with the siren icon and one chip per allergen (substance \u2192 reaction), sitting directly under the patient header where nobody can scroll past it. Three honest states: confirmed allergies (red), **no known allergies** (calm gray \u2014 never red), and *not recorded* (amber dashed outline that begs for action).\n\n**Watch out:** it is deliberately not dismissible \u2014 that absence is a feature, not an oversight.",
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
  parameters: { docs: { description: { story: "แพ้ยา banner in Thai; no-known reads ไม่มีประวัติแพ้ยา — gray, not red." } } },
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
