import type { Meta, StoryObj } from "@storybook/react-vite"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const meta: Meta = {
  title: "UI/Navigation/Pagination",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { pages: 5, active: 2, withEdges: true },
  argTypes: {
    pages: { control: { type: "range", min: 3, max: 9, step: 1 } },
    active: { control: { type: "range", min: 1, max: 9, step: 1 } },
    withEdges: { control: "boolean", description: "Previous / Next buttons" },
  },
  render: (args: { pages?: number; active?: number; withEdges?: boolean }) => {
    const { pages = 5, active = 2, withEdges = true } = args
    return (
      <Pagination>
        <PaginationContent>
          {withEdges && <PaginationItem><PaginationPrevious href="#" /></PaginationItem>}
          {Array.from({ length: pages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink href="#" isActive={i + 1 === active}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}
          {withEdges && <PaginationItem><PaginationNext href="#" /></PaginationItem>}
        </PaginationContent>
      </Pagination>
    )
  },
}

export const LogbookPages: StoryObj = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}
