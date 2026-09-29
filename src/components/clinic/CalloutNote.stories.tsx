import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalloutNote } from "./CalloutNote"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof CalloutNote> = {
  title: "Medical/Medical UI/Callout Note",
  tags: ["autodocs"],
  component: CalloutNote,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("CalloutNote") } },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: {
    tone: "today",
    position: "inline",
    dismissAfter: 0,
    meta: "Jamie · Jun 2",
    children: "Client will be on holiday between June 15–20.",
  },
  argTypes: {
    tone: { control: { type: "select" }, options: ["today", "warn", "info"] },
    position: {
      control: { type: "select" },
      options: ["inline", "top-right", "top-center", "bottom-right", "bottom-left"],
    },
    dismissAfter: { control: { type: "number", step: 500, min: 0 }, description: "ms; 0 = sticky" },
    meta: { control: "text" },
  },
  render: (args: any) => (
    <div className="max-w-[560px] pt-2">
      {/* key re-mounts the note when position/tone/timeout change, so the
          playground always shows a fresh callout */}
      <CalloutNote
        key={`${args.tone}-${args.position}-${args.dismissAfter}`}
        tone={args.tone}
        position={args.position}
        dismissAfter={args.dismissAfter}
        meta={args.meta}
        onDismiss={args.dismissAfter > 0 ? undefined : () => {}}
      >
        {args.children}
      </CalloutNote>
    </div>
  ),
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Tones: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex max-w-[560px] flex-col gap-2 pt-2">
      <CalloutNote tone="today" meta="Jamie · Jun 2">
        Client will be on holiday between June 15–20.
      </CalloutNote>
      <CalloutNote tone="warn" meta="WS · Sep 28">
        Procurement needs the revised quote before Friday or the review slips a week.
      </CalloutNote>
      <CalloutNote tone="info" meta="System · Sep 30">
        This item moved two stages in one action — stage history shows no dwell time.
      </CalloutNote>
    </div>
  ),
}

export const Floating: StoryObj<typeof meta> = {
  parameters: { docs: { description: { story: "Fixed corners with auto-dismiss — timers expire and the notes remove themselves." } } },
  render: () => (
    <div className="flex min-h-[480px] items-center justify-center pt-2">
      <CalloutNote tone="warn" position="top-right" dismissAfter={6000} meta="WS · just now">
        This one auto-dismisses in six seconds.
      </CalloutNote>
      <CalloutNote tone="info" position="bottom-right" dismissAfter={0} meta="WS · just now" onDismiss={() => {}}>
        This one stays until you dismiss it.
      </CalloutNote>
    </div>
  ),
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <div className="max-w-[560px] pt-2">
        <CalloutNote tone="today" meta="พยาบาลพร · 2 มิ.ย.">
          ผู้ป่วยนัดตรวจซ้ำวันที่ 15 มิ.ย. — ต้องยืนยันก่อน 12 มิ.ย.
        </CalloutNote>
      </div>
    </ForcedLocale>
  ),
}
