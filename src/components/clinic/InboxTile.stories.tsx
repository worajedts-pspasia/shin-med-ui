import type { Meta, StoryObj } from "@storybook/react-vite"
import { InboxTile, InboxTileRow } from "./InboxTile"
import { fixtureInboxTiles } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof InboxTile> = {
  title: "Medical/Medical Component/Inbox Tile",
  tags: ["autodocs"],
  component: InboxTile,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("InboxTile"),
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
  parameters: { docs: { description: { story: docsDesc("InboxTile::PortalRow") } } },
  render: () => <InboxTileRow tiles={fixtureInboxTiles} />,
}

export const Empty: Story = {
  render: () => (
    <div className="max-w-xs">
      <InboxTile icon={fixtureInboxTiles[0].icon} title="Messages" count={0} emptyLabel="No New Messages" />
    </div>
  ),
}
