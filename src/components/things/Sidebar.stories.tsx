import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Sidebar } from "@/components/things/Sidebar"
import type { Route } from "@/routes"

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, initialData: undefined } },
})

// stories use the real Sidebar (it reads useBootstrap); seed its cache
import { fixtureBootstrap } from "@/fixtures"
function seedBootstrap() {
  queryClient.setQueryData(["bootstrap"], fixtureBootstrap)
}

const meta: Meta<typeof Sidebar> = {
  title: "Task Management/Sidebar",
  tags: ["autodocs"],
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, context) => {
      seedBootstrap()
      return (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <div className="flex h-full justify-center bg-things-window p-8 font-sans">
              <div className="h-[660px] w-[224px] overflow-hidden rounded-xl bg-white shadow-[0_28px_70px_rgba(0,0,0,0.28)] ring-1 ring-black/10">
                <Story />
              </div>
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      )
    },
  ],
}

export default meta

function InteractiveSidebar({ initial }: { initial: Route }) {
  const [route, setRoute] = useState<Route>(initial)
  return <Sidebar route={route} onNavigate={setRoute} framed />
}

export const TodaySelected: StoryObj = { render: () => <InteractiveSidebar initial={{ kind: "today" }} /> }
export const ProjectSelected: StoryObj = { render: () => <InteractiveSidebar initial={{ kind: "project", id: 1 }} /> }
export const AreaSelected: StoryObj = { render: () => <InteractiveSidebar initial={{ kind: "area", id: 1 }} /> }
