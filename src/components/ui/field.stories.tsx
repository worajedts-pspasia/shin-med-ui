import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const meta: Meta = {
  title: "UI/Input/Field",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { label: "List name", description: "Group related to-dos together.", invalid: false },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    invalid: { control: "boolean", description: "Show the error state" },
  },
  render: (args: { label?: string; description?: string; invalid?: boolean }) => {
    const { label = "", description = "", invalid = false } = args
    return (
      <FieldGroup className="w-64">
        <Field data-invalid={invalid || undefined}>
          <FieldLabel htmlFor="pg-field">{label}</FieldLabel>
          <Input id="pg-field" placeholder="House" aria-invalid={invalid} />
          <FieldDescription>{description}</FieldDescription>
          {invalid && <FieldError errors={[{ message: "Name is too short" }]} />}
        </Field>
      </FieldGroup>
    )
  },
}

export const ListNameField: StoryObj = {
  render: () => (
    <FieldGroup className="w-64">
      <Field>
        <FieldLabel htmlFor="list-name">List name</FieldLabel>
        <Input id="list-name" placeholder="House" />
        <FieldDescription>Group related to-dos together.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
}
