import type { Meta, StoryObj } from "@storybook/react-vite"
import { useTranslation } from "react-i18next"
import { AppointmentCard, type ApptStatus } from "./AppointmentCard"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureAppointments } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof AppointmentCard> = {
  title: "Medical/Medical Component/Appointment Card",
  tags: ["autodocs"],
  component: AppointmentCard,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("AppointmentCard"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

function Actions() {
  const { t } = useTranslation()
  return [
    { id: "completed", label: t("clinic.appt.action.completed"), onSelect: () => {} },
    { id: "not-completed", label: t("clinic.appt.action.notCompleted"), onSelect: () => {} },
    { id: "discharged", label: t("clinic.appt.action.discharged"), onSelect: () => {} },
    { id: "edit", label: t("clinic.appt.action.edit"), onSelect: () => {} },
  ]
}

function Card({ id, selected, withActions = true }: { id: string; selected?: boolean; withActions?: boolean }) {
  const appt = fixtureAppointments.find((a) => a.id === id)!
  return <AppointmentCard appt={appt} selected={selected} actions={withActions ? Actions() : undefined} />
}

export const Playground: Story = {
  argTypes: {
    apptId: { control: "select", options: fixtureAppointments.map((a) => a.id) },
    status: { control: "select", options: ["scheduled", "confirmed", "checked-in", "in-room", "checked-out", "no-show"] },
    selected: { control: "boolean" },
    withActions: { control: "boolean" },
  } as unknown as Meta<typeof AppointmentCard>["argTypes"],
  args: { apptId: "a2", status: "in-room", selected: false, withActions: true } as Record<string, unknown>,
  render: (args: any) => {
    const base = fixtureAppointments.find((a) => a.id === args.apptId)!
    const appt = { ...base, status: (args.status ?? base.status) as ApptStatus }
    return (
      <div className="max-w-md">
        <AppointmentCard appt={appt} selected={args.selected} actions={args.withActions ? Actions() : undefined} />
      </div>
    )
  },
}

export const Default: Story = { name: "Default", render: () => <div className="max-w-md"><Card id="a2" /></div> }

export const AllStates: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-2">
      {fixtureAppointments.map((a) => (
        <Card key={a.id} id={a.id} />
      ))}
    </div>
  ),
}

export const Selected: Story = { render: () => <div className="max-w-md"><Card id="a1" selected /></div> }

/** Breakpoint-swap (06 §1): Desktop / Mobile in one frame. */
export const Desktop: Story = {
  render: () => <div className="max-w-lg"><Card id="a4" /></div>,
}

export const Mobile: Story = {
  render: () => (
    <div className="max-w-[320px]"><Card id="a4" /></div>
  ),
}

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <div className="max-w-md"><Card id="a3" /></div>,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-md"><Card id="a2" /></div>
      </AtDensity>
    </ForcedLocale>
  ),
}
