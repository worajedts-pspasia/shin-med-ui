import type { Meta, StoryObj } from "@storybook/react-vite"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox"

const meta: Meta = {
  title: "UI/Input/Combobox",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { placeholder: "Search lists…", selected: "house" },
  argTypes: {
    placeholder: { control: "text" },
    selected: { control: "radio", options: ["house", "qc", "trip"] },
  },
  render: (args: { placeholder?: string; selected?: string }) => {
    const { placeholder = "", selected = "house" } = args
    const items = [
      { value: "house", label: "House" },
      { value: "qc", label: "Quarter Close" },
      { value: "trip", label: "Trip to Chiang Mai" },
    ]
    return (
      <Combobox defaultValue={selected} items={items}>
        <ComboboxTrigger className="w-48"><ComboboxValue /></ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder={placeholder} />
          <ComboboxEmpty>No list found.</ComboboxEmpty>
          {items.map((i) => <ComboboxItem key={i.value} value={i.value}>{i.label}</ComboboxItem>)}
        </ComboboxContent>
      </Combobox>
    )
  },
}

export const ListPicker: StoryObj = {
  render: () => (
    <Combobox defaultValue="house" items={[
      { value: "house", label: "House" },
      { value: "qc", label: "Quarter Close" },
      { value: "trip", label: "Trip to Chiang Mai" },
    ]}>
      <ComboboxTrigger className="w-48"><ComboboxValue /></ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search lists…" />
        <ComboboxEmpty>No list found.</ComboboxEmpty>
        <ComboboxItem value="house">House</ComboboxItem>
        <ComboboxItem value="qc">Quarter Close</ComboboxItem>
        <ComboboxItem value="trip">Trip to Chiang Mai</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  ),
}
