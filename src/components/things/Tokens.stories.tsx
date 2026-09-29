import type { Meta, StoryObj } from "@storybook/react-vite"
import { useTranslation } from "react-i18next"
import tokens from "@/design-tokens.json"

const meta: Meta = {
  title: "Design System/Design Tokens",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}

export default meta

function Swatch({ name, value, usage }: { name: string; value: string; usage: string }) {
  return (
    <div className="flex w-[280px] items-center gap-3 rounded-lg border border-things-hairline bg-white p-2.5">
      <span
        className="size-10 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
        style={{ backgroundColor: value }}
      />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <code className="text-[12px] font-semibold text-things-ink">{name}</code>
          <code className="text-[10.5px] text-things-gray">{value}</code>
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-things-gray">{usage}</p>
      </div>
    </div>
  )
}

export const All: StoryObj = {
  render: () => {
    const { t } = useTranslation()
    return (
      <div className="bg-white p-2 font-sans">
        <h1 className="text-[22px] font-bold text-things-title">{t("design.tokens.title")}</h1>
        <p className="mt-1 mb-6 max-w-[560px] text-[13px] leading-relaxed text-things-gray">
          {t("design.tokens.t1")}
          <code>@theme</code>
          {t("design.tokens.t2")}
          <code>app/frontend/index.css</code>
          {t("design.tokens.t3")}
          <code>bg-things-blue</code>
          {t("design.tokens.t4")}
          <code>design-tokens.json</code>
          {t("design.tokens.t5")}
          <code>npm run verify:spec</code>
          {t("design.tokens.t6")}
        </p>
        {tokens.groups.map((group) => (
          <section key={group.group} className="mb-8">
            <h2 className="mb-3 text-[15px] font-semibold tracking-[-0.01em] text-things-title">
              {group.group}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {group.tokens.map((token) => (
                <Swatch key={token.name} {...token} />
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  },
}
