import type { Meta, StoryObj } from "@storybook/react-vite"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import i18n from "@/i18n"

const meta: Meta<any> = {
  title: "UI/Navigation/Tabs",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { defaultValue: "all" },
  argTypes: {
    defaultValue: { control: "radio", options: ["all", "open", "scheduled"] },
  },
  render: (args: { defaultValue?: string }) => {
    const { defaultValue = "today" } = args
    return (
    <Tabs defaultValue={defaultValue} className="w-64">
      <TabsList>
        <TabsTrigger value="all">{i18n.t("view.all")}</TabsTrigger>
        <TabsTrigger value="open">Open</TabsTrigger>
        <TabsTrigger value="scheduled">{i18n.t("clinic.appt.status.scheduled")}</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="pt-2 text-[13px] text-things-ink">Every to-do in this list.</TabsContent>
      <TabsContent value="open" className="pt-2 text-[13px] text-things-ink">Still to be done.</TabsContent>
      <TabsContent value="scheduled" className="pt-2 text-[13px] text-things-ink">Has a date.</TabsContent>
    </Tabs>
    )
  },
}

export const Filters: StoryObj = {
  render: () => (
    <Tabs defaultValue="all" className="w-64">
      <TabsList>
        <TabsTrigger value="all">{i18n.t("view.all")}</TabsTrigger>
        <TabsTrigger value="open">Open</TabsTrigger>
        <TabsTrigger value="scheduled">{i18n.t("clinic.appt.status.scheduled")}</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="pt-2 text-[13px] text-things-ink">Every to-do in this list.</TabsContent>
      <TabsContent value="open" className="pt-2 text-[13px] text-things-ink">Still to be done.</TabsContent>
      <TabsContent value="scheduled" className="pt-2 text-[13px] text-things-ink">Has a date.</TabsContent>
    </Tabs>
  ),
}
