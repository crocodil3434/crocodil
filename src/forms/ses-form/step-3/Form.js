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
    name: "hiz",
    label: "Hız",
    type: "radio",
    options: [
      { value: "yeterli", label: "Yeterli" },
      { value: "yavas", label: "Yavaş" },
      { value: "hizli", label: "Hızlı" },
    ],
  },
  {
    name: "siddet",
    label: "Şiddet",
    type: "radio",
    options: [
      { value: "yeterli", label: "Yeterli" },
      { value: "yavas", label: "Yavaş" },
      { value: "hizli", label: "Hızlı" },
    ],
  },
  {
    name: "rezonans",
    label: "Rezonans",
    type: "checkbox",
    options: [
      { value: "on", label: "Ön" },
      { value: "arka", label: "Arka" },
      { value: "yeterli", label: "Yeterli" },
      { value: "yetersiz", label: "Yetersiz" },
    ],
  },
  {
    name: "artikulasyon",
    label: "Artikülasyon",
    type: "radio",
    options: [
      { value: "yeterli", label: "Yeterli" },
      { value: "yetersiz", label: "Yetersiz" },
    ],
  },
  {
    name: "solunum_tipi",
    label: "Solunum Tipi",
    type: "checkbox",
    options: [
      { value: "abdominal", label: "Abdominal" },
      { value: "torasik", label: "Torasik" },
      { value: "klavikular", label: "Klavikular" },
      { value: "mikst", label: "Mikst" },
    ],
  },
  {
    name: "informal_gozlemler",
    label: "İnformal Gözlemler",
    type: "checkbox",
    options: [
      { label: "Hard Glottal Atak", value: "hard_global_atak" },
      { label: "Çenede Gerginlik", value: "cenede_gerginlik" },
      { label: "Gözlenen Gerginlik", value: "gozlenen_gerginlik" },
      { label: "Dilde Gerginlik", value: "dilde_gerginlik" },
      { label: "Glottal Fry", value: "glottal_fry" },
      {
        label: "Aşırı Ekstrinsik Larengeal Kas Kullanımı",
        value: "asiri_ekstrinsik_larengeal_kas_kullanımı",
      },
      { label: "Diplofoni", value: "diplofoni" },
    ],
  },
  {
    name: "boguk_ses",
    label: "Boğuk Ses",
    type: "radio",
    options: [
      { value: "hafif", label: "Hafif" },
      { value: "orta", label: "Orta" },
      { value: "ileri", label: "İleri" },
      { value: "yok", label: "Yok" },
    ],
  },
  {
    name: "nefesli_ses",
    label: "Nefesli Ses",
    type: "radio",
    options: [
      { value: "hafif", label: "Hafif" },
      { value: "orta", label: "Orta" },
      { value: "ileri", label: "İleri" },
      { value: "yok", label: "Yok" },
    ],
  },
  {
    name: "hisirtili_ses",
    label: "Hışırtılı Ses",
    type: "radio",
    options: [
      { value: "hafif", label: "Hafif" },
      { value: "orta", label: "Orta" },
      { value: "ileri", label: "İleri" },
      { value: "yok", label: "Yok" },
    ],
  },
  {
    name: "tini",
    label: "Tını",
    type: "radio",
    options: [
      { label: "Yeterli", value: "yeterli" },
      { label: "Yüksek", value: "yuksek" },
      { label: "Alçak", value: "alcak" },
    ],
  },
  {
    name: "tini_ranji",
    label: "Tını Ranjı",
    type: "radio",
    options: [
      { label: "Yeterli", value: "yeterli" },
      { label: "Sınırlı", value: "sinirli" },
      { label: "Üst / Alçak", value: "ust_ve_alcak" },
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
