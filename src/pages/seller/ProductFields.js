import React from "react"
import { NumberInput, Switch, Textarea, TextInput } from "@mantine/core"

const ProductFields = ({ form }) => {
  return (
    <>
      <TextInput withAsterisk label="Product name" {...form.getInputProps("name")} />

      <Textarea label="Product Description" {...form.getInputProps("description")} />

      <div className="flex space-x-4 items-end">
        <NumberInput
          hideControls
          withAsterisk
          className="w-2/5"
          label="Price"
          placeholder="0"
          min={0}
          icon={<span>₱</span>}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : ""
          }
          {...form.getInputProps("price")}
        />

        <Switch
          checked={form?.values.is_available}
          className=""
          labelPosition="left"
          label="Availability"
          {...form.getInputProps("is_available")}
        />
      </div>
    </>
  )
}

export default ProductFields
