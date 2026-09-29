import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { LauncherRail } from "./LauncherRail"
import {
  fixtureLauncherApps,
  fixtureLauncherGroups,
  fixtureLauncherPinned,
} from "@/fixtures/clinic"
import { ForcedLocale } from "./story-utils"

const meta: Meta<typeof LauncherRail> = {
  title: "Medical/Medical Shell/Launcher Rail",
  tags: ["autodocs"],
  component: LauncherRail,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The MS-cloud side-toolbar pattern in clinic dress: a 9-dot waffle pinned top-left opens a grouped, searchable app launcher; pinning a tile adds it to the rail as a Tooltip shortcut. Rail styling matches ModuleRail collapsed \u2014 same width, same short active bar.\n\n**Watch out:** the rail shows *user-pinned* shortcuts; it is not the module list (that's ModuleRail). Tile tints come from the category palette \u2014 severity colors never appear on navigation.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ initialActive = "chart", pinned = fixtureLauncherPinned }: { initialActive?: string; pinned?: string[] }) {
  const [active, setActive] = useState(initialActive)
  const app = fixtureLauncherApps.find((a) => a.id === active)
  return (
    <div className="flex h-[560px] overflow-hidden rounded-md border border-things-hairline bg-white text-left">
      <LauncherRail
        apps={fixtureLauncherApps}
        groups={fixtureLauncherGroups}
        defaultPinnedIds={pinned}
        activeId={active}
        onSelect={setActive}
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <p className="text-sm text-things-gray-3">Active module</p>
        <p className="text-lg font-semibold text-things-title">{app?.label ?? "—"}</p>
        <p className="mt-4 max-w-sm text-center text-xs text-things-gray-3">
          Open the waffle (top-left) to browse all apps by group, search, and pin or unpin
          shortcuts. Pinned icons appear on the rail in pin order.
        </p>
      </div>
    </div>
  )
}

export const Playground: Story = {
  argTypes: {
    activeId: { control: "select", options: fixtureLauncherApps.map((a) => a.id) },
    defaultPinnedIds: { control: "check", options: fixtureLauncherApps.map((a) => a.id) },
  },
  args: {
    activeId: "chart",
    defaultPinnedIds: [...fixtureLauncherPinned],
  } as Record<string, unknown>,
  render: (args) => {
    const active = (args.activeId as string) ?? "chart"
    const pinned = (args.defaultPinnedIds as string[]) ?? fixtureLauncherPinned
    return <Demo key={`${active}-${pinned.join(",")}`} initialActive={active} pinned={pinned} />
  },
}

export const AllPinned: Story = {
  name: "All Pinned",
  parameters: { docs: { description: { story: "Every module pinned — the rail scrolls instead of growing." } } },
  render: () => <Demo initialActive="settings" pinned={fixtureLauncherApps.map((a) => a.id)} />,
}

export const Thai: Story = {
  parameters: { docs: { description: { story: "Flyout chrome strings (search, pin labels, empty state) localize." } } },
  render: () => (
    <ForcedLocale locale="th">
      <Demo />
    </ForcedLocale>
  ),
}
