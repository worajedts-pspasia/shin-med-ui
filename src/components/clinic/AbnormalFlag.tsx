import { ArrowDown, ArrowUp, ChevronsDown, ChevronsUp, Asterisk } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import type { LabFlag } from "./types"

const CONFIG: Record<LabFlag, { icon: typeof ArrowUp; cls: string }> = {
  N: { icon: Asterisk, cls: "text-clinic-ok" },
  H: { icon: ArrowUp, cls: "text-clinic-warn" },
  L: { icon: ArrowDown, cls: "text-clinic-warn" },
  HH: { icon: ChevronsUp, cls: "text-clinic-critical" },
  LL: { icon: ChevronsDown, cls: "text-clinic-critical" },
  A: { icon: Asterisk, cls: "text-clinic-warn" },
}

/** H / L / critical lab flag with a glyph + letter + colour — three channels,
 * never colour alone (02 §4.1). Panic values (HH/LL) render filled. */
export function AbnormalFlag({ flag, className }: { flag: LabFlag; className?: string }) {
  const { t } = useTranslation()
  const { icon: Icon, cls } = CONFIG[flag]
  const panic = flag === "HH" || flag === "LL"
  return (
    <span
      className={cn(
        "inline-flex h-[18px] items-center gap-0.5 rounded px-1 text-[11px] font-bold leading-none",
        panic ? "bg-clinic-critical text-white" : cls,
        className,
      )}
      aria-label={t(`clinic.severity.${flag}`)}
      data-flag={flag}
    >
      <Icon className="size-[11px]" strokeWidth={2.5} aria-hidden="true" />
      {flag}
    </span>
  )
}
