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
  {
    name: "glottal_closure_type",
    label: "Glottal Kapanma Türü",
    type: "radio",
    options: [
      { value: "komplet", label: "Komplet" },
      { value: "anterior", label: "Anterior" },
      { value: "posterior", label: "Posterior" },
      { value: "inkomplet", label: "İnkomplet" },
      { value: "duzensiz", label: "Düzensiz" },
      { value: "ortada", label: "Ortada" },
      { value: "kumsaati", label: "Kum Saati" },
    ],
  },
  {
    name: "mucosal_wave_presence",
    label: "Mukozal Dalga Varlığı",
    type: "radio",
    options: [
      { value: 0, label: "Normal" },
      { value: 1, label: "Hafif derece azalmış" },
      { value: 2, label: "Orta derece azalmış" },
      { value: 3, label: "Şiddetli derece azalmış" },
      { value: 4, label: "Görülebilen dalga varlığı yok" },
    ],
  },
  {
    name: "periodicity",
    label: "Periodisite",
    type: "radio",
    options: [
      { value: 0, label: "Düzensiz" },
      { value: 1, label: "Bazen düzenli" },
      { value: 2, label: "Çoğunlukla düzenli" },
      { value: 3, label: "Her zaman düzenli" },
    ],
  },
  {
    name: "amplitude",
    label: "Amplitüd",
    type: "radio",
    options: [
      { value: 0, label: "Normal" },
      { value: 1, label: "Hafif azalmış" },
      { value: 2, label: "Orta derecede azalmış" },
      { value: 3, label: "Görünebilir hareket yok" },
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
