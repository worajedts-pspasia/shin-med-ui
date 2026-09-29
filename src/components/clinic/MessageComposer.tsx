import { useRef, useState } from "react"
import { ArrowUp, ListTodo, Paperclip, Send } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { AttachmentChip, type AttachmentRef } from "./AttachmentChip"
import { RecipientPicker, type DirectoryEntry } from "./RecipientPicker"

// MessageComposer — compose bar / dialog (04, Layer 7). Send disabled while
// the body is empty; importance is an icon+select (no emoji); convert-to-task
// sits in the overflow — the source's good idea. Inline mode: a single-row
// bar that grows on focus.

export function MessageComposer({
  to,
  onToChange,
  directory,
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  importance = "normal",
  onImportanceChange,
  attachments,
  onAttach,
  onRemoveAttachment,
  onSend,
  sending = false,
  onConvertToTask,
  placeholder,
  className,
}: {
  to: string[]
  onToChange(ids: string[]): void
  directory: DirectoryEntry[]
  subject?: string
  onSubjectChange?(s: string): void
  body: string
  onBodyChange(s: string): void
  importance?: "normal" | "high" | "low"
  onImportanceChange?(i: "normal" | "high" | "low"): void
  attachments: AttachmentRef[]
  onAttach(a: AttachmentRef): void
  onRemoveAttachment(id: string): void
  onSend(): void
  sending?: boolean
  onConvertToTask?(): void
  placeholder?: string
  className?: string
}) {
  const { t } = useTranslation()
  const [focused, setFocused] = useState(false)
  const demoAttachCount = useRef(0)

  const addDemoAttachment = () => {
    // story/demo affordance: real callers wire a file picker / chart picker
    demoAttachCount.current += 1
    onAttach({ id: `at-demo-${demoAttachCount.current}`, kind: "file", name: `Note-2026-09-28 (${demoAttachCount.current}).pdf`, size: "88 KB" })
  }

  return (
    <div
      data-slot="message-composer"
      data-focused={focused ? "" : undefined}
      className={cn("rounded-md border border-things-hairline bg-card p-2 shadow-xs", className)}
    >
      <Field className="gap-1.5">
        <FieldLabel className="text-[11px] uppercase tracking-wide text-things-gray-3">{t("clinic.msg.to")}</FieldLabel>
        <RecipientPicker directory={directory} selected={to} onChange={onToChange} />
      </Field>

      {(focused || subject !== undefined) && onSubjectChange && (
        <Field className="mt-1.5 gap-1.5">
          <FieldLabel className="text-[11px] uppercase tracking-wide text-things-gray-3">{t("clinic.msg.subject")}</FieldLabel>
          <Input className="h-7 text-sm" value={subject ?? ""} onChange={(e) => onSubjectChange(e.target.value)} />
        </Field>
      )}

      {attachments.length > 0 && (
        <p className="mt-1.5 flex flex-wrap gap-1.5">
          {attachments.map((a) => (
            <AttachmentChip key={a.id} attachment={a} onRemove={() => onRemoveAttachment(a.id)} />
          ))}
        </p>
      )}

      <div className="mt-1.5 flex items-end gap-1.5">
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && body.trim() !== "" && to.length > 0) {
              e.preventDefault()
              onSend()
            }
          }}
          rows={focused ? 4 : 1}
          aria-label={t("clinic.msg.body")}
          placeholder={placeholder ?? t("clinic.msg.write")}
          className="max-h-40 min-h-8 flex-1 resize-none rounded-md border border-things-box bg-transparent px-2 py-1.5 text-sm shadow-xs placeholder:text-things-gray-3 focus-visible:border-things-blue focus-visible:ring-2 focus-visible:ring-things-blue/30"
        />
        <span className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label={t("clinic.msg.attach")} onClick={addDemoAttachment}>
            <Paperclip aria-hidden="true" />
          </Button>
          {onImportanceChange && (
            <NativeSelect
              aria-label={t("clinic.msg.importance")}
              value={importance}
              onChange={(e) => onImportanceChange(e.target.value as "normal" | "high" | "low")}
              className="h-8 w-auto py-0 text-xs"
            >
              <option value="normal">{t("clinic.msg.importance.normal")}</option>
              <option value="high">{t("clinic.msg.importance.high")}</option>
              <option value="low">{t("clinic.msg.importance.low")}</option>
            </NativeSelect>
          )}
          {(onConvertToTask || onImportanceChange) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={t("clinic.msg.more")}>
                  <ListTodo aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onConvertToTask && (
                  <DropdownMenuItem onSelect={onConvertToTask}>
                    <ArrowUp className="size-3.5 rotate-45" aria-hidden="true" />
                    {t("clinic.msg.convertToTask")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button size="icon-sm" aria-label={t("clinic.msg.send")} disabled={body.trim() === "" || to.length === 0 || sending} onClick={onSend}>
            <Send aria-hidden="true" />
          </Button>
        </span>
      </div>
    </div>
  )
}
