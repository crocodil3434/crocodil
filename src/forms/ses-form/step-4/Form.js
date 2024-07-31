import React from "react";
import {
  TextInput,
  SelectOption,
  SelectInput,
  RadioGroup,
  RadioOption,
  CheckboxGroup,
  CheckboxOption,
  TextareaInput,
  DateInput,
} from "../../../components/inputs/Index";

const fields = [
  { name: "grade", label: "GRADE" },
  {
    name: "roughness",
    label: "ROUGHNESS",
    type: "radio",
    options: [
      { label: "0=Normal", value: 0 },
      { label: "1=Hafif etkilenmiş", value: 1 },
      { label: "2=Orta derecede etkilenmiş", value: 2 },
      { label: "3=Şiddetli derecede etkilenmiş", value: 3 },
    ],
  },
  {
    name: "breathiness",
    label: "BREATHINESS",
    type: "radio",
    options: [
      { label: "0=Normal", value: 0 },
      { label: "1=Hafif etkilenmiş", value: 1 },
      { label: "2=Orta derecede etkilenmiş", value: 2 },
      { label: "3=Şiddetli derecede etkilenmiş", value: 3 },
    ],
  },
  {
    name: "asthenia",
    label: "ASTHENIA",
    type: "radio",
    options: [
      { label: "0=Normal", value: 0 },
      { label: "1=Hafif etkilenmiş", value: 1 },
      { label: "2=Orta derecede etkilenmiş", value: 2 },
      { label: "3=Şiddetli derecede etkilenmiş", value: 3 },
    ],
  },
  {
    name: "strain",
    label: "STRAIN",
    type: "radio",
    options: [
      { label: "0=Normal", value: 0 },
      { label: "1=Hafif etkilenmiş", value: 1 },
      { label: "2=Orta derecede etkilenmiş", value: 2 },
      { label: "3=Şiddetli derecede etkilenmiş", value: 3 },
    ],
  },
];

export default function Form({ formik }) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        switch (field.type) {
          case "text":
            return (
              <TextInput
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                name={field.name}
                key={index}
                label={field.label}
              />
            );
          case "select":
            return (
              <SelectInput
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
              >
                {field.options.map((option, index) => (
                  <SelectOption key={index} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
              </SelectInput>
            );
          case "date":
            return (
              <DateInput
                label={field.label}
                value={formik.values[field.name]}
                onChange={formik.onChange}
              />
            );

          case "radio":
            return (
              <RadioGroup
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
              >
                {field.options.map((option, index) => (
                  <RadioOption key={index} value={option.value}>
                    {option.label}
                  </RadioOption>
                ))}
              </RadioGroup>
            );

          case "checkbox":
            return (
              <CheckboxGroup
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
              >
                {field.options.map((option, index) => (
                  <CheckboxOption key={index} value={option.value}>
                    {option.label}
                  </CheckboxOption>
                ))}
              </CheckboxGroup>
            );

          case "textarea":
            return (
              <TextareaInput
                name={field.name}
                key={index}
                label={field.label}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
