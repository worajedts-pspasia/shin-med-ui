// Category colour map + tone helpers (docs/spec/03 §2 + §6).
//
// Conventions every clinic component follows (consistency audit 2026-09):
// - Surfaces: bg-card (never bg-white — card is the dark-mode-safe token);
//   app canvas / translucent bars may use bg-background.
// - Radii: rounded-md containers · rounded-sm rows/buttons · rounded-full
//   pills/badges · rounded-[2px] colour swatches (size-2.5).
// - Type ramp: text-[10px] axis/micro · text-[11px] count badges · text-xs
//   meta · text-sm body · text-base emphasis · text-[13px] paper documents
//   only (with clinic-paper-ink) · clinic-num for every numeral.
// - Icons: size-3.5 inline · size-4 buttons/rows · size-6 feature.
// Severity colours mean severity and nothing else; flow/category colours mean
// flow and category. An appointment type or timeline lane must never borrow
// clinic-critical.

import type { Tone, Urgency, VisitStatus } from "./types"

/** Timeline lanes / event chips / chart series — the category palette.
 *  `soft` (pill fill) and `bar` (3px left bar) are spelled out statically —
 *  Tailwind's JIT cannot see template-built opacity variants. */
const SOFT = {
  notes: "bg-things-glyph-blue/15", orders: "bg-things-teal/15", labs: "bg-things-teal/15",
  communications: "bg-things-purple/15", documents: "bg-things-orange/15", vitals: "bg-things-green/15",
  medications: "bg-things-blue/15", appointments: "bg-things-gold/25", problems: "bg-things-pink/15",
  immunizations: "bg-things-tan/20", alerts: "bg-things-cal/15",
} as const
const BAR = {
  notes: "border-things-glyph-blue", orders: "border-things-teal", labs: "border-things-teal",
  communications: "border-things-purple", documents: "border-things-orange", vitals: "border-things-green",
  medications: "border-things-blue", appointments: "border-things-gold", problems: "border-things-pink",
  immunizations: "border-things-tan", alerts: "border-things-cal",
} as const

export const CATEGORY_COLORS = {
  notes: { soft: SOFT.notes, bar: BAR.notes, dot: "bg-things-glyph-blue", text: "text-things-glyph-blue", var: "var(--color-things-glyph-blue)" },
  orders: { soft: SOFT.orders, bar: BAR.orders, dot: "bg-things-teal", text: "text-things-teal", var: "var(--color-things-teal)" },
  labs: { soft: SOFT.labs, bar: BAR.labs, dot: "bg-things-teal", text: "text-things-teal", var: "var(--color-things-teal)" },
  communications: { soft: SOFT.communications, bar: BAR.communications, dot: "bg-things-purple", text: "text-things-purple", var: "var(--color-things-purple)" },
  documents: { soft: SOFT.documents, bar: BAR.documents, dot: "bg-things-orange", text: "text-things-orange", var: "var(--color-things-orange)" },
  vitals: { soft: SOFT.vitals, bar: BAR.vitals, dot: "bg-things-green", text: "text-things-green", var: "var(--color-things-green)" },
  medications: { soft: SOFT.medications, bar: BAR.medications, dot: "bg-things-blue", text: "text-things-blue", var: "var(--color-things-blue)" },
  appointments: { soft: SOFT.appointments, bar: BAR.appointments, dot: "bg-things-gold", text: "text-things-gold", var: "var(--color-things-gold)" },
  problems: { soft: SOFT.problems, bar: BAR.problems, dot: "bg-things-pink", text: "text-things-pink", var: "var(--color-things-pink)" },
  immunizations: { soft: SOFT.immunizations, bar: BAR.immunizations, dot: "bg-things-tan", text: "text-things-tan", var: "var(--color-things-tan)" },
  alerts: { soft: SOFT.alerts, bar: BAR.alerts, dot: "bg-things-cal", text: "text-things-cal", var: "var(--color-things-cal)" },
} as const

export type CategoryId = keyof typeof CATEGORY_COLORS

/** Tone → severity utilities (text / soft fill / hard fill / left accent). */
export const toneText: Record<Tone, string> = {
  none: "text-things-ink",
  ok: "text-clinic-ok",
  warn: "text-clinic-warn",
  critical: "text-clinic-critical",
}

export const toneSoft: Record<Tone, string> = {
  none: "",
  ok: "bg-clinic-ok-soft",
  warn: "bg-clinic-warn-soft",
  critical: "bg-clinic-critical-soft",
}

export const toneFill: Record<Tone, string> = {
  none: "bg-things-gray-3",
  ok: "bg-clinic-ok",
  warn: "bg-clinic-warn",
  critical: "bg-clinic-critical",
}

export const toneLeftAccent: Record<Tone, string> = {
  none: "",
  ok: "border-l-2 border-clinic-ok",
  warn: "border-l-2 border-clinic-warn",
  critical: "border-l-2 border-clinic-critical",
}

/** Visit-status dot colours — flow tones, deliberately not severity. */
export const statusColor: Record<VisitStatus, string> = {
  arrived: "bg-things-green",
  accepted: "bg-things-gold",
  "in-room": "bg-things-blue",
  done: "bg-things-green",
  held: "bg-things-gray-3",
  cancelled: "bg-things-badge",
  pending: "bg-things-gray",
  info: "bg-things-blue",
}

/** Urgency (triage) colours — severity scale. */
export const urgencyColor: Record<Urgency, string> = {
  routine: "clinic-ok",
  rush: "clinic-warn",
  urgent: "clinic-critical",
}

/** Appointment type → category colour vars (03 §2): type owns colour on the
 *  schedule grid; status stays a glyph so the two never compete. */
export const APPT_TYPE_COLOR: Record<string, string> = {
  "Follow-up": "var(--color-things-gold)",
  "New patient": "var(--color-things-blue)",
  "Walk-in": "var(--color-things-purple)",
  "Lab review": "var(--color-things-teal)",
  "Physical exam": "var(--color-things-green)",
}
