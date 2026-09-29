import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// NestedPanel — titled sub-panel with a single add action (04, Layer 6;
// cardiology FINDINGS / COMPLICATIONS). Hairline box, uppercase 11px title,
// right-aligned ghost + ADD button. CollapsiblePanel variant="inline" shape.

export function NestedPanel({
  title,
  addLabel,
  onAdd,
  children,
  emptyState,
  className,
}: {
  title: string
  addLabel?: string
  onAdd?(): void
  children?: React.ReactNode
  emptyState?: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <section data-slot="nested-panel" className={cn("rounded-md border border-things-hairline bg-card", className)}>
      <header className="flex items-center justify-between gap-2 px-2.5 py-1.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-things-gray-2">{title}</h4>
        {onAdd && (
          <Button variant="ghost" size="xs" className="h-6 gap-0.5 px-1.5 text-[11px] text-things-gray-2" onClick={onAdd}>
            <Plus className="size-3" aria-hidden="true" />
            {addLabel ?? t("clinic.nested.add")}
          </Button>
        )}
      </header>
      <div className="border-t border-things-hairline px-2.5 py-2">
        {children ?? (emptyState !== undefined ? emptyState : <p className="py-1 text-xs text-things-gray-3">{t("clinic.table.empty")}</p>)}
      </div>
    </section>
  )
}
