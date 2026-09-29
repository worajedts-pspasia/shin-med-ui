import type { Meta, StoryObj } from "@storybook/react-vite"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
    const data = [["Today", "8"], ["Inbox", "4"], ["Anytime", "21"], ["Someday", "9"], ["Logbook", "27"], ["Trash", "0"]]
    return (
      <Table className="w-64">
        <TableHeader>
          <TableRow>
            <TableHead>View</TableHead>
            <TableHead className="text-right">Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, rows).map(([v, n]) => (
            <TableRow key={v}><TableCell>{v}</TableCell><TableCell className="text-right">{n}</TableCell></TableRow>
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
          <TableHead>View</TableHead>
          <TableHead className="text-right">Open</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>Today</TableCell><TableCell className="text-right">8</TableCell></TableRow>
        <TableRow><TableCell>Inbox</TableCell><TableCell className="text-right">4</TableCell></TableRow>
      </TableBody>
    </Table>
  ),
}
