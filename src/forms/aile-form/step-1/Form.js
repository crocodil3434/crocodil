import React from 'react'
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
} from '../../../components/inputs/Index'

const fields = [
    {
      name : "danisan_ad_soyad", 
        label : "Danışan Ad Soyad",
        type : "text",
    },
    {
        label : "Cinsiyet",
        name : "cinsiyet",
        options : [
            {
                label : "Erkek",
                value : "erkek",
            },
            {
                label : "Kadın",
                value : "kadın",
            },
        ],
        type : "select",
    },
    {
        label : "Doğum Tarihi",
        name : "dogum_tarihi",
        type : "date",
    },
]

export default function Form({formik}) {
  return (
<div className='flex flex-col gap-4'>
      {fields.map((field, index) => {
        switch (field.type) {
          case "text":
            return (
              <TextInput value={formik.values[field.name]} onChange={formik.handleChange} name={field.name} key={index} label={field.label} />
            );
          case "select":
            return (
                <SelectInput label={field.label} name={field.name} value={formik.values[field.name]} onChange={formik.handleChange}> 
                  {field.options.map((option, index) => (
                    <SelectOption key={index} value={option.value}>
                      {option.label}
                    </SelectOption>
                  ))}
                </SelectInput>
            );
          case "date":
            return (
              <DateInput label={field.label} value={formik.values[field.name]} onChange={formik.onChange} />
            );

          case "radio":
            return (
              <RadioGroup label={field.label} name={field.name} value={formik.values[field.name]} onChange={formik.handleChange}>
                {field.options.map((option, index) => (
                  <RadioOption key={index} value={option.value}>
                    {option.label}
                  </RadioOption>
                ))}
              </RadioGroup>
            );
          
          case "checkbox":
            return (
              <CheckboxGroup label={field.label} name={field.name} value={formik.values[field.name]} onChange={formik.handleChange}>
                {field.options.map((option, index) => (
                  <CheckboxOption key={index} value={option.value}>
                    {option.label}
                  </CheckboxOption>
                ))}
              </CheckboxGroup>
            );

          case "textarea":
            return (
              <TextareaInput name={field.name} key={index} label={field.label} value={formik.values[field.name]} onChange={formik.handleChange} />
            );

          default:
            return null;
        }
      })}
</div>
  );
}
