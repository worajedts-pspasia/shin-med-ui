import type { Meta, StoryObj } from "@storybook/react-vite"
import { useTranslation } from "react-i18next"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta = {
  title: "Medical/Introduction",
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("Introduction"),
      },
    },
  },
}
export default meta

export const ReadMe: StoryObj = {
  render: () => {
    const { t } = useTranslation()
    return (
      <div className="max-w-[620px] rounded-md border border-things-hairline bg-card p-8 font-sans">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-things-title">{t("design.medintro.title")}</h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-things-ink">
          {t("design.medintro.lead")}
        </p>

        <h2 className="mt-6 text-[16px] font-semibold text-things-title">{t("design.medintro.orgTitle")}</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
          <li>
            <strong>Medical UI</strong>
            {t("design.medintro.o1")}
          </li>
          <li>
            <strong>Medical Shell</strong>
            {t("design.medintro.o2")}
          </li>
          <li>
            <strong>Medical Component</strong>
            {t("design.medintro.o3")}
          </li>
        </ul>

        <h2 className="mt-6 text-[16px] font-semibold text-things-title">{t("design.medintro.fiveTitle")}</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
          <li><strong>AllergyBanner</strong>{t("design.medintro.f1")}</li>
          <li><strong>DataTable</strong>{t("design.medintro.f2")}</li>
          <li><strong>QueueTable</strong>{t("design.medintro.f3")}</li>
          <li><strong>PaperSurface</strong>{t("design.medintro.f4")}</li>
          <li><strong>AppShell</strong>{t("design.medintro.f5")}</li>
        </ol>

        <h2 className="mt-6 text-[16px] font-semibold text-things-title">{t("design.medintro.rulesTitle")}</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-things-ink">
          <li>
            <strong>{t("design.medintro.r1b")}</strong>{" "}
            <code>clinic-*</code>
            {t("design.medintro.r1s1")}
            <code>things-*</code>
            {t("design.medintro.r1s2")}
          </li>
          <li><strong>{t("design.medintro.r2b")}</strong>{t("design.medintro.r2")}</li>
          <li><strong>{t("design.medintro.r3b")}</strong>{t("design.medintro.r3")}</li>
          <li><strong>{t("design.medintro.r4b")}</strong>{t("design.medintro.r4")}</li>
          <li>
            <strong>{t("design.medintro.r5b")}</strong>
            {t("design.medintro.r5s1")}
            <code>clinic-num</code>
            {t("design.medintro.r5s2")}
          </li>
        </ol>

        <p className="mt-6 rounded-md bg-things-blue-soft px-3 py-2 text-[13px] leading-relaxed text-things-blue">
          {t("design.medintro.n1")}
          <code>app/frontend/components/clinic/README.md</code>
          {t("design.medintro.n2")}
          <code>docs/spec/</code>
          {t("design.medintro.n3")}
        </p>
      </div>
    )
  },
}
