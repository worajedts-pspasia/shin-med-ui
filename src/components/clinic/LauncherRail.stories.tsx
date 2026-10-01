import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { LauncherRail } from "./LauncherRail"
import {
  fixtureClinicSections,
  fixtureLauncherApps,
  fixtureLauncherGroups,
  fixtureLauncherModuleGroups,
  fixtureLauncherModules,
  fixtureLauncherPinned,
} from "@/fixtures/clinic"
import { ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof LauncherRail> = {
  title: "Medical/Medical Shell/Launcher Rail",
  tags: ["autodocs"],
  component: LauncherRail,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("LauncherRail"),
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
  parameters: { docs: { description: { story: docsDesc("LauncherRail::AllPinned") } } },
  render: () => <Demo initialActive="settings" pinned={fixtureLauncherApps.map((a) => a.id)} />,
}

export const Thai: Story = {
  parameters: { docs: { description: { story: docsDesc("LauncherRail::Thai") } } },
  render: () => (
    <ForcedLocale locale="th">
      <Demo />
    </ForcedLocale>
  ),
}

function SectionsDemo() {
  const [module, setModule] = useState("clinic")
  const [section, setSection] = useState("chart")
  const mod = fixtureLauncherModules.find((m) => m.id === module)
  return (
    <div className="flex h-[560px] overflow-hidden rounded-md border border-things-hairline bg-card text-left">
      <LauncherRail
        mode="sections"
        modules={fixtureLauncherModules}
        groups={fixtureLauncherModuleGroups}
        activeModuleId={module}
        onModuleSelect={setModule}
        sections={module === "clinic" ? fixtureClinicSections : []}
        activeSectionId={section}
        onSectionSelect={setSection}
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <p className="text-sm text-things-gray-3">Module / section</p>
        <p className="text-lg font-semibold text-things-title">
          {mod?.label ?? "—"} / {fixtureClinicSections.find((x) => x.id === section)?.label ?? "—"}
        </p>
        <p className="mt-4 max-w-sm text-center text-xs text-things-gray-3">
          The waffle lists the program's modules (Billing and Settings are coming later). The rail
          shows the active module's sections; picking a module switches its sections.
        </p>
      </div>
    </div>
  )
}

export const SectionsMode: Story = {
  parameters: { docs: { description: { story: "Clinic-program mode (issue #1): waffle = top-level modules (two disabled), rail = the Clinic module's 10 sections." } } },
  render: () => <SectionsDemo />,
}

export const Japanese: Story = {
  parameters: { docs: { description: { story: "Flyout chrome strings localize to Japanese." } } },
  render: () => (
    <ForcedLocale locale="ja">
      <Demo />
    </ForcedLocale>
  ),
}
