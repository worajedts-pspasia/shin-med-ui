import type { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// PaperSurface — the printable-document container (04, Layer 7; Rx preview,
// letter, fax transmittal, CCD). Signals "this is a document, not app state":
// clinic-paper fill, paper-edge border, paper-ink text, subtle page shadow,
// print styles. Document artifacts may use a serif face — UI chrome stays
// system sans.

const SIZE: Record<"a4" | "letter" | "auto", string> = {
  a4: "max-w-[210mm]",
  letter: "max-w-[216mm]",
  auto: "max-w-none",
}

export function PaperSurface({
  size = "auto",
  serif = false,
  toolbar,
  watermark,
  children,
  className,
}: {
  size?: "a4" | "letter" | "auto"
  /** Serif face for document artifacts (letters, Rx). Chrome stays sans. */
  serif?: boolean
  /** App chrome ABOVE the sheet — never styled as paper. */
  toolbar?: React.ReactNode
  /** Faint centered watermark behind the content (e.g. pending interactions). */
  watermark?: { icon: LucideIcon; label: string }
  children: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div data-slot="paper-surface" data-size={size} className={cn("flex w-full flex-col items-center", className)}>
      {toolbar && <div className="mb-2 w-full">{toolbar}</div>}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-sm border bg-clinic-paper text-clinic-paper-ink shadow-[0_1px_6px_-2px_rgba(0,0,0,0.18)] print:rounded-none print:border-0 print:shadow-none",
          SIZE[size],
          serif && "font-serif",
        )}
      >
        {watermark && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex -rotate-24 flex-col items-center gap-1 text-clinic-warn/12">
              <watermark.icon className="size-24" strokeWidth={1} />
              <span className="text-sm font-semibold uppercase tracking-[0.3em]">{watermark.label}</span>
            </span>
          </span>
        )}
        <div className="relative">{children}</div>
      </div>
      <span className="sr-only">{t("clinic.paper.document")}</span>
    </div>
  )
}
