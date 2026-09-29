import { Camera } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { PatientIdentity } from "./types"

// PatientIdentityCard — photo + demographics block (04, Layer 2; WinForms EMR
// "Patient Photograph", portal card, Thai VB6 product photo panel). `portrait`
// for the inspector rail, `row` for mobile / patient-facing screens.
// Initials fallback in Avatar; onChangePhoto overlays a capture affordance.

export type IdentityField = "dob" | "sex" | "phone" | "address" | "insurance" | "mrn"

export function PatientIdentityCard({
  patient,
  phone,
  address,
  insurance,
  fields = ["dob", "sex", "mrn"],
  onChangePhoto,
  orientation = "portrait",
  className,
}: {
  patient: PatientIdentity
  phone?: string
  address?: string
  insurance?: string
  fields?: IdentityField[]
  onChangePhoto?(): void
  orientation?: "portrait" | "row"
  className?: string
}) {
  const { t, i18n } = useTranslation()

  const dob = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(patient.dob))

  const allRows: Array<{ key: IdentityField; label: string; value?: React.ReactNode }> = [
    { key: "dob", label: t("clinic.patient.dob"), value: <span className="clinic-num">{dob}</span> },
    { key: "sex", label: t("clinic.patient.sex"), value: t(`clinic.patient.sexLabel.${patient.sex}`) },
    { key: "phone", label: t("clinic.patient.phone"), value: phone ? <span className="clinic-num">{phone}</span> : undefined },
    { key: "address", label: t("clinic.identity.address"), value: address },
    { key: "insurance", label: t("clinic.identity.insurance"), value: insurance },
    { key: "mrn", label: t("clinic.patient.mrn"), value: <span className="font-mono">{patient.mrn}</span> },
  ]
  const rows = allRows.filter((r) => r.value !== undefined)

  const visible = rows.filter((r) => fields.includes(r.key))

  const initials = `${patient.name.given[0] ?? ""}${patient.name.family[0] ?? ""}`.toUpperCase()
  const photo = (
    <div className="relative shrink-0">
      <Avatar className={cn(orientation === "portrait" ? "size-20" : "size-12")}>
        {patient.photoUrl ? <AvatarImage src={patient.photoUrl} alt="" /> : null}
        <AvatarFallback className="bg-things-chip text-sm font-semibold text-things-gray-2">{initials}</AvatarFallback>
      </Avatar>
      {onChangePhoto && (
        <Button
          variant="outline"
          size="icon-xs"
          aria-label={t("clinic.identity.changePhoto")}
          className="absolute -bottom-1 -right-1 size-6 rounded-full"
          onClick={onChangePhoto}
        >
          <Camera aria-hidden="true" />
        </Button>
      )}
    </div>
  )

  const name = patient.name
  const lang = i18n.language
  const displayName =
    lang === "th"
      ? [name.title, name.given, name.family].filter(Boolean).join(" ")
      : lang === "ja"
        ? [name.family, name.given].filter(Boolean).join(" ")
        : [name.given, name.middle, name.family].filter(Boolean).join(" ")

  return (
    <div
      data-slot="patient-identity-card"
      data-orientation={orientation}
      className={cn(
        "flex gap-3 rounded-md border border-things-hairline bg-card p-3",
        orientation === "portrait" ? "flex-col items-center text-center" : "items-center",
        className,
      )}
    >
      {photo}
      <div className={cn("min-w-0 flex-1", orientation === "portrait" && "w-full")}>
        <p className="truncate text-sm font-semibold text-things-title">{displayName}</p>
        <dl className={cn("mt-1.5", orientation === "portrait" ? "flex flex-col gap-0.5" : "flex flex-wrap gap-x-4 gap-y-0.5")}>
          {visible.map((r) => (
            <div key={r.key} className={cn("flex min-w-0 gap-1.5 text-xs", orientation === "portrait" ? "justify-center" : "items-baseline")}>
              <dt className="shrink-0 text-things-gray-3">{r.label}</dt>
              <dd className="min-w-0 truncate text-things-gray-2">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
