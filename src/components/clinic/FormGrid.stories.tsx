import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { FormActionBar } from "./FormActionBar"
import { FormGrid, FormRow, FormSection, readOnlyFieldClass, RequiredMark } from "./FormGrid"
import { AtDensity, ForcedLocale } from "./story-utils"
import { patientA } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof FormGrid> = {
  title: "Medical/Medical UI/Form Grid",
  tags: ["autodocs"],
  component: FormGrid,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("FormGrid"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

function RegistrationForm({ mode }: { mode: "default" | "invalid" | "saving" | "readonly" }) {
  const [dirty] = useState(mode === "invalid")
  const disabled = mode === "saving"
  const ro = mode === "readonly"
  const inputCls = ro ? readOnlyFieldClass : undefined
  return (
    <form
      className="flex max-w-2xl flex-col gap-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <FormSection title="Patient" description="Identity fields as the registration screen collects them.">
        <Field data-invalid={mode === "invalid" ? true : undefined}>
          <FieldLabel htmlFor="given">
            Given name<RequiredMark />
          </FieldLabel>
          <Input id="given" defaultValue={ro ? patientA.name.given : ""} readOnly={ro} disabled={disabled} aria-required="true" aria-invalid={mode === "invalid"} className={inputCls} />
          {mode === "invalid" && <FieldError>Required — given name is mandatory.</FieldError>}
        </Field>
        <Field data-invalid={mode === "invalid" ? true : undefined}>
          <FieldLabel htmlFor="family">
            Family name<RequiredMark />
          </FieldLabel>
          <Input id="family" defaultValue={ro ? patientA.name.family : ""} readOnly={ro} disabled={disabled} aria-required="true" aria-invalid={mode === "invalid"} className={inputCls} />
          {mode === "invalid" && <FieldError>Required — family name is mandatory.</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="dob">
            Date of birth<RequiredMark />
          </FieldLabel>
          <Input id="dob" type="date" defaultValue={ro ? patientA.dob : ""} readOnly={ro} disabled={disabled} aria-required="true" className={inputCls} />
        </Field>
        <Field>
          <FieldLabel htmlFor="sex">Sex</FieldLabel>
          <NativeSelect id="sex" defaultValue={ro ? "male" : ""} disabled={disabled} className={inputCls}>
            <option value="" />
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="mrn">MRN</FieldLabel>
          <Input id="mrn" defaultValue={patientA.mrn} readOnly className={cn("font-mono", readOnlyFieldClass)} />
          <FieldDescription>Assigned by the system — read-only.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input id="phone" defaultValue={ro ? "(317) 555-0100" : ""} readOnly={ro} disabled={disabled} className={inputCls} />
        </Field>
      </FormSection>

      <FormSection title="Address">
        {/* the cascade stays 3-col at every size, like the source screen */}
        <FormRow columns={3} fixed>
          <Field>
            <FieldLabel htmlFor="house">House no.</FieldLabel>
            <Input id="house" defaultValue={ro ? "128/3" : ""} readOnly={ro} disabled={disabled} className={inputCls} />
          </Field>
          <Field>
            <FieldLabel htmlFor="moo">Moo</FieldLabel>
            <Input id="moo" defaultValue={ro ? "5" : ""} readOnly={ro} disabled={disabled} className={inputCls} />
          </Field>
          <Field>
            <FieldLabel htmlFor="road">Road</FieldLabel>
            <Input id="road" defaultValue={ro ? "Pracha Uthit" : ""} readOnly={ro} disabled={disabled} className={inputCls} />
          </Field>
        </FormRow>
        <FormRow columns={3}>
          <Field>
            <FieldLabel htmlFor="subdistrict">Subdistrict</FieldLabel>
            <Input id="subdistrict" defaultValue={ro ? "Bang Bon" : ""} readOnly={ro} disabled={disabled} className={inputCls} />
          </Field>
          <Field>
            <FieldLabel htmlFor="district">District</FieldLabel>
            <Input id="district" defaultValue={ro ? "Bang Khae" : ""} readOnly={ro} disabled={disabled} className={inputCls} />
          </Field>
          <Field>
            <FieldLabel htmlFor="postcode">Postal code</FieldLabel>
            <Input id="postcode" defaultValue={ro ? "10170" : ""} readOnly={ro} disabled={disabled} className={inputCls} />
          </Field>
        </FormRow>
      </FormSection>

      <FormSection title="Notes" columns={1}>
        <Field>
          <FieldLabel htmlFor="notes">Registration notes</FieldLabel>
          <textarea
            id="notes"
            rows={2}
            disabled={disabled}
            readOnly={ro}
            className="flex w-full rounded-md border border-things-box bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-things-gray-3 focus-visible:border-things-blue focus-visible:ring-2 focus-visible:ring-things-blue/30 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Optional"
          />
        </Field>
      </FormSection>

      <FormActionBar
        primary={{ label: "Save", onSelect: () => {}, disabled: mode === "invalid", reason: mode === "invalid" ? "Required fields are missing." : undefined }}
        secondary={[{ label: "Cancel", onSelect: () => {} }]}
        dirty={dirty}
        saving={mode === "saving"}
      />
    </form>
  )
}

export const Playground: Story = {
  argTypes: {
    columns: { control: "radio", options: [1, 2, 3] },
    required: { control: "boolean" },
  } as unknown as Meta<typeof FormGrid>["argTypes"],
  render: (args: any) => (
    <AtDensity density={args.density ?? "compact"}>
      <FormGrid columns={args.columns ?? 2}>
        <Field>
          <FieldLabel htmlFor="pg1">
            Field label{args.required && <RequiredMark />}
          </FieldLabel>
          <Input id="pg1" aria-required={args.required} />
          <FieldDescription>Help text sits at gray-3, xs size.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="pg2">Second field</FieldLabel>
          <Input id="pg2" />
        </Field>
        <FormRow>
          <Field>
            <FieldLabel htmlFor="pg3">Row field A</FieldLabel>
            <Input id="pg3" />
          </Field>
          <Field>
            <FieldLabel htmlFor="pg4">Row field B</FieldLabel>
            <Input id="pg4" />
          </Field>
        </FormRow>
      </FormGrid>
    </AtDensity>
  ),
}

export const Default: Story = { name: "Default", render: () => <RegistrationForm mode="default" /> }

export const Invalid: Story = { render: () => <RegistrationForm mode="invalid" /> }

export const Saving: Story = { render: () => <RegistrationForm mode="saving" /> }

export const ReadOnly: Story = { render: () => <RegistrationForm mode="readonly" /> }

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <RegistrationForm mode="default" />,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <ThaiForm />
      </AtDensity>
    </ForcedLocale>
  ),
}

function ThaiForm() {
  return (
    <form className="flex max-w-2xl flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
      <FormSection title="ข้อมูลผู้ป่วย" description="ทดสอบป้ายกำกับภาษาไทยที่ยาว — ป้ายอยู่เหนือช่องกรอกเสมอ">
        <Field>
          <FieldLabel htmlFor="th-given">ชื่อ<RequiredMark /></FieldLabel>
          <Input id="th-given" defaultValue="วรวุฒิ" aria-required="true" />
        </Field>
        <Field>
          <FieldLabel htmlFor="th-family">นามสกุล<RequiredMark /></FieldLabel>
          <Input id="th-family" defaultValue="ศิริธรรม" aria-required="true" />
        </Field>
        <Field>
          <FieldLabel htmlFor="th-dob">วันเดือนปีเกิด<RequiredMark /></FieldLabel>
          <Input id="th-dob" type="date" defaultValue="1984-03-20" aria-required="true" />
        </Field>
        <Field>
          <FieldLabel htmlFor="th-sex">เพศ</FieldLabel>
          <NativeSelect id="th-sex" defaultValue="male">
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
          </NativeSelect>
        </Field>
      </FormSection>
      <FormSection title="ที่อยู่">
        <FormRow columns={3} fixed>
          <Field>
            <FieldLabel htmlFor="th-house">เลขที่</FieldLabel>
            <Input id="th-house" defaultValue="128/3" />
          </Field>
          <Field>
            <FieldLabel htmlFor="th-moo">หมู่ที่</FieldLabel>
            <Input id="th-moo" defaultValue="5" />
          </Field>
          <Field>
            <FieldLabel htmlFor="th-road">ถนน</FieldLabel>
            <Input id="th-road" defaultValue="ประชาอุทิศ" />
          </Field>
        </FormRow>
        <FormRow columns={3}>
          <Field>
            <FieldLabel htmlFor="th-sub">แขวง/ตำบล</FieldLabel>
            <Input id="th-sub" defaultValue="บางบอน" />
          </Field>
          <Field>
            <FieldLabel htmlFor="th-dist">เขต/อำเภอ</FieldLabel>
            <Input id="th-dist" defaultValue="บางแขก" />
          </Field>
          <Field>
            <FieldLabel htmlFor="th-post">รหัสไปรษณีย์</FieldLabel>
            <Input id="th-post" defaultValue="10180" />
          </Field>
        </FormRow>
      </FormSection>
      <FormActionBar
        primary={{ label: "บันทึก", onSelect: () => {} }}
        secondary={[{ label: "ยกเลิก", onSelect: () => {} }]}
        dirty
      />
    </form>
  )
}
