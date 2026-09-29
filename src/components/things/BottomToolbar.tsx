import { CalendarDays, Flag, ListPlus, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function Tool({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg text-things-gray-4 transition-colors",
            disabled ? "opacity-35" : "hover:bg-black/[0.05] active:bg-black/[0.08]",
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[11px]">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

/** Tools act on the selected (expanded) task; the + always works. */
export function BottomToolbar({
  floating,
  onNewTodo,
  onQuickFind,
  hasSelection,
  onSchedule,
  onDeadline,
  onChecklist,
}: {
  floating?: boolean
  onNewTodo: () => void
  onQuickFind: () => void
  hasSelection: boolean
  onSchedule: () => void
  onDeadline: () => void
  onChecklist: () => void
}) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        "z-10 flex h-[54px] items-center gap-1 bg-white/85 px-2 backdrop-blur-md",
        floating ? "rounded-2xl border border-things-hairline shadow-[0_10px_35px_rgba(0,0,0,0.14)]" : "border-t border-things-hairline",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="New To-Do"
            onClick={onNewTodo}
            className="flex size-9 items-center justify-center rounded-full bg-things-blue text-white shadow-[0_2px_8px_rgba(59,130,236,0.45)] transition-all hover:bg-things-blue-dark active:scale-95"
          >
            <Plus className="size-[19px]" strokeWidth={2.4} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[11px]">
          {t("toolbar.newTodo")}
        </TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="mx-1 h-6 !bg-things-hairline" />
      <Tool label={t("toolbar.checklist")} disabled={!hasSelection} onClick={onChecklist}>
        <ListPlus className="size-[18px]" strokeWidth={1.8} />
      </Tool>
      <Tool label={t("toolbar.schedule")} disabled={!hasSelection} onClick={onSchedule}>
        <CalendarDays className="size-[18px]" strokeWidth={1.8} />
      </Tool>
      <Tool label={t("toolbar.deadline")} disabled={!hasSelection} onClick={onDeadline}>
        <Flag className="size-[18px]" strokeWidth={1.8} />
      </Tool>
      <Tool label={t("toolbar.quickFind")} onClick={onQuickFind}>
        <Search className="size-[18px]" strokeWidth={1.8} />
      </Tool>
    </div>
  )
}
