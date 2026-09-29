import type { Meta, StoryObj } from "@storybook/react-vite"
import { useTranslation } from "react-i18next"

const meta: Meta = {
  title: "Design System/Typography & Rhythm",
  parameters: { layout: "padded" },
}

export default meta

type Sample = { key?: string; text?: string }
const SCALE: { label: string; cls: string; sample: Sample }[] = [
  { label: "design.typo.l1", cls: "text-[27px] font-bold leading-none tracking-[-0.022em] text-things-title", sample: { key: "task.today" } },
  { label: "design.typo.l2", cls: "text-[16.5px] font-semibold tracking-[-0.01em] text-things-title", sample: { text: "Quarter Close" } },
  { label: "design.typo.l3", cls: "text-[14.5px] leading-[1.45] text-things-ink", sample: { text: "Reply to Sarah about the venue" } },
  { label: "design.typo.l4", cls: "text-[13px] text-things-ink", sample: { key: "sidebar.upcoming" } },
  { label: "design.typo.l5", cls: "text-[12.5px] leading-[1.5] text-things-gray", sample: { text: "Monday, September 28" } },
  { label: "design.typo.l6", cls: "text-[12.5px] font-semibold text-things-blue", sample: { key: "view.thisEvening" } },
  { label: "design.typo.l7", cls: "text-[11px] text-things-gray-2", sample: { text: "9:00 AM" } },
  { label: "design.typo.l8", cls: "text-[11px] font-semibold tracking-wide text-things-gray", sample: { key: "sidebar.lists" } },
]

const RHYTHM: { label: string; spec: string }[] = [
  { label: "design.typo.t1", spec: "py-[7px] px-3, gap-3 → ~44px tall" },
  { label: "design.typo.t2", spec: "19px, border 1.5px things-box, fully round" },
  { label: "design.typo.t3", spec: "15px" },
  { label: "design.typo.t4", spec: "30px tall, icon 17px, gap-2.5" },
  { label: "design.typo.t5", spec: "224px desktop / 286px drawer" },
  { label: "design.typo.t6", spec: "19px tall, 11px text, things-tag-border" },
  { label: "design.typo.t7", spec: "54px tall; floating on desktop, docked on mobile" },
  { label: "design.typo.t8", spec: "pt-7 pb-3; title 27px; subtitle 13.5px things-gray" },
]

export const Scale: StoryObj = {
  render: () => {
    const { t } = useTranslation()
    return (
      <div className="bg-white p-6 font-sans">
        <h1 className="mb-1 text-[22px] font-bold text-things-title">{t("design.typo.scaleTitle")}</h1>
        <p className="mb-6 text-[13px] text-things-gray">{t("design.typo.scaleSub")}</p>
        <div className="flex flex-col divide-y divide-things-hairline">
          {SCALE.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-8 py-3">
              <span className={row.cls}>{row.sample.key ? t(row.sample.key) : row.sample.text}</span>
              <code className="shrink-0 text-[10.5px] text-things-gray">{t(row.label)}</code>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const Rhythm: StoryObj = {
  render: () => {
    const { t } = useTranslation()
    return (
      <div className="bg-white p-6 font-sans">
        <h1 className="mb-1 text-[22px] font-bold text-things-title">{t("design.typo.rhythmTitle")}</h1>
        <p className="mb-6 max-w-[440px] text-[13px] leading-relaxed text-things-gray">
          {t("design.typo.r1")}
          <code>bg-things-hover</code>
          {t("design.typo.r2")}
          <code>bg-things-blue-soft</code>
          {t("design.typo.r3")}
          <code>things-hairline</code>
          {t("design.typo.r4")}
          <code>things-blue</code>.
        </p>
        <table className="text-left text-[12.5px] text-things-ink">
          <tbody className="[&_td]:py-1.5 [&_td]:pr-10">
            {RHYTHM.map((row) => (
              <tr key={row.label}>
                <td>{t(row.label)}</td>
                <td className="text-things-gray">{row.spec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
}
