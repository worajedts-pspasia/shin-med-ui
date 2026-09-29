import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { PatientName } from "./PatientName"
import type { PatientIdentity } from "./types"

// PatientSearchCombobox — code-or-name lookup (04, Layer 2; 01.1 CN/ชื่อ/สกุล).
// Accepts MRN/CN, partial name, phone or national ID — disambiguated by input
// shape. Results ALWAYS show name + DOB + MRN, never name alone: duplicate
// names are the classic wrong-patient vector. Debounced, keyboard-first,
// Enter selects a single exact match.

export function PatientSearchCombobox({
  onSelect,
  search,
  scope = "all",
  minChars = 2,
  placeholder,
  className,
}: {
  onSelect(patient: PatientIdentity): void
  search(q: string, scope: "all" | "today" | "mine"): Promise<PatientIdentity[]>
  scope?: "all" | "today" | "mine"
  minChars?: number
  placeholder?: string
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PatientIdentity[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const reqRef = useRef(0)
  const searchRef = useRef(search)
  searchRef.current = search

  const dob = (iso: string) => new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso))

  useEffect(() => {
    const q = query.trim()
    const req = ++reqRef.current
    if (q.length < minChars) {
      setResults([])
      setLoading(false)
      setOpen(false)
      return
    }
    setLoading(true)
    setOpen(true)
    const timer = setTimeout(() => {
      searchRef.current(q, scope)
        .then((r) => {
          if (reqRef.current === req) {
            setResults(r)
            setLoading(false)
          }
        })
        .catch(() => {
          if (reqRef.current === req) setLoading(false)
        })
    }, 200)
    return () => clearTimeout(timer)
  }, [query, scope, minChars])

  const exact = useMemo(
    () =>
      results.length === 1 &&
      (results[0].mrn === query.trim() ||
        `${results[0].name.given} ${results[0].name.family}`.toLowerCase() === query.trim().toLowerCase()),
    [results, query],
  )

  const pick = (p: PatientIdentity) => {
    onSelect(p)
    setOpen(false)
    setQuery("")
  }

  return (
    <div data-slot="patient-search" className={cn("flex w-full flex-col gap-1", className)}>
      <Command shouldFilter={false} className="rounded-md border border-things-box bg-card shadow-xs">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={placeholder ?? t("clinic.psearch.placeholder")}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" && exact) {
              e.preventDefault()
              pick(results[0])
            }
          }}
          className="text-sm"
        />
      </Command>
      <Popover open={open && (loading || results.length > 0 || query.trim().length >= minChars)} onOpenChange={setOpen}>
        <PopoverAnchor aria-hidden="true" className="absolute" />
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-72 p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
          <Command shouldFilter={false}>
            <CommandList>
              {loading && <p className="px-3 py-2 text-sm text-things-gray-3">{t("clinic.search.searching")}</p>}
              {!loading && results.length === 0 && query.trim().length >= minChars && (
                <CommandEmpty>{t("clinic.search.noResults")}</CommandEmpty>
              )}
              {!loading && results.length > 0 && (
                <CommandGroup heading={t("clinic.psearch.results")}>
                  {results.map((p) => (
                    <CommandItem key={p.id} value={`${p.mrn} ${p.name.given} ${p.name.family}`} onSelect={() => pick(p)}>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <PatientName parts={p.name} className="truncate text-sm text-things-title" />
                        {/* never name alone — DOB + MRN disambiguate duplicates */}
                        <span className="clinic-num flex gap-2 text-[11px] text-things-gray-3">
                          <span>{t("clinic.patient.dob")} {dob(p.dob)}</span>
                          <span>{t("clinic.patient.mrn")} {p.mrn}</span>
                        </span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
