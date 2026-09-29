import i18n from "@/i18n"

/** Non-hook accessor for translated strings inside plain helper functions. */
export function tt(key: string, vars?: Record<string, unknown>): string {
  return i18n.t(key, vars) as string
}

// `useTranslationSafe` exists only for fmtDate back-compat; helpers should use tt().
export function useTranslationSafe() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return { t: i18n.t.bind(i18n), i18n }
}
