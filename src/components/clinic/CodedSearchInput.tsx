import { useEffect, useRef, useState } from "react"
import { History, Search, Star, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { CodedConcept } from "./types"

// CodedSearchInput — type-ahead that returns a coded concept (04, Layer 7;
// pattern #4 in all three source products). Rows render code (mono) +
// preferred term (link blue) + local term (muted, "Cholesterol /
// ไขมันในเลือด"). Favourites and recents sit above search results — that is
// what clinicians use 90% of the time. The code read-back renders beside the
// input on selection and wraps to a second line below md. allowFreeText
// defaults false: coded systems stay coded.

// Clinical abbreviations are identical in every locale (02 §6.4).
const SYSTEM_LABEL: Record<string, string> = {
  icd10: "ICD-10",
  icd9: "ICD-9",
  snomed: "SNOMED CT",
  drug: "Rx",
  lab: "LOINC",
  cpt: "CPT",
}

export interface CodedSearchInputProps<T extends CodedConcept> {
  system: "icd10" | "icd9" | "snomed" | "drug" | "lab" | "cpt" | (string & {})
  value?: T
  onSelect: (concept: T) => void
  search: (q: string) => Promise<T[]>
  allowFreeText?: boolean
  favorites?: T[]
  recents?: T[]
  placeholder?: string
  disabled?: boolean
  /** Renders the clear affordance when provided. */
  onClear?: () => void
  className?: string
}

export function CodedSearchInput<T extends CodedConcept>({
  system, value, onSelect, search, allowFreeText = false, favorites, recents,
  placeholder, disabled, onClear, className,
}: CodedSearchInputProps<T>) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const reqRef = useRef(0)
  // stable ref — callers may pass an inline lambda; it must not retrigger the effect
  const searchRef = useRef(search)
  searchRef.current = search
  const systemLabel = SYSTEM_LABEL[system] ?? String(system).toUpperCase()

  // debounced async search with stale-response cancellation
  useEffect(() => {
    if (!open) return
    const q = query.trim()
    const req = ++reqRef.current
    if (q === "") {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      searchRef.current(q)
        .then((r) => {
          if (reqRef.current === req) {
            setResults(r)
            setLoading(false)
          }
        })
        .catch(() => {
          if (reqRef.current === req) setLoading(false)
        })
    }, 150)
    return () => clearTimeout(timer)
  }, [query, open])

  const pick = (concept: T) => {
    onSelect(concept)
    setOpen(false)
    setQuery("")
  }

  const hasEmptyResults = !loading && query.trim() !== "" && results.length === 0

  const renderItem = (c: T, icon?: React.ReactNode) => (
    <CommandItem key={c.code + c.term} value={`${c.code} ${c.term} ${c.localTerm ?? ""}`} onSelect={() => pick(c)}>
      {icon}
      {c.code !== "" && <span className="font-mono text-xs text-things-gray-2">{c.code}</span>}
      <span className="text-things-blue">{c.term}</span>
      {c.localTerm && <span className="text-xs text-things-gray-3">{c.localTerm}</span>}
    </CommandItem>
  )

  return (
    <div data-coded-search data-system={system} className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery("") }}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("h-9 w-full justify-between gap-2 font-normal font-sans")}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 rounded-sm border border-things-hairline bg-card px-1 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-things-gray-2">
                {systemLabel}
              </span>
              {value ? (
                <>
                  {value.code !== "" && <span className="font-mono text-xs text-things-gray-2">{value.code}</span>}
                  <span className="truncate text-things-title">{value.term}</span>
                </>
              ) : (
                <span className="truncate text-things-gray-3">{placeholder ?? t("clinic.search.placeholder")}</span>
              )}
            </span>
            <Search className="size-3.5 shrink-0 text-things-gray-3" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput value={query} onValueChange={setQuery} placeholder={placeholder ?? t("clinic.search.placeholder")} />
            <CommandList>
              {loading && (
                <p className="px-3 py-2 text-sm text-things-gray-3">{t("clinic.search.searching")}</p>
              )}
              {!loading && favorites && favorites.length > 0 && (
                <CommandGroup heading={t("clinic.search.favorites")}>
                  {favorites.map((c) => renderItem(c, <Star className="size-3 shrink-0 text-things-gold" aria-hidden="true" />))}
                </CommandGroup>
              )}
              {!loading && recents && recents.length > 0 && (
                <CommandGroup heading={t("clinic.search.recents")}>
                  {recents.map((c) => renderItem(c, <History className="size-3 shrink-0 text-things-gray-3" aria-hidden="true" />))}
                </CommandGroup>
              )}
              {!loading && results.length > 0 && (
                <CommandGroup heading={t("clinic.search.results")}>
                  {results.map((c) => renderItem(c))}
                </CommandGroup>
              )}
              {hasEmptyResults && allowFreeText && query.trim() !== "" && (
                <CommandGroup>
                  <CommandItem value={`freetext-${query}`} onSelect={() => pick({ code: "", term: query.trim() } as T)}>
                    <span className="text-xs text-things-gray-3">{t("clinic.search.useFreeText")}:</span>
                    <span className="text-things-title">{query.trim()}</span>
                  </CommandItem>
                </CommandGroup>
              )}
              {hasEmptyResults && !allowFreeText && <CommandEmpty>{t("clinic.search.noResults")}</CommandEmpty>}
              {!loading && query.trim() === "" && !favorites?.length && !recents?.length && (
                <CommandEmpty>{t("clinic.search.typeToSearch")}</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* code read-back — wraps to its own line below md */}
      {value && (
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs md:flex-nowrap">
          {value.code !== "" && <span className="font-mono text-things-gray-2">{value.code}</span>}
          <span className="text-things-blue">{value.term}</span>
          {value.localTerm && <span className="text-things-gray-3">{value.localTerm}</span>}
          {onClear && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={t("clinic.search.clear")}
              className="size-4 self-center"
              onClick={onClear}
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
