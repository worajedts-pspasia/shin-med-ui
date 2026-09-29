import { Check, Minus, TriangleAlert, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// ComplianceBoard — Meaningful Use (04, Layer 9): a category × tier grid of
// met/unmet chips that generalises to any quality-measure dashboard. Status
// is glyph + tone — grayscale still reads.

export type ComplianceStatus = "met" | "unmet" | "partial" | "na"

export interface ComplianceCategory {
  id: string
  label: string
  tiers: { status: ComplianceStatus; detail?: string }[]
}

// Static maps — the JIT cannot see template-built classes.
const CHIP: Record<ComplianceStatus, string> = {
  met: "bg-clinic-ok-soft text-clinic-ok",
  unmet: "bg-clinic-critical-soft text-clinic-critical",
  partial: "bg-clinic-warn-soft text-clinic-warn",
  na: "bg-things-hover text-things-gray-2",
}
function StatusGlyph({ status }: { status: ComplianceStatus }) {
  const cls = "size-3.5 shrink-0"
  if (status === "met") return <Check className={cls} aria-hidden="true" />
  if (status === "unmet") return <X className={cls} aria-hidden="true" />
  if (status === "partial") return <TriangleAlert className={cls} aria-hidden="true" />
  return <Minus className={cls} aria-hidden="true" />
}

export function ComplianceBoard({
  categories,
  tierLabels,
  className,
}: {
  categories: ComplianceCategory[]
  /** Column headers, one per tier (shared across categories). */
  tierLabels: string[]
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div
      data-slot="compliance-board"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-things-hairline bg-things-sidebar/50">
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-things-gray-2">
                {t("clinic.compliance.category")}
              </th>
              {tierLabels.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="px-3 py-2 text-center text-xs font-medium text-things-gray-2"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-things-hairline/60">
            {categories.map((c) => (
              <tr key={c.id}>
                <th scope="row" className="max-w-[16rem] truncate px-3 py-2 text-left font-medium text-things-title">
                  {c.label}
                </th>
                {c.tiers.map((tier, i) => (
                  <td key={i} className="px-3 py-2 text-center">
                    <span
                      data-status={tier.status}
                      title={tier.detail}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        CHIP[tier.status],
                      )}
                    >
                      <StatusGlyph status={tier.status} />
                      {t(`clinic.compliance.${tier.status}`)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
