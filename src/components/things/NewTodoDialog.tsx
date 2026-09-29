import { useState } from "react"
import { useTranslation } from "react-i18next"
import { addDays, format } from "date-fns"
import { CalendarDays, Flag, Sun, Sunset, Tag, Text, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBootstrap, useCreateTask } from "@/api/hooks"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type WhenChoice = "today" | "tomorrow" | "evening" | "someday"

/** Things-style quick entry: title + When shortcuts + destination list. */
export function NewTodoDialog({
  open,
  onOpenChange,
  defaultWhen = "today",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultWhen?: WhenChoice
}) {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [when, setWhen] = useState<WhenChoice>(defaultWhen)
  const [destination, setDestination] = useState<string>("inbox")
  const { data: boot } = useBootstrap()
  const create = useCreateTask()

  const submit = () => {
    if (!title.trim()) return
    const today = format(new Date(), "yyyy-MM-dd")
    const params: Parameters<typeof create.mutate>[0] = {
      title: title.trim(),
      when_date: when === "today" || when === "evening" ? today : when === "tomorrow" ? format(addDays(new Date(), 1), "yyyy-MM-dd") : null,
      evening: when === "evening",
      someday: when === "someday",
      project_id: destination.startsWith("p") ? Number(destination.slice(1)) : null,
      area_id: destination.startsWith("a") ? Number(destination.slice(1)) : null,
    }
    create.mutate(params, {
      onSuccess: () => {
        setTitle("")
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[340px] gap-0 rounded-xl border-things-hairline p-0 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("dialog.newTodo")}</DialogTitle>
          <DialogDescription>{t("dialog.newTodoDesc")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1 px-4 pt-1">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t("dialog.newTodo")}
            className="h-9 border-0 bg-transparent px-0 text-[15px] shadow-none placeholder:text-things-gray focus-visible:ring-0"
          />
          <div className="flex flex-wrap items-center gap-1 pb-3">
            {(
              [
                { id: "today", icon: <Sun className="size-[14px]" strokeWidth={1.8} />, label: "Today" },
                { id: "tomorrow", icon: <CalendarDays className="size-[14px]" strokeWidth={1.8} />, label: "Tomorrow" },
                { id: "evening", icon: <Sunset className="size-[14px]" strokeWidth={1.8} />, label: "Evening" },
                { id: "someday", icon: <FolderOpen className="size-[14px]" strokeWidth={1.8} />, label: "Someday" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setWhen(opt.id)}
                className={cn(
                  "inline-flex h-[24px] items-center gap-1 rounded-full px-2 text-[11.5px] transition-colors",
                  when === opt.id ? "bg-things-chip font-medium text-things-title" : "text-things-gray-4 hover:bg-things-hover hover:text-things-ink",
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
            <Tag className="size-[14px] text-things-gray" strokeWidth={1.8} />
            <Text className="size-[14px] text-things-gray" strokeWidth={1.8} />
            <Flag className="size-[14px] text-things-gray" strokeWidth={1.8} />
          </div>
        </div>

        <Separator className="bg-things-hairline" />

        <DialogFooter className="flex-row items-center justify-between gap-2 px-3 py-2.5">
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="h-7 w-[150px] border-things-border text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbox">{t("dialog.inbox")}</SelectItem>
              {(boot?.projects ?? []).map((p) => (
                <SelectItem key={p.id} value={`p${p.id}`}>{p.name}</SelectItem>
              ))}
              {(boot?.areas ?? []).map((a) => (
                <SelectItem key={a.id} value={`a${a.id}`}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-7 px-3 text-[12.5px] text-things-gray-4 hover:text-things-ink" onClick={() => onOpenChange(false)}>
              {t("dialog.cancel")}
            </Button>
            <Button size="sm" className="h-7 rounded-md bg-things-blue px-3.5 text-[12.5px] font-medium text-white hover:bg-things-blue-dark" onClick={submit} disabled={!title.trim()}>
              {t("dialog.add")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
