import { Check, Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// CodePickerAccordion — browse codes by group (04, Layer 6), the superbill's
// daily complement to CodedSearchInput type-ahead. Selected codes carry ✓ and
// a things-blue-soft row; a Lookup row closes each group.

export interface CodeGroup {
  id: string
  label: string
  codes: { code: string; label: string; selected?: boolean }[]
}

export function CodePickerAccordion({
  groups,
  value,
  onToggle,
  multiple = true,
  onLookup,
  className,
}: {
  groups: CodeGroup[]
  /** Controlled selection (code strings); without it each code's `selected` seed applies. */
  value?: string[]
  onToggle: (code: string) => void
  /** false = radio within a group: picking a code clears its siblings. */
  multiple?: boolean
  onLookup?: (groupId: string, query: string) => void
  className?: string
}) {
  const { t } = useTranslation()
  const selected = (code: string, seed?: boolean) => (value ? value.includes(code) : Boolean(seed))

  return (
    <div
      data-slot="code-picker-accordion"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <Accordion type="multiple" className="w-full">
        {groups.map((g) => {
          const picked = g.codes.filter((c) => selected(c.code, c.selected)).length
          return (
            <AccordionItem key={g.id} value={g.id} className="border-b border-things-hairline last:border-b-0">
              <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
                <span className="flex items-center gap-2">
                  {g.label}
                  {picked > 0 && (
                    <span className="clinic-num rounded-full bg-things-blue-soft px-1.5 text-[11px] leading-4 text-things-blue">
                      {picked}
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <ul>
                  {g.codes.map((c) => {
                    const on = selected(c.code, c.selected)
                    return (
                      <li key={c.code}>
                        <button
                          type="button"
                          data-code={c.code}
                          aria-pressed={on}
                          onClick={() => {
                            if (!multiple && !on) {
                              // radio: clear siblings, then pick
                              g.codes.forEach((sib) => {
                                if (sib.code !== c.code && selected(sib.code, sib.selected)) onToggle(sib.code)
                              })
                            }
                            onToggle(c.code)
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                            on
                              ? "bg-things-blue-soft text-things-blue"
                              : "text-things-title hover:bg-things-hover",
                          )}
                        >
                          <Check
                            className={cn("size-3.5 shrink-0", on ? "opacity-100" : "opacity-0")}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1 truncate">{c.label}</span>
                          <span className="clinic-num shrink-0 text-xs text-things-gray-2">{c.code}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <div className="flex items-center gap-2 border-t border-things-hairline px-3 py-1.5">
                  <Search className="size-3.5 shrink-0 text-things-gray-3" aria-hidden="true" />
                  <Input
                    placeholder={t("clinic.codepicker.lookup")}
                    aria-label={t("clinic.codepicker.lookup")}
                    className="h-7 border-0 px-0 text-xs shadow-none focus-visible:ring-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onLookup?.(g.id, e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
