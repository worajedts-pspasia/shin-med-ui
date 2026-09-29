import { useEffect } from "react"
import i18n, { setLocale, type Locale } from "@/i18n"

/** Forces a locale for one story and restores the previous one on unmount. */
export function ForcedLocale({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  useEffect(() => {
    const prev = i18n.language
    setLocale(locale)
    return () => void setLocale((prev as Locale) ?? "en")
  }, [locale])
  return <div lang={locale}>{children}</div>
}

/** Wraps a story at a clinic density (06 §1: every wrapper carries one). */
export function AtDensity({ density, children }: { density: "comfortable" | "compact" | "dense"; children: React.ReactNode }) {
  return <div data-density={density} className="font-sans">{children}</div>
}

/** Proves severity carries a non-colour channel (06 §1 story matrix). */
export function Monochrome({ children }: { children: React.ReactNode }) {
  return <div style={{ filter: "grayscale(1)" }}>{children}</div>
}
