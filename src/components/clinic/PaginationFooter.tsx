import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// PaginationFooter — "50 Items · 1 of 3" / "Row 1 of 4" (04, Layer 7): six
// WinForms EMR screens share it. Numbers are tabular (.clinic-num).

export function PaginationFooter({
  total,
  page,
  pageCount,
  onPage,
  unit = "items",
  className,
}: {
  total: number
  page: number
  pageCount: number
  onPage: (page: number) => void
  unit?: "items" | "rows"
  label?: string
  className?: string
}) {
  const { t } = useTranslation()
  const prev = page > 1
  const next = page < pageCount
  return (
    <div
      data-slot="pagination-footer"
      role="navigation"
      aria-label={t("clinic.pager.label")}
      className={cn("flex items-center justify-between gap-2 border-t border-things-hairline px-2 py-1 text-xs text-things-gray-3", className)}
    >
      <span className="clinic-num">{t(`clinic.pager.${unit}`, { total })}</span>
      <span className="flex items-center gap-1">
        <span className="clinic-num">{t("clinic.pager.page", { page, pageCount })}</span>
        <Button variant="ghost" size="icon-xs" aria-label={t("clinic.pager.prev")} disabled={!prev} onClick={() => onPage(page - 1)}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-xs" aria-label={t("clinic.pager.next")} disabled={!next} onClick={() => onPage(page + 1)}>
          <ChevronRight aria-hidden="true" />
        </Button>
      </span>
    </div>
  )
}
