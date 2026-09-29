import type { Meta, StoryObj } from "@storybook/react-vite"
import { InboxTile, InboxTileRow } from "./InboxTile"
import { fixtureInboxTiles } from "@/fixtures/clinic"

const meta: Meta<typeof InboxTile> = {
  title: "Medical/Medical Component/Inbox Tile",
  tags: ["autodocs"],
  component: InboxTile,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The portal home's module tiles: Messages (0), Chart (3), Appointments (1) \u2014 count as a quiet \"(n)\" beside the title *and* a red badge on the icon when there's news, exactly the portal's own dual pattern. Previews list the newest dated items with source tags.\n\n**Watch out:** zero-count tiles get the empty label (\"No New Messages\"), not a hidden tile \u2014 the portal's promise is \"nothing needs you\", stated out loud.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: { count: { control: "range", min: 0, max: 20 } },
  args: { ...fixtureInboxTiles[1], count: 3 } as Record<string, unknown>,
  render: (args) => (
    <div className="max-w-xs">
      <InboxTile
        icon={fixtureInboxTiles[1].icon}
        title={String(args.title)}
        count={Number(args.count)}
        previews={fixtureInboxTiles[1].previews}
      />
    </div>
  ),
}

export const PortalRow: Story = {
  parameters: { docs: { description: { story: "The portal home: Messages (0) / Chart (3) / Appointments (1) / Announcements (0) — grid-cols-1 sm:2 lg:4." } } },
  render: () => <InboxTileRow tiles={fixtureInboxTiles} />,
}

export const Empty: Story = {
  render: () => (
    <div className="max-w-xs">
      <InboxTile icon={fixtureInboxTiles[0].icon} title="Messages" count={0} emptyLabel="No New Messages" />
    </div>
  ),
}
