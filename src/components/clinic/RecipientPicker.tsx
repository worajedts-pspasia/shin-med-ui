import { useMemo, useState } from "react"
import { Check, Plus, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// RecipientPicker — directory lookup with tokens (04, Layer 7). Selected
// recipients render as name tokens with ✕; the command list groups by role;
// already-selected rows show a check. Never free-text email entry — staff are
// entities with roles.

export interface DirectoryEntry {
  id: string
  name: string
  role?: string
  avatarUrl?: string
}

export function RecipientPicker({
  directory,
  selected,
  onChange,
  max,
  className,
}: {
  directory: DirectoryEntry[]
  selected: string[]
  onChange(ids: string[]): void
  max?: number
  className?: string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const byRole = useMemo(() => {
    const m = new Map<string, DirectoryEntry[]>()
    for (const d of directory) {
      const role = d.role ?? t("clinic.recipient.role.staff")
      m.set(role, [...(m.get(role) ?? []), d])
    }
    return [...m.entries()]
  }, [directory, t])

  const atMax = max !== undefined && selected.length >= max
  const byId = new Map(directory.map((d) => [d.id, d]))

  return (
    <div data-slot="recipient-picker" className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {selected.map((id) => {
        const p = byId.get(id)
        if (!p) return null
        return (
          <span key={id} className="inline-flex max-w-48 items-center gap-1 rounded-full border border-things-tag-border bg-things-chip px-2 py-0.5 text-xs">
            <span className="truncate text-things-title">{p.name}</span>
            {p.role && <span className="hidden shrink-0 text-things-gray-3 sm:inline">{t(`clinic.recipient.role.${p.role}`, { defaultValue: p.role })}</span>}
            <button
              type="button"
              aria-label={t("clinic.recipient.remove", { name: p.name })}
              className="-mr-1 shrink-0 rounded-full p-0.5 text-things-gray-3 hover:bg-things-hover hover:text-things-title"
              onClick={() => onChange(selected.filter((s) => s !== id))}
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        )
      })}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon-xs"
            aria-label={t("clinic.recipient.add")}
            disabled={atMax}
            className="size-6 rounded-full"
          >
            <Plus aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <Command shouldFilter={true}>
            <CommandInput placeholder={t("clinic.recipient.search")} />
            <CommandList>
              <CommandEmpty>{t("clinic.search.noResults")}</CommandEmpty>
              {byRole.map(([role, people]) => (
                <CommandGroup key={role} heading={role}>
                  {people.map((p) => {
                    const isSel = selected.includes(p.id)
                    return (
                      <CommandItem
                        key={p.id}
                        value={`${p.name} ${p.role ?? ""}`}
                        disabled={atMax && !isSel}
                        onSelect={() => {
                          onChange(isSel ? selected.filter((s) => s !== p.id) : [...selected, p.id])
                        }}
                      >
                        <Check className={cn("size-3.5", isSel ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                        {p.name}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
