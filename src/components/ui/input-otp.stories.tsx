import type { Meta, StoryObj } from "@storybook/react-vite"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

const meta: Meta<any> = {
  title: "UI/Input/InputOtp",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { maxLength: 6, disabled: false },
  argTypes: {
    maxLength: { control: { type: "range", min: 4, max: 8, step: 1 } },
    disabled: { control: "boolean" },
  },
  render: (args: { maxLength?: number; disabled?: boolean }) => {
    const { maxLength = 6, disabled = false } = args
    return (
    <InputOTP maxLength={maxLength} disabled={disabled}>
      {Array.from({ length: maxLength }).map((_, i) => (
        <InputOTPGroup key={i}>
          <InputOTPSlot index={i} />
        </InputOTPGroup>
      ))}
    </InputOTP>
    )
  },
}

export const SixDigits: StoryObj = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}
