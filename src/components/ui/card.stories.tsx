import type { Meta, StoryObj } from "@storybook/react-vite"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const meta: Meta = {
  title: "UI/Containers/Card",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { title: "List settings", description: "House — everything about the apartment", withFooter: true, withAction: false },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    withFooter: { control: "boolean" },
    withAction: { control: "boolean" },
  },
  render: (args: { title?: string; description?: string; withFooter?: boolean; withAction?: boolean }) => {
    const { title = "List settings", description = "", withFooter = true, withAction = false } = args
    return (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          {withAction && <CardAction><Button size="sm" variant="ghost">…</Button></CardAction>}
        </CardHeader>
        <CardContent />
        {withFooter && (
          <CardFooter className="gap-2">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="ghost">Cancel</Button>
          </CardFooter>
        )}
      </Card>
    )
  },
}

export const SettingsCard: StoryObj = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>List settings</CardTitle>
        <CardDescription>House — everything about the apartment</CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter className="gap-2">
        <Button size="sm">Save</Button>
        <Button size="sm" variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  ),
}
