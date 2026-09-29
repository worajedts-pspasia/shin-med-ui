import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import type { NameParts } from "./types"

/** Locale-correct name rendering (04, Layer 2). Order comes from the active
 * locale, not the data: th → title given family · ja → family given ·
 * en list → Family, Given. Never accept a pre-joined string. */
export function PatientName({
  parts,
  format = "full",
  className,
}: {
  parts: NameParts
  format?: "full" | "list" | "short"
  className?: string
}) {
  const { i18n } = useTranslation()
  const lang = i18n.language

  let text: string
  if (lang === "th") {
    text = [parts.title, parts.given, parts.family].filter(Boolean).join(" ")
  } else if (lang === "ja") {
    text = format === "short" ? `${parts.family} ${parts.given}` : `${parts.family} ${parts.given}${parts.suffix ? ` ${parts.suffix}` : ""}`
  } else if (format === "list") {
    text = `${parts.family}, ${parts.given}${parts.middle ? ` ${parts.middle}` : ""}`
  } else if (format === "short") {
    text = `${parts.given} ${parts.family.charAt(0)}.`
  } else {
    text = [parts.given, parts.middle, parts.family, parts.suffix].filter(Boolean).join(" ")
  }

  return (
    <span className={cn("font-medium text-things-ink", className)} data-name-format={format}>
      {text}
    </span>
  )
}
