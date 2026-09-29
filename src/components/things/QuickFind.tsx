import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Calendar, FolderOpen, Search, Tag } from "lucide-react"
import { useSearch } from "@/api/hooks"
import { fmtDate } from "@/components/things/TaskRow"
import type { Route } from "@/routes"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const routeOfTask = (t: { project_id: number | null; area_id: number | null }): Route =>
  t.project_id ? { kind: "project", id: t.project_id } : t.area_id ? { kind: "area", id: t.area_id } : { kind: "inbox" }
export function QuickFind({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onNavigate: (route: Route) => void
}) {
  const { t } = useTranslation()
  const [q, setQ] = useState("")
  const { data, isFetching } = useSearch(open ? q : "")

  useEffect(() => {
    if (!open) setQ("")
  }, [open])

  const go = (fn: () => void) => {
    fn()
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t("quickfind.placeholder")} value={q} onValueChange={setQ} />
      <CommandList>
        {q.length === 0 ? (
          <CommandEmpty>{t("quickfind.typeToSearch")}</CommandEmpty>
        ) : !data || (data.tasks.length === 0 && data.projects.length === 0 && data.areas.length === 0 && data.tags.length === 0) ? (
          isFetching ? <CommandEmpty>{t("quickfind.searching")}</CommandEmpty> : <CommandEmpty>{t("quickfind.noResults")}</CommandEmpty>
        ) : (
          <>
            {data.tasks.length > 0 && (
              <CommandGroup heading={t("quickfind.tasks")}>
                {data.tasks.map((t) => (
                  <CommandItem key={`t${t.id}`} value={t.title} onSelect={() => go(() => onNavigate(routeOfTask(t)))}>
                    <Calendar className="size-3.5 text-things-gray" />
                    <span className="flex-1 truncate">{t.title}</span>
                    {t.when_date && <span className="text-[11px] text-things-gray">{fmtDate(t.when_date)}</span>}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {data.projects.length > 0 && (
              <CommandGroup heading={t("quickfind.projects")}>
                {data.projects.map((p) => (
                  <CommandItem key={`p${p.id}`} value={p.name} onSelect={() => go(() => onNavigate({ kind: "project", id: p.id }))}>
                    <FolderOpen className="size-3.5 text-things-blue" />
                    {p.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {data.areas.length > 0 && (
              <CommandGroup heading={t("quickfind.areas")}>
                {data.areas.map((a) => (
                  <CommandItem key={`a${a.id}`} value={a.name} onSelect={() => go(() => onNavigate({ kind: "area", id: a.id }))}>
                    <Search className="size-3.5 text-things-gray" />
                    {a.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {data.tags.length > 0 && (
              <CommandGroup heading={t("quickfind.tags")}>
                {data.tags.map((t) => (
                  <CommandItem key={`g${t.id}`} value={`tag ${t.name}`} onSelect={() => go(() => onNavigate({ kind: "anytime" }))}>
                    <Tag className="size-3.5 text-things-gray" />
                    {t.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
