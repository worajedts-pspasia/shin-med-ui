import { BookmarkPlus, ListChecks } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// OrderSetButtons — apply / save a template (04, Layer 6; 02.3 สั่งสูตร /
// บันทึกสูตร, verified on pixels; WinForms EMR Quick Picks + Favorites). Pattern
// #5: a clinic that treats the same five conditions all day lives on this.

export interface OrderSet {
  id: string
  name: string
  items: string[]
}

export function OrderSetButtons({
  sets,
  onApply,
  onSaveCurrent,
  scope = "mine",
  className,
}: {
  sets: OrderSet[]
  onApply(set: OrderSet): void
  onSaveCurrent?(): void
  scope?: "mine" | "clinic"
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ListChecks aria-hidden="true" />
            {t("clinic.orderset.apply")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>{t(`clinic.orderset.scope.${scope}`)}</DropdownMenuLabel>
          {sets.map((s) => (
            <DropdownMenuItem key={s.id} onSelect={() => onApply(s)}>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{s.name}</span>
                <span className="truncate text-[11px] text-things-gray-3">{s.items.join(" · ")}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {onSaveCurrent && (
        <Button variant="ghost" size="sm" onClick={onSaveCurrent}>
          <BookmarkPlus aria-hidden="true" />
          {t("clinic.orderset.save")}
        </Button>
      )}
    </div>
  )
}
