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
        label : "Hamilelik Süresi",
        name:"hamilelik_suresi",
        type : "text",
    },
    {
        label : "Doğum Süresi",
        name:"dogum_suresi",
        type : "text",
    },
    {
        label : "Hamilelik Sırasında...",
        name : "hamilelik_sirasinda",
        type : "textarea",
    },
    {
      label : "Doğum Sırasında Anne İlaç Aldı mı?",
      name : "ilac_alma",
      options  :[
        {
          label : "Evet",
          value : "evet"
        },
        {
          label : "Hayır",
          value : "hayır"
        }
      ],
      type : "radio",
    },
    {
      label : "Annenin Hamilelik Sürecindeki Durumu Nasıldı ?",
      name : "anne_durumu",
      options : [
        {
          label : "İyi",
          value : "iyi"
        },
        {
          label : "Fena Değil",
          value : "fenaDegil"
        },
        {
          label : "Kötü",
          value : "kotu"
        },
      ],
      type : "radio"
    },
    {
      label : "Doğum Sırasında Ortaya Çıkan Güçlükler",
      name:"dogum_guclukler",
      type : "textarea"
    },
    {
      label:"Bebek Doğum Sırasında Oksijensiz Kaldı mı ?",
      name:"bebek_oksijensiz_kalma",
      options : [
        {
          label : "Evet",
          value : "evet"
        },
        {
          label : "Hayır",
          value : "hayır"
        }
      ],
      type : "radio"
    },
    {
      label : "Varsa Diğer Zarar Verici Durumları Tanımlar mısınız ?",
      name : "diger_zarar_verici_durumlar",
      type : "textarea",
    },
    {
      label : "Doğum Sonrası Ortaya Çıkan Güçlükler",
      name : "dogum_sonrasi_guclukler",
      type : "textarea",
    },
    {
      label : "Akraba Evliliği Var mı ?",
      name : "akraba_evliligi",
      options : [
        {
          label : "Var",
          value : "var"
        },
        {
          label : "Yok",
          value : "yok"
        }
      ],
      type : "radio",
    }
]

export default function Form({formik}) {
  return (
<>
      {fields.map((field, index) => {
        switch (field.type) {
          case "text":
            return (
              <TextInput value={formik.values[field.name]} onChange={formik.handleChange} name={field.name} key={index} label={field.label} />
            );
          case "select":
            return (
                <SelectInput name={field.name} value={formik.values[field.name]} onChange={formik.handleChange}> 
                  {field.options.map((option, index) => (
                    <SelectOption key={index} value={option.value}>
                      {option.label}
                    </SelectOption>
                  ))}
                </SelectInput>
            );
          case "date":
            return (
              <DateInput />
            );

          case "radio":
            return (
              <RadioGroup label={field.label} name={field.name} value={formik.values[field.name]} onChange={formik.handleChange}>
                {field.options.map((option, index) => (
                  <RadioOption key={index + option.value} value={option.value}>
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
</>
  );
}
