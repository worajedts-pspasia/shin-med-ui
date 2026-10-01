import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CurrentDesignApp } from "./CurrentDesign"
import { ProposedDesignApp } from "./ProposedDesign"
import { ScenarioProvider, type Page } from "./scenario"

// Design study (branch feature/design-study-three-themes) — one clinic
// scenario, three design languages. Registry (database) → Visit (form) →
// Orders (form + data), linked by the LauncherRail sections, the step nav,
// row open and the primary actions. See src/design-study/README.md.
//
// Not a catalog entry: no autodocs (each variant themes <html>, so several
// on one Docs page would fight), and nothing here is imported by components.

const meta: Meta = {
  title: "Design Study/Clinic Visit Scenario",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "desktop1280" } },
  argTypes: {
    page: { control: "inline-radio", options: ["registry", "visit", "orders"] },
  },
  args: { page: "registry" },
}
export default meta
type Story = StoryObj<{ page: Page }>

export const A_CurrentDesign: Story = {
  name: "A · Current design",
  render: ({ page }) => (
    <ScenarioProvider key={page} initialPage={page}>
      <CurrentDesignApp />
    </ScenarioProvider>
  ),
}

export const B_MacOS27: Story = {
  name: "B · macOS 27",
  render: ({ page }) => (
    <ScenarioProvider key={page} initialPage={page}>
      <ProposedDesignApp lang="mac27" />
    </ScenarioProvider>
  ),
}

export const B_MacOS27Dark: Story = {
  name: "B · macOS 27 (dark, clear glass)",
  render: ({ page }) => (
    <ScenarioProvider key={page} initialPage={page}>
      <ProposedDesignApp lang="mac27" initialMode="dark" initialGlass="clear" />
    </ScenarioProvider>
  ),
}

export const C_Windows11: Story = {
  name: "C · Windows 11",
  render: ({ page }) => (
    <ScenarioProvider key={page} initialPage={page}>
      <ProposedDesignApp lang="win11" />
    </ScenarioProvider>
  ),
}

export const C_Windows11Dark: Story = {
  name: "C · Windows 11 (dark)",
  render: ({ page }) => (
    <ScenarioProvider key={page} initialPage={page}>
      <ProposedDesignApp lang="win11" initialMode="dark" />
    </ScenarioProvider>
  ),
}

type Variant = "A" | "B" | "C"
function Compare({ page }: { page: Page }) {
  const [v, setV] = useState<Variant>("A")
  return (
    <ScenarioProvider initialPage={page}>
      {v === "A" ? <CurrentDesignApp /> : <ProposedDesignApp key={v} lang={v === "B" ? "mac27" : "win11"} />}
      <div
        role="group"
        aria-label="Design variant"
        className="fixed bottom-9 left-1/2 z-[60] flex -translate-x-1/2 gap-0.5 rounded-md border border-things-hairline bg-card p-0.5 text-xs shadow-md"
      >
        {(["A", "B", "C"] as const).map((x) => (
          <button
            key={x}
            type="button"
            aria-pressed={v === x}
            onClick={() => setV(x)}
            className="rounded-sm px-2.5 py-1 text-things-gray-2 aria-pressed:bg-things-blue aria-pressed:text-white"
          >
            {x === "A" ? "A · Current" : x === "B" ? "B · macOS 27" : "C · Windows 11"}
          </button>
        ))}
      </div>
    </ScenarioProvider>
  )
}

export const Compare_ABC: Story = {
  name: "Compare A / B / C (same state)",
  parameters: { docs: { description: { story: "Switch design language mid-scenario: filters, the open patient, the encounter draft and pending orders survive the switch." } } },
  render: ({ page }) => <Compare page={page} />,
}
