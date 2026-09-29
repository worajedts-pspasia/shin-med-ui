import type { Meta, StoryObj } from "@storybook/react-vite"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const meta: Meta = {
  title: "UI/Containers/Carousel",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { items: 4 },
  argTypes: { items: { control: { type: "range", min: 2, max: 8, step: 1 } } },
  render: (args: { items?: number }) => {
    const { items = 4 } = args
    const names = ["House", "Quarter Close", "Side Project", "Trip to Chiang Mai", "Garden", "Reading list", "Finance", "Health"]
    return (
      <Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
        <CarouselContent>
          {names.slice(0, items).map((name) => (
            <CarouselItem key={name} className="basis-1/2">
              <div className="rounded-lg border border-things-hairline p-4 text-[13px] text-things-ink">{name}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  },
}

export const AreasStrip: StoryObj = {
  render: () => (
    <Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
      <CarouselContent>
        {["House", "Quarter Close", "Side Project", "Trip"].map((name) => (
          <CarouselItem key={name} className="basis-1/2">
            <div className="rounded-lg border border-things-hairline p-4 text-[13px] text-things-ink">{name}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}
