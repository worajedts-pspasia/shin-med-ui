import type { Meta, StoryObj } from "@storybook/react-vite"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import i18n from "@/i18n"

const meta: Meta<any> = {
  title: "UI/Containers/Dialog",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { defaultOpen: true, title: "Are you sure?" },
  argTypes: {
    defaultOpen: { control: "boolean" },
    title: { control: "text" },
  },
  render: (args: { defaultOpen?: boolean; title?: string }) => {
    const { defaultOpen = true, title = "Are you sure?" } = args
    return (
    <div className="p-8">
      <Dialog defaultOpen={defaultOpen}>
        <DialogTrigger className="rounded-lg border border-things-border px-3 py-1.5 text-[13px]">Open dialog</DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>This action cannot be undone in the demo.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost">{i18n.t("dialog.cancel")}</Button>
            <Button>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    )
  },
}

export const Simple: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone in the demo.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">{i18n.t("dialog.cancel")}</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
