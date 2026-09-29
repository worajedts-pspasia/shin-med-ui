import type { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ModuleRail — icon + label module switcher with counts (04, Layer 1; WinForms EMR
// left rail). Active = things-blue text on things-select; collapsed shows
// icon-only with the label in a Tooltip and the count as a corner dot; counts
// cap at 99+ on things-badge. The footer carries the user block + settings.

export interface ModuleItem {
  id: string
  label: string
  icon: LucideIcon
  href?: string
  count?: number
}

export function ModuleRail({
  items,
  activeId,
  collapsed = false,
  footer,
  onSelect,
  className,
}: {
  items: ModuleItem[]
  activeId: string
  collapsed?: boolean
  footer?: React.ReactNode
  /** Without href/onSelect the rail renders as a plain list. */
  onSelect?: (id: string) => void
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <TooltipProvider delayDuration={0}>
      <nav
        data-slot="module-rail"
        data-collapsed={collapsed ? "" : undefined}
        aria-label={t("clinic.rail.label")}
        className={cn(
          "flex h-full flex-col gap-0.5 border-r border-things-hairline bg-things-sidebar p-1.5",
          collapsed ? "w-14 items-center" : "w-48",
          className,
        )}
      >
        {items.map((it) => {
          const Icon = it.icon
          const active = it.id === activeId
          const countLabel = it.count !== undefined ? (it.count > 99 ? "99+" : String(it.count)) : null
          const row = (
            <a
              key={it.id}
              href={it.href ?? "#"}
              aria-current={active ? "page" : undefined}
              onClick={(e) => {
                if (!it.href && onSelect) {
                  e.preventDefault()
                  onSelect(it.id)
                }
              }}
              className={cn(
                "relative flex min-h-9 w-full items-center gap-2.5 rounded-sm px-2 text-sm transition-colors",
                active ? "bg-things-select font-medium text-things-blue" : "text-things-gray-2 hover:bg-things-hover hover:text-things-title",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span className="min-w-0 flex-1 truncate">{it.label}</span>}
              {countLabel !== null && !collapsed && (
                <span className="clinic-num shrink-0 rounded-full bg-things-badge/15 px-1.5 text-[11px] leading-4 text-things-title">{countLabel}</span>
              )}
              {countLabel !== null && collapsed && (
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-things-badge" aria-label={countLabel} />
              )}
              {collapsed && active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-things-blue" aria-hidden="true" />}
            </a>
          )
          if (!collapsed) return row
          return (
            <Tooltip key={it.id}>
              <TooltipTrigger asChild>{row}</TooltipTrigger>
              <TooltipContent side="right">
                {it.label}
                {countLabel !== null ? ` (${countLabel})` : ""}
              </TooltipContent>
            </Tooltip>
          )
        })}
        {footer && <div className={cn("mt-auto pt-2", collapsed && "w-full")}>{footer}</div>}
      </nav>
    </TooltipProvider>
  )
}
