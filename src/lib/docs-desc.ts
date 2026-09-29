import i18n from "@/i18n"
import en from "@/i18n/docs/en.json"
import th from "@/i18n/docs/th.json"
import ja from "@/i18n/docs/ja.json"

const docs: Record<string, Record<string, string>> = { en, th, ja }

export const docsDesc = (id: string): string =>
  (docs[i18n.language] ?? docs.en)[id] ?? docs.en[id] ?? ""
