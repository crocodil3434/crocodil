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
  { name: "f0_hz", label: "F0 ...Hz", type: "text" },
  { name: "jitter", label: "Jitter", type: "text" },
  { name: "shimmer", label: "Shimmer", type: "text" },
  { name: "signal_noise_ratio", label: "Sinyal Gürültü Oranı", type: "text" },
  {
    name: "voice_handicap_index_score",
    label: "Ses Handikap İndeks Puanı",
    type: "text",
  },
];

export default function Form({ formik }) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        return (
          <TextInput
            value={formik?.values[field.name]}
            onChange={formik?.handleChange}
            name={field.name}
            key={index + "- step 7 - elements"}
            label={field.label}
          />
        );
      })}
    </div>
  );
}
