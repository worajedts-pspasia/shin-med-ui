import type { Meta, StoryObj } from "@storybook/react-vite"
import { useTranslation } from "react-i18next"

const meta: Meta = {
  title: "Design System/Introduction",
  parameters: { layout: "padded" },
}

export default meta

export const ReadMe: StoryObj = {
  render: () => {
    const { t } = useTranslation()
    return (
      <div className="max-w-[620px] bg-white p-8 font-sans">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-things-title">
          {t("design.intro.title")}
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-things-ink">
          {t("design.intro.leadPre")}
          <strong>shadcn/ui</strong>
          {t("design.intro.leadMid")}
          <strong>{t("design.intro.specWord")}</strong>
          {t("design.intro.leadPost")}
        </p>

        <h2 className="mt-6 text-[16px] font-semibold text-things-title">{t("design.intro.contractTitle")}</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
          <li>
            <strong>{t("design.intro.c1Strong")}</strong>
            {t("design.intro.c1s1")}
            <code>app/frontend/index.css</code>
            {t("design.intro.c1s2")}
            <code>@theme</code>
            {t("design.intro.c1s3")}
            <em>Design Tokens</em>
            {t("design.intro.c1s4")}
            <code>bg-things-blue</code>, <code>text-things-ink</code>
            {t("design.intro.c1s5")}
          </li>
          <li>
            <strong>{t("design.intro.c2Strong")}</strong>
            {t("design.intro.c2s1")}
            <code>components/ui/*</code>
            {t("design.intro.c2s2")}
            <code>components/things/*</code>
            {t("design.intro.c2s3")}
            <code>things</code>
            {t("design.intro.c2s4")}
          </li>
          <li>
            <strong>{t("design.intro.c3Strong")}</strong>
            {t("design.intro.c3s1")}
            <code>/today</code>, <code>/projects/house</code>
            {t("design.intro.c3s2")}
          </li>
        </ol>

        <h2 className="mt-6 text-[16px] font-semibold text-things-title">
          {t("design.intro.verifyTitle")}
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-things-ink">
          <code>npm run verify:spec</code>
          {t("design.intro.v1")}
          <code>tools/verify-spec.mjs</code>
          {t("design.intro.v2")}
          <code>design-tokens.json</code>
          {t("design.intro.v3")}
          <code>index.css</code>
          {t("design.intro.v4")}
          <code>components/things/*</code>
          {t("design.intro.v5")}
        </p>

        <h2 className="mt-6 text-[16px] font-semibold text-things-title">{t("design.intro.addTitle")}</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
          <li>
            {t("design.intro.a1s1")}
            <code>npx shadcn@latest add &lt;component&gt;</code>
            {t("design.intro.a1s2")}
            <code>components/ui</code>
            {t("design.intro.a1s3")}
          </li>
          <li>
            {t("design.intro.a2s1")}
            <code>components/things/</code>
            {t("design.intro.a2s2")}
            <code>tools/verify-spec.mjs</code>
            {t("design.intro.a2s3")}
          </li>
        </ul>
      </div>
    )
  },
}
