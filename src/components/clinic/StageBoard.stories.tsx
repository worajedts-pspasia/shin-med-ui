import type { Meta, StoryObj } from "@storybook/react-vite"
import { StageBoard, type StageColumn } from "./StageBoard"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const DATA: StageColumn[] = [
  {
    id: "registered",
    name: "Registered",
    cards: [
      { id: "1", title: "Zoetis", value: "$17,500", numericValue: 17500, contact: "Desmond Garrison", contactInitials: "D", status: "ok" },
      { id: "2", title: "Brenntag", value: "$9,900", numericValue: 9900, contact: "Mia Chen", contactInitials: "M", status: "quiet" },
    ],
  },
  {
    id: "review",
    name: "In review",
    cards: [
      { id: "3", title: "Kenvue", value: "$42,000", numericValue: 42000, contact: "A. Novak", contactInitials: "A", status: "waiting", statusLabel: "Waiting" },
    ],
  },
  {
    id: "followup",
    name: "Follow-up",
    cards: [
      { id: "4", title: "BASF", value: "$6,300", numericValue: 6300, contact: "R. Silva", contactInitials: "R", status: "blocked" },
      { id: "5", title: "Cargill", value: "$11,250", numericValue: 11250, contact: "Jamie Ortiz", contactInitials: "J", status: "ok" },
    ],
  },
]

const meta: Meta<typeof StageBoard> = {
  title: "Medical/Medical UI/Stage Board",
  tags: ["autodocs"],
  component: StageBoard,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("StageBoard") } },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { unit: "$", showSum: true },
  argTypes: {
    unit: { control: { type: "select" }, options: ["$", "฿", ""] },
    showSum: { control: "boolean" },
  },
  render: (args: any) => (
    <StageBoard
      columns={DATA}
      unit={args.unit}
      showSum={args.showSum}
      selectedId="5"
      onMove={(card, from, to) => console.log("move", card, from, "->", to)}
    />
  ),
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Default: StoryObj<typeof meta> = {
  render: () => <StageBoard columns={DATA} unit="$" />,
}

export const EmptyColumn: StoryObj<typeof meta> = {
  render: () => (
    <StageBoard
      columns={[
        { id: "a", name: "Waiting", cards: DATA[0].cards },
        { id: "b", name: "In progress", cards: [] },
        { id: "c", name: "Follow-up", cards: DATA[2].cards.slice(0, 1) },
      ]}
      unit="$"
    />
  ),
}

export const Dense: StoryObj<typeof meta> = {
  render: () => <StageBoard columns={DATA} unit="$" dense />,
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <StageBoard
        columns={[
          {
            id: "a",
            name: "รอส่งต่อ",
            cards: [
              { id: "t1", title: "สมชาย ใจดี", value: "฿12,000", numericValue: 12000, contact: "สมหญิง ขยัน", contactInitials: "ส", status: "waiting", statusLabel: "รอ" },
              { id: "t2", title: "มานะ ตั้งใจ", value: "฿30,000", numericValue: 30000, status: "ok", statusLabel: "ปกติ" },
            ],
          },
          { id: "b", name: "กำลังตรวจ", cards: [] },
          { id: "c", name: "นัดหมาย", cards: [] },
        ]}
        unit="฿"
      />
    </ForcedLocale>
  ),
}
