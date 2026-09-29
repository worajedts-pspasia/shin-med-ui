import type { Meta, StoryObj } from "@storybook/react-vite"
import { TimelinePill } from "./TimelinePill"
import { CATEGORY_COLORS } from "./tokens"
import { AtDensity } from "./story-utils"

const meta: Meta<typeof TimelinePill> = {
  title: "Medical/Medical UI/Timeline Pill",
  tags: ["autodocs"],
  component: TimelinePill,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A labeled event bar for lanes and Gantt rows \u2014 colored by category, time attached, label truncating from the end. The building block that ScheduleGrid and MedicationTimeline lay out.\n\n**Watch out:** the pill's color is its category; the status glyph rides separately. Never bake status into the fill.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: {
    category: { control: "select", options: ["medications", "labs", "notes", "documents", "appointments", "problems"] },
    selected: { control: "boolean" },
  } as unknown as Meta<typeof TimelinePill>["argTypes"],
  args: { category: "medications", selected: false } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-sm space-y-1 pt-2">
      <TimelinePill label="Lisinopril 30 mg" color={CATEGORY_COLORS[(args.category ?? "medications") as keyof typeof CATEGORY_COLORS].var} time="10:00" meta="1-0-0" selected={args.selected} />
    </div>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => (
    <div className="max-w-sm space-y-1 pt-2">
      <TimelinePill label="Lisinopril 30 mg" color={CATEGORY_COLORS.medications.var} time="10:00" meta="1-0-0" />
      <TimelinePill label="CMP resulted" color={CATEGORY_COLORS.labs.var} time="09:15" />
      <TimelinePill label="SOAP — HTN f/u" color={CATEGORY_COLORS.notes.var} time="11:00" meta="Dr. Test" />
      <TimelinePill label="Discharge summary" color={CATEGORY_COLORS.documents.var} time="13:00" />
    </div>
  ),
}

export const Selected: Story = {
  render: () => (
    <div className="max-w-sm space-y-1 pt-2">
      <TimelinePill label="Appointment — follow-up" color={CATEGORY_COLORS.appointments.var} time="09:00" selected />
    </div>
  ),
}
