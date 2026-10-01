import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Grid3x3, Pin, PinOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CATEGORY_COLORS, type CategoryId } from "./tokens"

// LauncherRail — the MS-cloud "side toolbar" pattern in clinic tokens, with two
// modes. `pinned` (default): a waffle opens a grouped app launcher and pinning
// a tile adds a Tooltip shortcut to the rail. `sections` (issue #1): the waffle
// lists the program's top-level MODULES (grouped, searchable, some disabled for
// "coming later"); the rail shows the active module's SECTIONS as icon+Tooltip
// items. In both modes the rail is w-14 with ModuleRail-collapsed styling and
// its short blue active bar — parity is by construction. Tile tints reuse the
// category palette; severity colours never appear on navigation.

export interface LauncherApp {
  id: string
  label: string
  icon: LucideIcon
  /** Chart category — drives the tile tint. */
  category: CategoryId
  /** Group id; rendered in `groups` order inside the flyout. */
  group: string
  /** sections mode: not yet available — tile greys out with a "coming later" tooltip. */
  disabled?: boolean
}

export interface LauncherGroup {
  id: string
  label: string
}

export interface LauncherSection {
  id: string
  label: string
  icon: LucideIcon
  href?: string
}

export function LauncherRail({
  mode = "pinned",
  apps = [],
  groups,
  defaultPinnedIds = [],
  pinnedIds,
  onPinnedIdsChange,
  activeId,
  onSelect,
  modules,
  activeModuleId,
  sections,
  activeSectionId,
  onModuleSelect,
  onSectionSelect,
  footer,
  className,
}: {
  /** `pinned` keeps today's behaviour; `sections` is the clinic-program mode (issue #1). */
  mode?: "pinned" | "sections"
  /** Apps for pinned mode; unused in sections mode. */
  apps?: LauncherApp[]
  /** Group order + labels; defaults to first-appearance order with id as label. */
  groups?: LauncherGroup[]
  defaultPinnedIds?: string[]
  /** Controlled pin list; without it the rail manages its own state. */
  pinnedIds?: string[]
  onPinnedIdsChange?: (ids: string[]) => void
  activeId?: string
  onSelect?: (id: string) => void
  // ——— sections mode ———
  /** The program's top-level modules (same shape as `apps`; `disabled` = coming later). */
  modules?: LauncherApp[]
  activeModuleId?: string
  /** Sections of the active module, in the order the module defines. */
  sections?: LauncherSection[]
  activeSectionId?: string
  onModuleSelect?: (id: string) => void
  onSectionSelect?: (id: string) => void
  footer?: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  const [internalPins, setInternalPins] = useState(defaultPinnedIds)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const pins = pinnedIds ?? internalPins

  const flyoutItems = mode === "sections" ? (modules ?? []) : apps

  const byId = new Map(apps.map((a) => [a.id, a]))
  const pinnedApps = pins.flatMap((id) => {
    const a = byId.get(id)
    return a ? [a] : []
  })

  const togglePin = (id: string) => {
    const next = pins.includes(id) ? pins.filter((p) => p !== id) : [...pins, id]
    if (pinnedIds === undefined) setInternalPins(next)
    onPinnedIdsChange?.(next)
  }

  const groupOrder =
    groups ?? Array.from(new Set(flyoutItems.map((a) => a.group))).map((id) => ({ id, label: id }))
  const q = query.trim().toLowerCase()
  const filtered = q ? flyoutItems.filter((a) => a.label.toLowerCase().includes(q)) : flyoutItems

  const railItems: Array<{ id: string; label: string; Icon: LucideIcon; onSelect?: () => void; active: boolean }> =
    mode === "sections"
      ? (sections ?? []).map((s) => ({
          id: s.id,
          label: s.label,
          Icon: s.icon,
          onSelect: () => onSectionSelect?.(s.id),
          active: s.id === activeSectionId,
        }))
      : pinnedApps.map((a) => ({
          id: a.id,
          label: a.label,
          Icon: a.icon,
          onSelect: () => onSelect?.(a.id),
          active: a.id === activeId,
        }))

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        data-slot="launcher-rail"
        data-mode={mode}
        aria-label={mode === "sections" ? t("clinic.launcher.modules") : t("clinic.launcher.label")}
        className={cn(
          "flex h-full w-14 shrink-0 flex-col items-center gap-0.5 border-r border-things-hairline bg-things-sidebar p-1.5",
          className,
        )}
      >
        {/* Waffle — always the top-left button; opens the launcher (apps or modules) */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-waffle
              aria-label={mode === "sections" ? t("clinic.launcher.modules") : t("clinic.launcher.open")}
              aria-expanded={open}
              className="relative flex min-h-9 w-full items-center justify-center rounded-sm text-things-gray-2 transition-colors hover:bg-things-hover hover:text-things-title data-[state=open]:bg-things-select data-[state=open]:text-things-blue"
            >
              <Grid3x3 className="size-4" aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-80 p-0">
            <div className="border-b border-things-hairline p-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("clinic.launcher.search")}
                aria-label={t("clinic.launcher.search")}
                className="h-8 text-sm"
              />
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-things-gray-3">
                  {t("clinic.launcher.noResults")}
                </p>
              )}
              {groupOrder.map((g) => {
                const items = filtered.filter((a) => a.group === g.id)
                if (items.length === 0) return null
                return (
                  <section key={g.id} className="mb-3 last:mb-0">
                    <h3 className="px-1 pb-1 text-xs font-medium text-things-gray-3">{g.label}</h3>
                    <div className="grid grid-cols-3 gap-1">
                      {items.map((a) => {
                        const Icon = a.icon
                        const pinned = pins.includes(a.id)
                        const selected = mode === "sections" && a.id === activeModuleId
                        const disabled = mode === "sections" && a.disabled
                        return (
                          <div key={a.id} className="group/tile relative">
                            <button
                              type="button"
                              data-tile={a.id}
                              aria-disabled={disabled || undefined}
                              onClick={() => {
                                if (disabled) return
                                if (mode === "sections") onModuleSelect?.(a.id)
                                else onSelect?.(a.id)
                                setOpen(false)
                              }}
                              className={cn(
                                "flex w-full flex-col items-center gap-1.5 rounded-md p-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-things-blue",
                                disabled
                                  ? "cursor-not-allowed opacity-45"
                                  : "hover:bg-things-hover",
                                selected && !disabled && "bg-things-select",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-10 items-center justify-center rounded-md",
                                  CATEGORY_COLORS[a.category].soft,
                                )}
                              >
                                <Icon
                                  className={cn("size-5", CATEGORY_COLORS[a.category].text)}
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="w-full truncate text-xs text-things-title">{a.label}</span>
                            </button>
                            {mode === "pinned" && (
                              <button
                                type="button"
                                data-pin={a.id}
                                aria-pressed={pinned}
                                aria-label={`${pinned ? t("clinic.launcher.unpin") : t("clinic.launcher.pin")}: ${a.label}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  togglePin(a.id)
                                }}
                                className={cn(
                                  "absolute right-0.5 top-0.5 rounded-sm p-1 transition-colors hover:bg-things-select",
                                  pinned
                                    ? "text-things-blue opacity-100"
                                    : "text-things-gray-3 opacity-0 group-hover/tile:opacity-100 focus-visible:opacity-100",
                                )}
                              >
                                {pinned ? (
                                  <Pin className="size-3" aria-hidden="true" />
                                ) : (
                                  <PinOff className="size-3" aria-hidden="true" />
                                )}
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>

        <span className="my-1 w-6 shrink-0 border-t border-things-hairline" aria-hidden="true" />

        {/* Rail body: pinned shortcuts (pin order) or the active module's sections (module order) */}
        <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-0.5 overflow-y-auto">
          {railItems.map(({ id, label, Icon, onSelect: pick, active }) => {
            const row = (
              <button
                type="button"
                data-rail-item={id}
                aria-current={active ? "page" : undefined}
                onClick={pick}
                className={cn(
                  "relative flex min-h-9 w-full items-center justify-center rounded-sm transition-colors",
                  active
                    ? "bg-things-select font-medium text-things-blue"
                    : "text-things-gray-2 hover:bg-things-hover hover:text-things-title",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-things-blue"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>{row}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        {footer && <div className="mt-auto w-full pt-2">{footer}</div>}
      </nav>
    </TooltipProvider>
  )
}
