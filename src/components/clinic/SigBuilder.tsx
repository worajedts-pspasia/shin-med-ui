import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { NativeSelect } from "@/components/ui/native-select"

// SigBuilder — direction codes → a human sentence (04, Layer 6; 02.3:
// "1xApply2" → "ทา - - วันละ 2 ครั้ง@เช้า-เย็น"). Structured input assists,
// never locks: picking a code writes the sig from the table, but a hand-edited
// sig is respected (sigDirty). The rendered sig below is always visible AND
// editable — it is what the patient reads.

export function SigBuilder({
  directionCodes,
  value,
  onChange,
  locale,
  className,
}: {
  directionCodes: Array<{ code: string; sig: string }>
  value: string
  onChange(sig: string): void
  locale?: string
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const [dirty, setDirty] = useState(false)
  const lastGenerated = useRef<string | undefined>(undefined)

  useEffect(() => {
    // reset the dirty flag whenever the value matches a table-generated sig
    if (lastGenerated.current !== undefined && value !== lastGenerated.current) {
      setDirty(true)
    }
  }, [value])

  const pick = (code: string) => {
    const hit = directionCodes.find((c) => c.code === code)
    if (!hit) return
    lastGenerated.current = hit.sig
    setDirty(false)
    onChange(hit.sig)
  }

  void locale // sigs are generated per locale upstream; the builder renders what it is given

  return (
    <div data-slot="sig-builder" className={cn("flex flex-col gap-2", className)}>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-things-gray-3">{t("clinic.sig.direction")}</span>
        <NativeSelect
          aria-label={t("clinic.sig.direction")}
          defaultValue=""
          onChange={(e) => pick(e.target.value)}
          className="h-8 w-48 text-sm"
        >
          <option value="">{t("clinic.sig.pickCode")}</option>
          {directionCodes.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </NativeSelect>
      </label>
      <label className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-things-gray-3">
          {t("clinic.sig.preview")}
          {dirty && <span className="rounded-sm bg-things-gold/25 px-1 font-normal normal-case text-things-title">{t("clinic.sig.edited")}</span>}
        </span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          dir={i18n.language === "th" ? "ltr" : undefined}
          className="w-full rounded-md border border-things-box bg-transparent px-2 py-1.5 font-mono text-sm text-things-ink shadow-xs focus-visible:border-things-blue focus-visible:ring-2 focus-visible:ring-things-blue/30"
        />
      </label>
    </div>
  )
}
