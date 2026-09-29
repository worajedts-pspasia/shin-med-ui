import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import i18n from "@/i18n"
import { tt } from "@/lib/i18n-shim"
import { changeLocale, type Locale } from "@/i18n"
import { shortDate } from "@/lib/dates"
import {
  Ban,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  Clock,
  FolderOpen,
  Inbox as InboxIcon,
  MapPin,
  MoreHorizontal,
  Sun,
  Sunset,
  Tag as TagIcon,
  Trash2,
  X,
} from "lucide-react"
import { addDays, format, isToday, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { useBootstrap, useInvalidate, useTaskMutations } from "@/api/hooks"
import { api } from "@/api/client"
import type { ApiTask } from "@/api/types"
import { CheckGlyph } from "@/components/things/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type TaskHandlers = ReturnType<typeof useTaskMutations>

export function HeaderMenu({ className }: { className?: string }) {
  const { t, i18n } = useTranslation()
  const change = (locale: string) => { void changeLocale(locale as Locale) }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="More options"
          className={cn(
            "flex size-6 items-center justify-center rounded-md text-things-gray transition-colors hover:bg-black/[0.05] hover:text-things-gray-5",
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem asChild>
          <a href="/settings">{t("menu.settings")}</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/tags">{t("menu.tags")}</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/api/docs" target="_blank" rel="noreferrer">{t("menu.api")}</a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] text-things-gray">{t("menu.language")}</DropdownMenuLabel>
        {[["en", "English"], ["th", "ไทย"], ["ja", "日本語"]].map(([code, label]) => (
          <DropdownMenuItem key={code} onClick={() => change(code)} data-current={i18n.language === code}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Chip({ children, danger, onClick }: { children: React.ReactNode; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-[19px] items-center gap-1 rounded-md px-1.5 text-[11px] leading-none transition-colors",
        danger ? "text-things-badge" : "bg-things-chip-soft text-things-gray-2 hover:bg-things-chip",
      )}
    >
      {children}
    </button>
  )
}

export const fmtDate = (d: string | null) =>
  d ? shortDate(d, i18n.language, { today: tt("task.today"), tomorrow: tt("task.tomorrow") }) : ""

export function TaskRow({
  task,
  expanded = false,
  onExpand,
  handlers,
  contextLabel,
}: {
  task: ApiTask
  expanded?: boolean
  onExpand?: () => void
  handlers?: TaskHandlers
  contextLabel?: string
}) {
  const { t } = useTranslation()
  const own = useTaskMutations(task)
  const h = handlers ?? own
  const done = task.status !== "open"
  const checklistDone = task.checklist_items.filter((c) => c.completed).length
  const checklistTotal = task.checklist_items.length

  return (
    <div
      className={cn(
        "group relative flex cursor-default items-start gap-3 rounded-lg px-3 py-[7px] transition-colors",
        expanded ? "bg-things-blue-soft" : "hover:bg-things-hover",
      )}
    >
      <button
        type="button"
        aria-label={done ? "Mark as not completed" : "Mark as completed"}
        onClick={h.toggleComplete}
        className="mt-[2px] flex size-[19px] shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
      >
        {done ? (
          <span className={cn("flex size-[19px] items-center justify-center rounded-full", task.status === "canceled" ? "bg-things-gray" : "bg-things-blue")}>
            {task.status === "canceled" ? <Ban className="size-3 text-white" /> : <CheckGlyph className="size-[11px]" />}
          </span>
        ) : (
          <span className="size-[18px] rounded-full border-[1.5px] border-things-box bg-white transition-colors group-hover:border-things-gray" />
        )}
      </button>

      <div
        className="min-w-0 flex-1 pb-0.5"
        onClick={(e) => {
          // Toggling expansion must not swallow clicks on the controls inside
          // the expanded editor (buttons, inputs, popovers, textareas).
          if (!onExpand) return
          const el = e.target as HTMLElement
          if (el.closest("button, input, textarea, select, a, [role='menuitem'], [data-radix-popper-content-wrapper]")) return
          onExpand()
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <p className={cn("truncate text-[14.5px] leading-[1.45] text-things-ink", done && "text-things-gray")}>
            {task.title}
          </p>
          <span className="mt-0.5 flex shrink-0 items-center gap-1.5 pr-1 text-[11.5px] leading-none text-things-gray">
            {checklistTotal > 0 && (
              <span className="tabular-nums">
                {checklistDone}/{checklistTotal}
              </span>
            )}
            {!expanded && <MoreHorizontal className="size-[15px] opacity-0 transition-opacity group-hover:opacity-100" />}
          </span>
        </div>

        {!expanded && (task.notes || contextLabel) && !done && (
          <p className="truncate text-[12.5px] leading-[1.5] text-things-gray">
            {checklistTotal > 0 && (
              <span className="mr-1.5 inline-flex items-center gap-1 text-things-gray-2">
                <span className="inline-block size-[6px] rounded-[2px] border border-things-box" />
                {checklistTotal - checklistDone} {t("task.remaining", { count: checklistTotal - checklistDone })}
              </span>
            )}
            {contextLabel ? `${contextLabel} — ` : ""}
            {task.notes}
          </p>
        )}

        {!expanded && !done && (task.reminder_at || task.deadline_date || task.tags.length > 0) && (
          <div className="mt-[5px] flex flex-wrap items-center gap-1.5">
            {task.reminder_at && (
              <Chip>
                <Clock className="size-[11px]" strokeWidth={2} />
                {task.reminder_at}
              </Chip>
            )}
            {task.deadline_date && (
              <Chip danger={task.deadline_date <= format(new Date(), "yyyy-MM-dd")}>
                <CalendarDays className="size-[11px]" strokeWidth={2} />
                {fmtDate(task.deadline_date)}
              </Chip>
            )}
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex h-[19px] items-center gap-1 rounded-full border border-things-tag-border bg-white px-1.5 text-[11px] leading-none text-things-gray-3"
              >
                <TagIcon className="size-[10px] text-things-gray" strokeWidth={2.2} />
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {expanded && <TaskDetail task={task} handlers={h} />}
      </div>
    </div>
  )
}

// ——— expanded editor ———

function TaskDetail({ task, handlers }: { task: ApiTask; handlers: TaskHandlers }) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(task.title)
  const [notes, setNotes] = useState(task.notes ?? "")
  const [newItem, setNewItem] = useState("")
  const [newTag, setNewTag] = useState("")
  const [reminder, setReminder] = useState(task.reminder_at ?? "")
  const { data: boot } = useBootstrap()
  const invalidate = useInvalidate()

  useEffect(() => setTitle(task.title), [task.title])
  useEffect(() => setNotes(task.notes ?? ""), [task.notes])

  const saveTitle = () => {
    if (title.trim() && title !== task.title) handlers.updateTitle(title.trim())
    else setTitle(task.title)
  }

  const createTag = async () => {
    const name = newTag.trim()
    if (!name) return
    const tag = await api.createTag({ name })
    const updated = await api.updateTask(task.id, { tag_ids: [...task.tags.map((t) => t.id), tag.id] })
    handlers.apply(updated)
    setNewTag("")
  }

  const toggleTag = async (tagId: number) => {
    const ids = task.tags.some((t) => t.id === tagId)
      ? task.tags.filter((t) => t.id !== tagId).map((t) => t.id)
      : [...task.tags.map((t) => t.id), tagId]
    const updated = await api.updateTask(task.id, { tag_ids: ids })
    handlers.apply(updated)
  }

  const addChecklistItem = () => {
    if (!newItem.trim()) return
    handlers.addChecklistItem(newItem.trim())
    setNewItem("")
  }

  return (
    <div className="mt-1.5 flex flex-col gap-2.5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={saveTitle}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        className="w-full bg-transparent text-[14.5px] font-medium text-things-ink outline-none"
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="inline-flex h-[23px] items-center gap-1 rounded-md bg-things-chip-soft px-2 text-[11px] text-things-gray-2 hover:bg-things-chip">
              <CalendarIcon className="size-[11px]" strokeWidth={2} />
              {task.when_date ? (task.evening ? `${t("task.evening")} · ${fmtDate(task.when_date)}` : fmtDate(task.when_date)) : t("task.when")}
            </button>
          </PopoverTrigger>
          <WhenPopover task={task} handlers={handlers} />
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="inline-flex h-[23px] items-center gap-1 rounded-md bg-things-chip-soft px-2 text-[11px] text-things-gray-2 hover:bg-things-chip">
              <CalendarDays className="size-[11px]" strokeWidth={2} />
              {task.deadline_date ? `${t("task.deadline")} ${fmtDate(task.deadline_date)}` : t("task.deadline")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar
              mode="single"
              selected={task.deadline_date ? parseISO(task.deadline_date) : undefined}
              onSelect={(d) => handlers.setDeadline(d ? format(d, "yyyy-MM-dd") : null)}
            />
            {task.deadline_date && (
              <Button variant="ghost" size="sm" className="mt-1 w-full text-[12px] text-things-gray-4" onClick={() => handlers.setDeadline(null)}>
                {t("task.clearDeadline")}
              </Button>
            )}
          </PopoverContent>
        </Popover>

        <span className="inline-flex h-[23px] items-center gap-1 rounded-md bg-things-chip-soft px-1.5 text-[11px] text-things-gray-2">
          <Clock className="size-[11px]" strokeWidth={2} />
          <input
            type="time"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            onBlur={() => reminder !== (task.reminder_at ?? "") && handlers.setReminder(reminder || null)}
            className="w-[62px] bg-transparent text-[11px] text-things-gray-2 outline-none"
            aria-label="Reminder time"
          />
          {task.reminder_at && (
            <button type="button" aria-label="Clear reminder" onClick={() => { setReminder(""); handlers.setReminder(null) }}>
              <X className="size-3 text-things-gray" />
            </button>
          )}
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="inline-flex h-[23px] items-center gap-1 rounded-md bg-things-chip-soft px-2 text-[11px] text-things-gray-2 hover:bg-things-chip">
              <TagIcon className="size-[11px]" strokeWidth={2} />
              {task.tags.length ? task.tags.map((t) => t.name).join(", ") : "Tags"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1.5" align="start">
            <div className="flex max-h-44 flex-col overflow-y-auto">
              {(boot?.tags ?? []).map((tag) => {
                const active = task.tags.some((t) => t.id === tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className="flex items-center gap-2 rounded-md px-1.5 py-1 text-left text-[12.5px] text-things-ink hover:bg-things-hover"
                  >
                    <span className={cn("flex size-[15px] items-center justify-center rounded-[4px] border", active ? "border-things-blue bg-things-blue" : "border-things-box")}>
                      {active && <Check className="size-3 text-white" strokeWidth={3} />}
                    </span>
                    {tag.name}
                  </button>
                )
              })}
            </div>
            <div className="mt-1.5 flex gap-1 border-t border-things-hairline pt-1.5">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createTag()}
                placeholder="New tag…"
                className="h-7 flex-1 border-things-border text-[12px]"
              />
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[12px] text-things-blue" onClick={createTag}>
                Add
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <MoveMenu task={task} handlers={handlers} />
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => notes !== (task.notes ?? "") && handlers.updateNotes(notes)}
        placeholder={t("task.notes")}
        rows={2}
        className="w-full resize-none rounded-md bg-white/60 px-2 py-1.5 text-[12.5px] leading-[1.55] text-things-gray-2 outline-none placeholder:text-things-gray focus:bg-white"
      />

      {task.checklist_items.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {task.checklist_items.map((item) => (
            <div key={item.id} className="group/item flex items-center gap-2.5">
              <button
                type="button"
                aria-label={item.completed ? "Uncheck" : "Check"}
                onClick={() => handlers.toggleChecklistItem(item)}
                className={cn(
                  "flex size-[15px] shrink-0 items-center justify-center rounded-full",
                  item.completed ? "bg-things-blue" : "border-[1.5px] border-things-box bg-white",
                )}
              >
                {item.completed && <CheckGlyph className="size-[9px]" />}
              </button>
              <span className={cn("flex-1 text-[13px] leading-tight", item.completed ? "text-things-gray" : "text-things-ink-2")}>
                {item.title}
              </span>
              <button
                type="button"
                aria-label="Delete checklist item"
                onClick={() => handlers.removeChecklistItem(item.id)}
                className="text-things-gray opacity-0 transition-opacity group-hover/item:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="flex size-[15px] items-center justify-center rounded-full border-[1.5px] border-dashed border-things-box text-things-gray">
          <span className="text-[10px] leading-none">+</span>
        </span>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
          onBlur={addChecklistItem}
          placeholder={t("task.checklistItem")}
          className="flex-1 bg-transparent text-[13px] text-things-ink outline-none placeholder:text-things-gray"
        />
      </div>

      <div className="flex items-center justify-between border-t border-things-hairline pt-2">
        {task.status === "open" ? (
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-[12px] text-things-gray-4 hover:text-things-ink" onClick={handlers.cancel}>
            <Ban className="size-3.5" /> {t("task.cancel")}
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-[12px] text-things-gray-4 hover:text-things-ink" onClick={handlers.toggleComplete}>
            <Check className="size-3.5" /> {t("task.reopen")}
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-[12px] text-things-badge hover:bg-things-badge/5" onClick={handlers.trash}>
          <Trash2 className="size-3.5" /> {t("task.delete")}
        </Button>
      </div>
    </div>
  )
}

function WhenPopover({ task, handlers }: { task: ApiTask; handlers: TaskHandlers }) {
  const { t } = useTranslation()
  return (
    <PopoverContent className="w-auto p-1.5" align="start">
      <div className="flex flex-col">
        <WhenOption icon={<Sun className="size-3.5" />} label={t("task.today")} onClick={() => handlers.schedule(format(new Date(), "yyyy-MM-dd"))} />
        <WhenOption icon={<CalendarIcon className="size-3.5" />} label={t("task.tomorrow")} onClick={() => handlers.schedule(format(addDays(new Date(), 1), "yyyy-MM-dd"))} />
        <WhenOption icon={<Sunset className="size-3.5" />} label={t("task.evening")} onClick={() => handlers.schedule(format(new Date(), "yyyy-MM-dd"), true)} />
        <WhenOption icon={<FolderOpen className="size-3.5" />} label={t("task.someday")} onClick={handlers.scheduleSomeday} />
      </div>
      <div className="border-t border-things-hairline pt-1.5">
        <Calendar
          mode="single"
          selected={task.when_date ? parseISO(task.when_date) : undefined}
          onSelect={(d) => d && handlers.schedule(format(d, "yyyy-MM-dd"))}
        />
      </div>
      {(task.when_date || task.someday) && (
        <Button variant="ghost" size="sm" className="mt-1 w-full text-[12px] text-things-gray-4" onClick={() => handlers.schedule(null)}>
          {t("task.clear")}
        </Button>
      )}
    </PopoverContent>
  )
}

function WhenOption({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] text-things-ink hover:bg-things-hover"
    >
      <span className="text-things-gray-4">{icon}</span>
      {label}
    </button>
  )
}

function MoveMenu({ task, handlers }: { task: ApiTask; handlers: TaskHandlers }) {
  const { t } = useTranslation()
  const { data: boot } = useBootstrap()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="inline-flex h-[23px] items-center gap-1 rounded-md bg-things-chip-soft px-2 text-[11px] text-things-gray-2 hover:bg-things-chip">
          <MapPin className="size-[11px]" strokeWidth={2} />
          {t("task.move")}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem onClick={() => handlers.move({ inbox: true })}>
          <InboxIcon className="size-3.5" /> {t("sidebar.inbox")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] text-things-gray">{t("task.lists")}</DropdownMenuLabel>
        {(boot?.projects ?? []).map((p) => (
          <DropdownMenuItem key={p.id} onClick={() => handlers.move({ project_id: p.id })}>
            <span className="size-2 rounded-[3px]" style={{ backgroundColor: p.color }} />
            {p.name}
          </DropdownMenuItem>
        ))}
        {(boot?.areas ?? []).length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[11px] text-things-gray">{t("task.areas")}</DropdownMenuLabel>
            {(boot?.areas ?? []).map((a) => (
              <DropdownMenuItem key={a.id} onClick={() => handlers.move({ area_id: a.id })}>
                {a.name}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
