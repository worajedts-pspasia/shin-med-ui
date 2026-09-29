import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import th from "./th.json"
import ja from "./ja.json"

export const LOCALES = ["en", "th", "ja"] as const
export type Locale = (typeof LOCALES)[number]

/** BCP47 tag for Intl date formatting (th-TH gets the Buddhist calendar). */
export const intlTag = (locale: string) => (locale === "th" ? "th-TH" : locale === "ja" ? "ja-JP" : "en-US")

const stored = typeof localStorage !== "undefined" ? localStorage.getItem("things3-locale") : null
const initial = stored ?? (navigator.language.startsWith("th") ? "th" : navigator.language.startsWith("ja") ? "ja" : "en")

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, th: { translation: th }, ja: { translation: ja } },
  lng: initial,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

/** Switch language everywhere (i18next + localStorage). Called by the menu and
 * the bootstrap sync; persistence to the user record is done by the caller. */
export function setLocale(locale: Locale) {
  localStorage.setItem("things3-locale", locale)
  document.documentElement.lang = locale
  void i18n.changeLanguage(locale)
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  th: "ไทย",
  ja: "日本語",
}

/** Switch language everywhere now and persist it to the signed-in user. */
export async function changeLocale(locale: Locale) {
  setLocale(locale)
  const { api } = await import("@/api/client")
  await api.updateProfile({ locale }).catch(() => {})
}

export default i18n
