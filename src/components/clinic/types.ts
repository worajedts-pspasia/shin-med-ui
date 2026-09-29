// Shared clinic types (docs/spec/04 + 00-corrections §1).
// Two orthogonal axes — keep them apart:
//   Urgency    — ordered clinical severity (ปกติ/รีบ/ด่วน), drives TriageDot
//   VisitStatus — workflow position (มาปกติ, …), drives StatusDot

export type Tone = "none" | "ok" | "warn" | "critical"
export type Density = "comfortable" | "compact" | "dense"

/** Queue urgency — ปกติ · รีบ · ด่วน (verified 4×, 00-corrections §1). */
export type Urgency = "routine" | "rush" | "urgent"

/** Visit / processing status — the สถานะ axis. */
export type VisitStatus = "arrived" | "accepted" | "in-room" | "done" | "held" | "cancelled" | "pending" | "info"

export interface NameParts {
  title?: string
  given: string
  middle?: string
  family: string
  suffix?: string
}

export type LabFlag = "N" | "H" | "L" | "HH" | "LL" | "A"

export interface PatientIdentity {
  id: string
  mrn: string
  name: NameParts
  dob: string // ISO date
  sex: "male" | "female" | "other" | "unknown"
  photoUrl?: string
}

export interface AllergyRecord {
  allergen: string
  reaction?: string
  severity?: "mild" | "moderate" | "severe"
  recordedAt?: string
}

/** A coded clinical concept — the unit CodedSearchInput returns (04, Layer 7). */
export interface CodedConcept {
  code: string
  /** Preferred term in the reference language. */
  term: string
  /** Local (Thai) term rendered muted beside the preferred term. */
  localTerm?: string
}
