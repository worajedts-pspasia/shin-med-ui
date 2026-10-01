import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CameraCapture, type CameraState, type CapturedPhoto } from "./CameraCapture"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof CameraCapture> = {
  title: "Medical/Medical Component/Camera Capture",
  tags: ["autodocs"],
  component: CameraCapture,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("CameraCapture") } },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

// Deterministic clock: fixtures never read the real time (06 §1).
const TIMES = ["2026-10-05T10:41:00+07:00", "2026-10-05T10:42:00+07:00", "2026-10-05T10:43:00+07:00", "2026-10-05T10:44:00+07:00"]
const card = (n: number, color: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect width="160" height="120" fill="${color}"/><text x="40" y="66" font-family="sans-serif" font-size="13" fill="#6a6a68">Photo 0${n}</text></svg>`)}`
const FIXTURE: CapturedPhoto[] = [
  { id: "p1", src: card(1, "#e9e9e7"), takenAt: TIMES[0] },
  { id: "p2", src: card(2, "#dcdcd9"), takenAt: TIMES[1] },
]

function Demo({ initial = [], ...props }: { initial?: CapturedPhoto[] } & Partial<React.ComponentProps<typeof CameraCapture>>) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>(initial)
  let tick = photos.length
  return (
    <div className="max-w-sm rounded-md border border-things-hairline bg-card p-3">
      <CameraCapture
        simulated
        clock={() => TIMES[Math.min(tick++, TIMES.length - 1)]}
        {...props}
        photos={photos}
        onCapture={(p) => setPhotos((xs) => [...xs, p])}
        onRemove={(id) => setPhotos((xs) => xs.filter((x) => x.id !== id))}
      />
    </div>
  )
}

/** Simulated camera: press Open camera, then the shutter. No camera or permission needed. */
export const Default: Story = {
  render: () => <Demo />,
}

export const Playground: Story = {
  argTypes: {
    maxPhotos: { control: { type: "number", min: 1, max: 6 } },
    required: { control: "boolean" },
    state: { control: "select", options: ["idle", "requesting", "live", "denied", "unsupported"] },
  },
  args: { maxPhotos: 3, required: false, state: "live" } as Record<string, unknown>,
  render: (args: any) => <Demo key={`${args.state}-${args.maxPhotos}`} initial={FIXTURE} maxPhotos={args.maxPhotos} required={args.required} state={args.state as CameraState} />,
}

const STATES: CameraState[] = ["idle", "requesting", "live", "denied", "unsupported"]

/** Every state side by side, plus a full set of photos and the required hint. */
export const AllStates: Story = {
  render: () => (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
      {STATES.map((s) => (
        <div key={s} className="space-y-1">
          <p className="text-xs text-things-gray-2">{s}</p>
          <Demo state={s} initial={s === "live" ? FIXTURE : []} />
        </div>
      ))}
      <div className="space-y-1">
        <p className="text-xs text-things-gray-2">live · limit reached</p>
        <Demo state="live" maxPhotos={2} initial={FIXTURE} />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-things-gray-2">required · no photo yet</p>
        <Demo required />
      </div>
    </div>
  ),
}

export const Empty: Story = {
  render: () => <Demo />,
}

/** Static: the browser is asking the user for camera permission. */
export const Loading: Story = {
  render: () => <Demo state="requesting" />,
}

/** An abnormal finding needs a photo (WF-02 D-069): the hint stays until one is taken. */
export const Required: Story = {
  render: () => <Demo required />,
}

export const Denied: Story = {
  render: () => <Demo state="denied" />,
}

export const Unsupported: Story = {
  render: () => <Demo state="unsupported" />,
}

/** The real camera (getUserMedia). The browser asks for permission; on a desktop without a camera it shows the unsupported or denied state. */
export const LiveCamera: Story = {
  render: () => <Demo simulated={false} />,
}

/** Phone portrait, the recording screen's width (WF-02 D-081). */
export const Mobile: Story = {
  render: () => (
    <div className="max-w-[390px]">
      <Demo state="live" initial={FIXTURE} required />
    </div>
  ),
}

export const Dense: Story = {
  render: () => (
    <AtDensity density="dense">
      <Demo state="live" initial={FIXTURE} />
    </AtDensity>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        <Demo state="live" initial={FIXTURE} />
        <Demo state="denied" />
        <Demo required />
      </div>
    </ForcedLocale>
  ),
}

export const Japanese: Story = {
  render: () => (
    <ForcedLocale locale="ja">
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        <Demo state="live" initial={FIXTURE} />
        <Demo state="denied" />
        <Demo required />
      </div>
    </ForcedLocale>
  ),
}
