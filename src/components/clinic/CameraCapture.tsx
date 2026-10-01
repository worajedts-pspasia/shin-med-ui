import { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangle, Camera, CameraOff, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// CameraCapture — evidence photos taken INSIDE the app (nursing home WF-02
// D-080). The picture goes from the camera straight into the app: no file
// input, no phone camera app, no gallery pick — so photos never land in the
// device gallery and every photo was taken at the time of recording.
// Live mode uses getUserMedia; `simulated` draws a deterministic test card so
// stories and checks run without a camera.

export type CameraState = "idle" | "requesting" | "live" | "denied" | "unsupported"

export interface CapturedPhoto {
  id: string
  /** Object URL or data URL of the JPEG kept by the app (never the gallery). */
  src: string
  /** ISO timestamp of the shutter press. */
  takenAt: string
  blob?: Blob
}

export interface CameraCaptureProps {
  photos: CapturedPhoto[]
  onCapture(photo: CapturedPhoto): void
  onRemove?(id: string): void
  /** Default 3. The shutter is disabled once reached. */
  maxPhotos?: number
  /** Shows the "photo required" hint while no photo exists (e.g. abnormal finding). */
  required?: boolean
  /** Rear camera by default — the subject is the resident or the room, not the user. */
  facingMode?: "environment" | "user"
  /** No camera: a test card stands in for the video and capture is deterministic. */
  simulated?: boolean
  /** Controlled state override for stories (requesting, denied, unsupported…). */
  state?: CameraState
  /** Timestamp source; stories pass a fixed clock so fixtures stay deterministic. */
  clock?: () => string
  disabled?: boolean
  className?: string
}

const pad = (n: number) => String(n).padStart(2, "0")
const hhmm = (iso: string) => {
  const m = /T(\d{2}):(\d{2})/.exec(iso)
  return m ? `${m[1]}:${m[2]}` : iso
}

function testCard(n: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><rect width="320" height="240" fill="#e9e9e7"/><path d="M0 240 120 110l70 70 40-40 90 100z" fill="#c8c8c6"/><circle cx="250" cy="70" r="26" fill="#d4d4d2"/><text x="16" y="34" font-family="sans-serif" font-size="22" fill="#6a6a68">Photo ${pad(n)}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function CameraCapture({
  photos,
  onCapture,
  onRemove,
  maxPhotos = 3,
  required = false,
  facingMode = "environment",
  simulated = false,
  state: forced,
  clock = () => new Date().toISOString(),
  disabled = false,
  className,
}: CameraCaptureProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [own, setOwn] = useState<CameraState>("idle")
  const [announce, setAnnounce] = useState("")
  const state = forced ?? own
  const full = photos.length >= maxPhotos

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop())
    streamRef.current = null
  }, [])
  useEffect(() => stop, [stop])

  const open = async () => {
    if (simulated) { setOwn("live"); return }
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) { setOwn("unsupported"); return }
    setOwn("requesting")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false })
      streamRef.current = stream
      setOwn("live")
      requestAnimationFrame(() => {
        if (videoRef.current) { videoRef.current.srcObject = stream; void videoRef.current.play() }
      })
    } catch {
      setOwn("denied")
    }
  }

  const close = () => { stop(); setOwn("idle") }

  const shoot = () => {
    if (full || disabled) return
    const n = photos.length + 1
    const takenAt = clock()
    const id = `photo-${n}-${takenAt}`
    const done = (src: string, blob?: Blob) => {
      onCapture({ id, src, takenAt, blob })
      setAnnounce(t("clinic.camera.taken", { n }))
    }
    const v = videoRef.current
    if (simulated || !v || !v.videoWidth) { done(testCard(n)); return }
    const canvas = document.createElement("canvas")
    canvas.width = v.videoWidth
    canvas.height = v.videoHeight
    canvas.getContext("2d")?.drawImage(v, 0, 0)
    canvas.toBlob((blob) => { if (blob) done(URL.createObjectURL(blob), blob) }, "image/jpeg", 0.85)
  }

  const blocked = state === "denied" || state === "unsupported"

  return (
    <div data-slot="camera-capture" data-state={state} className={cn("space-y-2", className)}>
      <div
        role="group"
        aria-label={t("clinic.camera.viewfinder")}
        className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-md bg-things-ink-strong text-xs text-things-gray-3"
      >
        {state === "live" && !simulated && (
          <video ref={videoRef} playsInline muted className="absolute inset-0 size-full object-cover" aria-hidden="true" />
        )}
        {state === "live" && simulated && (
          <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(135deg,var(--color-things-ink)_0_14px,var(--color-things-ink-strong)_14px_28px)]" />
        )}
        {state === "idle" && (
          <Button type="button" variant="secondary" onClick={open} disabled={disabled || full} className="gap-1.5">
            <Camera className="size-4" aria-hidden="true" />
            {t("clinic.camera.open")}
          </Button>
        )}
        {state === "requesting" && <span className="px-4 text-center">{t("clinic.camera.requesting")}</span>}
        {blocked && (
          <span className="flex max-w-[28ch] flex-col items-center gap-1.5 px-4 text-center">
            <CameraOff className="size-6" aria-hidden="true" />
            <span className="text-sm text-background">{t(`clinic.camera.${state}`)}</span>
            <span>{t(`clinic.camera.${state}Hint`)}</span>
          </span>
        )}
        {state === "live" && (
          <>
            <span className="clinic-num absolute top-2 left-2 rounded-full bg-things-ink-strong/70 px-2 py-0.5 text-[11px] text-background">
              {t("clinic.camera.count", { n: photos.length, max: maxPhotos })}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={t("clinic.camera.close")}
              className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-things-ink-strong/70 text-background focus-visible:outline-2 focus-visible:outline-things-blue"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={shoot}
              disabled={full || disabled}
              aria-label={full ? t("clinic.camera.max") : t("clinic.camera.takePhoto")}
              className="absolute bottom-3 left-1/2 size-14 -translate-x-1/2 rounded-full border-4 border-background bg-background/30 transition-colors hover:bg-background/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-things-blue disabled:opacity-40"
            />
          </>
        )}
      </div>

      {photos.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={t("clinic.camera.photos")}>
          {photos.map((p, i) => (
            <li key={p.id} className="relative">
              <img src={p.src} alt={t("clinic.camera.photoN", { n: i + 1, time: hhmm(p.takenAt) })} className="size-16 rounded-sm border border-things-hairline object-cover" />
              <span className="clinic-num absolute bottom-0.5 left-0.5 rounded-sm bg-things-ink-strong/70 px-1 text-[10px] text-background">{hhmm(p.takenAt)}</span>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  aria-label={t("clinic.camera.remove", { n: i + 1 })}
                  className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full border border-things-hairline bg-card text-things-gray-2 hover:text-things-title"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {required && photos.length === 0 ? (
        <p className="flex items-center gap-1.5 text-xs text-clinic-warn">
          <AlertTriangle className="size-3.5" aria-hidden="true" />
          {t("clinic.camera.required")}
        </p>
      ) : (
        <p className="text-xs text-things-gray-3">{t("clinic.camera.noGallery")}</p>
      )}
      <span className="sr-only" aria-live="polite">{announce}</span>
    </div>
  )
}
