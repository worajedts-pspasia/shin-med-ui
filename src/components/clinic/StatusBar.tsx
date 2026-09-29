import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// StatusBar — bottom bar (04, Layer 1; WinForms EMR / Thai VB6 product footers).
// Below md ONLY the environment indicator survives — a STAGING/TRAINING
// marker on a clinical app is a safety feature, not chrome.

export function StatusBar({
  left,
  center,
  right,
  environment,
  className,
}: {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
  /** e.g. "TRAINING" — the one thing that never drops on mobile. */
  environment?: { label: string; tone?: "warn" | "critical" }
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <footer
      data-slot="status-bar"
      role="contentinfo"
      aria-label={t("clinic.status.label")}
      className={cn("flex items-center justify-between gap-3 border-t border-things-hairline bg-things-sidebar px-3 py-1 text-[11px] text-things-gray-3", className)}
    >
      <span className="hidden min-w-0 truncate md:inline">{left}</span>
      <span className="hidden min-w-0 truncate lg:inline">{center}</span>
      <span className="hidden min-w-0 truncate md:inline">{right}</span>
      {environment && (
        <span
          data-environment={environment.tone ?? "warn"}
          className={cn(
            "ml-auto shrink-0 rounded-sm border px-1.5 py-px font-semibold uppercase tracking-wider",
            environment.tone === "critical" ? "border-clinic-critical/40 text-clinic-critical" : "border-clinic-warn/40 text-clinic-warn",
          )}
        >
          {environment.label}
        </span>
      )}
    </footer>
  )
}
