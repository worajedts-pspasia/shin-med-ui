import type { LucideIcon } from "lucide-react"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ActionToolbar — icon toolbar with split buttons and overflow (04, Layer 1;
// WinForms EMR main toolbar). Labels are required — they back the tooltip and the
// aria-label. Actions that do not fit collapse into a ⋯ overflow below sm
// instead of wrapping. Destructive actions NEVER sit inline next to save
// (02 §4.4): they live in the overflow at every width.

export interface ToolbarAction {
  id: string
  icon: LucideIcon
  label: string
  onSelect?: () => void
  /** Split button — renders a chevron dropdown inline. */
  menu?: Array<{ id: string; label: string; onSelect: () => void }>
  disabled?: boolean
  /** Pushed into the overflow, never inline. */
  destructive?: boolean
}

export function ActionToolbar({
  actions,
  label,
  className,
}: {
  actions: ToolbarAction[]
  /** Accessible name for the toolbar region. */
  label?: string
  className?: string
}) {
  const { t } = useTranslation()
  const inline = actions.filter((a) => !a.destructive)
  const destructive = actions.filter((a) => a.destructive)

  return (
    <TooltipProvider delayDuration={200}>
      <div
        role="toolbar"
        aria-label={label ?? t("clinic.toolbar.label")}
        data-slot="action-toolbar"
        className={cn("flex items-center gap-1", className)}
      >
        {inline.map((a, i) => {
          const Icon = a.icon
          // the first action stays reachable on phones; the rest collapse below sm
          const collapseCls = i === 0 ? "" : "hidden sm:inline-flex"
          if (a.menu) {
            return (
              <ButtonGroup key={a.id} className={collapseCls}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" disabled={a.disabled} onClick={a.onSelect} aria-label={a.label}>
                      <Icon aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{a.label}</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" disabled={a.disabled} aria-label={`${a.label} — ${t("clinic.toolbar.more")}`}>
                      <ChevronDown aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {a.menu.map((m) => (
                      <DropdownMenuItem key={m.id} onSelect={m.onSelect}>
                        {m.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonGroup>
            )
          }
          return (
            <Tooltip key={a.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={a.disabled}
                  onClick={a.onSelect}
                  aria-label={a.label}
                  className={collapseCls}
                >
                  <Icon aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{a.label}</TooltipContent>
            </Tooltip>
          )
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={t("clinic.toolbar.more")}>
              <MoreHorizontal aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* inline actions reappear here below sm via CSS — no JS measuring */}
            {inline.map((a) =>
              a.menu ? (
                <DropdownMenuSub key={a.id}>
                  <DropdownMenuSubTrigger className="sm:hidden">{a.label}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem className="sm:hidden" onSelect={a.onSelect}>
                      {a.label}
                    </DropdownMenuItem>
                    {a.menu.map((m) => (
                      <DropdownMenuItem key={m.id} onSelect={m.onSelect}>
                        {m.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem
                  key={a.id}
                  className={cn("sm:hidden", a.disabled && "pointer-events-none opacity-50")}
                  onSelect={a.onSelect}
                >
                  {a.label}
                </DropdownMenuItem>
              ),
            )}
            {destructive.length > 0 && inline.length > 1 && <DropdownMenuSeparator />}
            {destructive.map((a) => (
              <DropdownMenuItem
                key={a.id}
                className="text-clinic-critical focus:text-clinic-critical"
                disabled={a.disabled}
                onSelect={a.onSelect}
              >
                {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  )
}
