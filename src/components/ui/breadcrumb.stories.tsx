import type { Meta, StoryObj } from "@storybook/react-vite"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const meta: Meta = {
  title: "UI/Navigation/Breadcrumb",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { depth: 3 },
  argTypes: { depth: { control: { type: "range", min: 1, max: 5, step: 1 } } },
  render: (args: { depth?: number }) => {
    const { depth = 3 } = args
    const crumbs = ["Personal", "House", "Maintenance", "Hallway", "Light bulb"].slice(0, depth)
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((c, i) => (
            <span key={c} className="flex items-center gap-2">
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {i === crumbs.length - 1 ? <BreadcrumbPage>{c}</BreadcrumbPage> : <BreadcrumbLink href="#">{c}</BreadcrumbLink>}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  },
}

export const AreaToList: StoryObj = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#">Personal</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>House</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}
