import type { Meta, StoryObj } from "@storybook/react-vite"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"

const meta: Meta = {
  title: "UI/Input/Form",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { label: "Username", description: "Your display name.", placeholder: "worajedt" },
  argTypes: { label: { control: "text" }, description: { control: "text" }, placeholder: { control: "text" } },
  render: (args: { label?: string; description?: string; placeholder?: string }) => {
    const { label = "", description = "", placeholder = "" } = args
    const form = useForm({ defaultValues: { username: "" } })
    return (
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="w-64 space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl><Input placeholder={placeholder} {...field} /></FormControl>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm">Submit</Button>
        </form>
      </Form>
    )
  },
}

function SampleForm() {
  const form = useForm({ defaultValues: { username: "" } })
  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="w-64 space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input placeholder="worajedt" {...field} /></FormControl>
              <FormDescription>Your display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm">Submit</Button>
      </form>
    </Form>
  )
}

export const WithReactHookForm: StoryObj = {
  render: () => <SampleForm />,
}
