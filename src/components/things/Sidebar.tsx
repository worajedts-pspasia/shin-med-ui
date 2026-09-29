import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Languages } from "lucide-react"
import { LOCALES, LOCALE_LABELS, changeLocale, type Locale } from "@/i18n"
import { Plus, Tag, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBootstrap } from "@/api/hooks"
import { useCreateArea, useCreateProject } from "@/api/hooks"
import type { Route } from "@/routes"
import {
  BoxGlyph,
  CalendarGlyph,
  InboxGlyph,
  LayersGlyph,
  ListGlyph,
  LogbookGlyph,
  StarGlyph,
} from "@/components/things/icons"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function TrafficLights() {
  return (
    <div className="flex items-center gap-2 px-4 pt-3.5 pb-1">
      <span className="size-3 rounded-full bg-things-light-red ring-1 ring-inset ring-black/10" />
      <span className="size-3 rounded-full bg-things-light-yellow ring-1 ring-inset ring-black/10" />
      <span className="size-3 rounded-full bg-things-light-green ring-1 ring-inset ring-black/10" />
    </div>
  )
}

function Row({
  icon,
  label,
  count,
  badge,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  count?: number
  badge?: boolean
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[30px] w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] text-things-ink transition-colors",
        active ? "bg-things-select font-medium text-things-ink-strong" : "hover:bg-black/[0.045]",
      )}
    >
      <span className="flex size-[17px] shrink-0 items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge && count !== undefined && count > 0 ? (
        <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-things-badge px-1 text-[10.5px] font-semibold leading-none text-white">
          {count}
        </span>
      ) : count !== undefined && count > 0 ? (
        <span className="text-[12px] leading-none text-things-gray">{count}</span>
      ) : null}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-2 pt-5 pb-1 text-[11px] font-semibold tracking-wide text-things-gray">{children}</div>
}

const COLORS = ["#4a7cf5", "#f0923f", "#7c5cd6", "#2db8a6", "#e8453c", "#c9b458", "#3fbf6e", "#e86fa4"]

function NewListDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [color, setColor] = useState(COLORS[0])
  const [areaId, setAreaId] = useState<string>("none")
  const { data: boot } = useBootstrap()
  const create = useCreateProject()

  const submit = () => {
    if (!name.trim()) return
    create.mutate(
      { name: name.trim(), color, area_id: areaId === "none" ? null : Number(areaId) },
      { onSuccess: () => { setName(""); setColor(COLORS[0]); setAreaId("none"); onOpenChange(false) } },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[340px] gap-0 rounded-xl border-things-hairline p-0 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-[15px] font-semibold text-things-title">{t("dialog.newList")}</DialogTitle>
          <DialogDescription className="text-[12px] text-things-gray">{t("dialog.newListDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-4 pb-3">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t("dialog.listName")}
            className="h-9 border-things-border text-[14px]"
          />
          <div className="flex flex-wrap gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => setColor(c)}
                className={cn("size-6 rounded-lg transition-transform", color === c && "scale-110 ring-2 ring-things-ink/30")}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <Select value={areaId} onValueChange={setAreaId}>
            <SelectTrigger className="h-9 border-things-border text-[13px]">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("dialog.noArea")}</SelectItem>
              {(boot?.areas ?? []).map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 border-t border-things-hairline px-3 py-2.5">
          <Button variant="ghost" size="sm" className="h-7 px-3 text-[12.5px] text-things-gray-4" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" className="h-7 rounded-md bg-things-blue px-3.5 text-[12.5px] font-medium text-white hover:bg-things-blue-dark" onClick={submit} disabled={!name.trim()}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NewAreaDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const create = useCreateArea()
  const submit = () => {
    if (!name.trim()) return
    create.mutate({ name: name.trim() }, { onSuccess: () => { setName(""); onOpenChange(false) } })
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[320px] gap-0 rounded-xl border-things-hairline p-0 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-[15px] font-semibold text-things-title">{t("dialog.newArea")}</DialogTitle>
          <DialogDescription className="text-[12px] text-things-gray">{t("dialog.newAreaDesc")}</DialogDescription>
        </DialogHeader>
        <div className="px-4 pb-3">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t("dialog.areaName")}
            className="h-9 border-things-border text-[14px]"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-things-hairline px-3 py-2.5">
          <Button variant="ghost" size="sm" className="h-7 px-3 text-[12.5px] text-things-gray-4" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" className="h-7 rounded-md bg-things-blue px-3.5 text-[12.5px] font-medium text-white hover:bg-things-blue-dark" onClick={submit} disabled={!name.trim()}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function Sidebar({ route, onNavigate, framed }: { route: Route; onNavigate: (route: Route) => void; framed?: boolean }) {
  const { t, i18n } = useTranslation()
  const { data: boot } = useBootstrap()
  const [listOpen, setListOpen] = useState(false)
  const [areaOpen, setAreaOpen] = useState(false)
  const isKind = (kind: Route["kind"]) => route.kind === kind
  const counts = boot?.counts ?? {}
  const projects = boot?.projects ?? []
  const areas = boot?.areas ?? []

  return (
    <div className="flex h-full w-full flex-col bg-things-sidebar text-things-ink">
      {framed && <TrafficLights />}
      <nav className="flex-1 overflow-y-auto px-2 pt-2 pb-4">
        <div className="flex flex-col gap-px">
          <Row icon={<InboxGlyph className="size-[17px]" />} label={t("sidebar.inbox")} count={counts.inbox} active={isKind("inbox")} onClick={() => onNavigate({ kind: "inbox" })} />
          <Row icon={<StarGlyph className="size-[16px]" />} label={t("sidebar.today")} count={counts.today} badge active={isKind("today")} onClick={() => onNavigate({ kind: "today" })} />
          <Row icon={<CalendarGlyph className="size-[16px]" />} label={t("sidebar.upcoming")} active={isKind("upcoming")} onClick={() => onNavigate({ kind: "upcoming" })} />
          <Row icon={<LayersGlyph className="size-[16px]" />} label={t("sidebar.anytime")} active={isKind("anytime")} onClick={() => onNavigate({ kind: "anytime" })} />
          <Row icon={<BoxGlyph className="size-[16px]" />} label={t("sidebar.someday")} active={isKind("someday")} onClick={() => onNavigate({ kind: "someday" })} />
          <Row icon={<LogbookGlyph className="size-[16px]" />} label={t("sidebar.logbook")} active={isKind("logbook")} onClick={() => onNavigate({ kind: "logbook" })} />
        </div>

        <div className="mx-2 mt-4 h-px bg-things-hairline" />

        <SectionLabel>{t("sidebar.lists")}</SectionLabel>
        <div className="flex flex-col gap-px">
          {projects.map((project) => (
            <Row
              key={project.id}
              icon={<ListGlyph color={project.color} className="size-[16px] rounded-[5px]" />}
              label={project.name}
              count={project.open_count}
              active={route.kind === "project" && route.id === project.id}
              onClick={() => onNavigate({ kind: "project", id: project.id })}
            />
          ))}
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="mt-0.5 flex h-[30px] w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] font-medium text-things-blue transition-colors hover:bg-black/[0.045]"
          >
            <span className="flex size-[17px] shrink-0 items-center justify-center rounded-full">
              <Plus className="size-4" strokeWidth={2.4} />
            </span>
            {t("sidebar.newList")}
          </button>
        </div>

        <div className="mx-2 mt-4 h-px bg-things-hairline" />

        <SectionLabel>{t("sidebar.areas")}</SectionLabel>
        <div className="flex flex-col gap-px">
          {areas.map((area) => (
            <Row
              key={area.id}
              icon={<Tag className="size-[14px] text-things-gray" strokeWidth={1.8} />}
              label={area.name}
              active={route.kind === "area" && route.id === area.id}
              onClick={() => onNavigate({ kind: "area", id: area.id })}
            />
          ))}
          <button
            type="button"
            onClick={() => setAreaOpen(true)}
            className="mt-0.5 flex h-[30px] w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] font-medium text-things-blue transition-colors hover:bg-black/[0.045]"
          >
            <span className="flex size-[17px] shrink-0 items-center justify-center rounded-full">
              <Plus className="size-4" strokeWidth={2.4} />
            </span>
            {t("sidebar.newArea")}
          </button>
        </div>

        <div className="mx-2 mt-4 h-px bg-things-hairline" />

        <div className="pt-1">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-[30px] w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] text-things-ink transition-colors hover:bg-black/[0.045]"
              >
                <Languages className="size-[15px] text-things-gray" strokeWidth={1.8} />
                <span className="flex-1">{t("menu.language")}</span>
                <span className="text-[11px] text-things-gray">{LOCALE_LABELS[i18n.language as Locale] ?? i18n.language}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1">
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => void changeLocale(code)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px]",
                    i18n.language === code ? "bg-things-select font-medium text-things-ink-strong" : "text-things-ink hover:bg-things-hover",
                  )}
                >
                  {LOCALE_LABELS[code]}
                  {i18n.language === code && <span className="size-1.5 rounded-full bg-things-blue" />}
                </button>
              ))}
            </PopoverContent>
          </Popover>
          <a
            href="/settings"
            className="flex h-[30px] items-center gap-2.5 rounded-md px-2 text-[13px] text-things-ink transition-colors hover:bg-black/[0.045]"
          >
            <span className="text-[15px]">⚙️</span>
            Account &amp; Settings
          </a>
        </div>
      </nav>

      <div className="border-t border-things-hairline px-2 py-1.5">
        <Row icon={<Trash2 className="size-[15px] text-things-gray" strokeWidth={1.8} />} label={t("sidebar.trash")} active={isKind("trash")} onClick={() => onNavigate({ kind: "trash" })} />
      </div>

      <NewListDialog open={listOpen} onOpenChange={setListOpen} />
      <NewAreaDialog open={areaOpen} onOpenChange={setAreaOpen} />
    </div>
  )
}
