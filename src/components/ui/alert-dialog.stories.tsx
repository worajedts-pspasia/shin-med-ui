import type { Meta, StoryObj } from "@storybook/react-vite"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import i18n from "@/i18n"

const meta: Meta = {
  title: "UI/Containers/AlertDialog",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { defaultOpen: true, title: "Delete this list?", destructive: true },
  argTypes: {
    defaultOpen: { control: "boolean" },
    title: { control: "text" },
    destructive: { control: "boolean", description: "Style the confirm button destructive" },
  },
  render: (args: { defaultOpen?: boolean; title?: string; destructive?: boolean }) => {
    const { defaultOpen = true, title = "", destructive = true } = args
    return (
      <AlertDialog defaultOpen={defaultOpen}>
        <AlertDialogTrigger asChild><Button variant="outline">Delete list…</Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>This removes the list and every to-do inside it.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{i18n.t("dialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant={destructive ? "destructive" : "default"}>{i18n.t("task.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

export const DeleteList: StoryObj = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete list…</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this list?</AlertDialogTitle>
          <AlertDialogDescription>This removes the list and every to-do inside it.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{i18n.t("dialog.cancel")}</AlertDialogCancel>
          <AlertDialogAction variant="destructive">{i18n.t("task.delete")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
