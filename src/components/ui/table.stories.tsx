import type { Meta, StoryObj } from "@storybook/react-vite"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import i18n from "@/i18n"

const meta: Meta = {
  title: "UI/Display/Table",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { rows: 3 },
  argTypes: { rows: { control: { type: "range", min: 1, max: 6, step: 1 } } },
  render: (args: { rows?: number }) => {
    const { rows = 3 } = args
    const data: [string, string, string][] = [
      ["task.today", "Today", "8"], ["sidebar.inbox", "Inbox", "4"], ["sidebar.anytime", "Anytime", "21"],
      ["task.someday", "Someday", "9"], ["sidebar.logbook", "Logbook", "27"], ["sidebar.trash", "Trash", "0"],
    ]
    return (
      <Table className="w-64">
        <TableHeader>
          <TableRow>
            <TableHead>{i18n.t("design.ui.colView")}</TableHead>
            <TableHead className="text-right">{i18n.t("view.open")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, rows).map(([key, v, n]) => (
            <TableRow key={v}><TableCell>{i18n.t(key)}</TableCell><TableCell className="text-right">{n}</TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
}

export const Counts: StoryObj = {
  render: () => (
    <Table className="w-64">
      <TableHeader>
        <TableRow>
          <TableHead>{i18n.t("design.ui.colView")}</TableHead>
          <TableHead className="text-right">{i18n.t("view.open")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>{i18n.t("task.today")}</TableCell><TableCell className="text-right">8</TableCell></TableRow>
        <TableRow><TableCell>{i18n.t("sidebar.inbox")}</TableCell><TableCell className="text-right">4</TableCell></TableRow>
      </TableBody>
    </Table>
  ),
}
