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
        label : "Vaka Öyküsü",
        name : "vaka_oykusu",
        type : "textarea",
    },
    {
        label : "Ailede Konuşma Sorunu Olan Var mı ?",
        name : "ailede_konusma_sorunu_olan_var_mi",
        options  :[
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
    },
    {
        label : "Muhtemel konuşmaya başlama yaşı",
        name : "muhtemel_konusmaya_baslama_yasi",
        type : "text",
    },
    {
      label : "Çocuğunuz Beslenme Güçlüğü (emme,yutma vs.) Çekti mi ?",
      name : "beslenme_guclugu_cekme",
      options : [
        {
          label : "Çekti",
          value : "cekti"
        },
        {
          label : "Çekmedi",
          value : "cekmedi"
        }
      ],
      type : "radio",
    },
    {
      label : "Varsa çocuğunuzun diğer geçirdiği çocukluğu çağı hastalıkları",
      name : "varsa_gecirilen_cocukluk_hastaliklar",
      type : "textarea",
    },
    {
      label : "Çocuğunuz orta kulak enfeksiyonu geçirdi mi ?",
      name : "orta_kulak_enfeksiyonu_gecirdi_mi",
      options : [
        {
          label : "Geçirdi",
          value : "gecirdi"
        },
        {
          label : "Geçirmedi",
          value : "gecirmedi"
        }
      ],
      type : "radio",
    },
    {
      label : "Çocuğunuzun herhangi bir işitme sorunu var mı ?",
      name : "isitme_sorunu",
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
    },
    {
      label : "Çocuğunuz daha önce hiçbir ameliyat geçirdi mi ?",
      name : "ameliyat_gecirme",
      options : [
        {
          label : "Geçirdi",
          value : "gecirdi"
        },
        {
          label : "Geçirmedi",
          value : "gecirmedi"
        }
      ],
      type : "radio",
    },
    {
      label : "Varsa geçirdiği ameliyatlar ve tarihi",
      name : "gecirilen_ameliyatlar_ve_tarihi",
      type : "textarea",
    },
    { 
      label : "Çocuğunuzun dil ve konuşma problemini tanımlayınız",
      name:"dil_ve_konusma_problemi_tanimi",
      type : "textarea",
    },
    {
      label : "Çocuğunuz hangi elini kullanır ?",
      name : "hangi_elini_kullanir",
      options : [
        {
          label : "Sağ",
          value : "sag"
        },
        {
          label : "Sol",
          value : "sol"
        }
      ],
      type : "radio",
    },
    {
      label : "Çocuğunuzla gün boyu kim ilgileniyor ?",
      name : "kim_ilgileniyor",
      type : "text",
    },
    {
      label : "Çocuğunuz okula gidiyorsa okuldaki durumu hakkında bilgi veriniz",
      name : "okuldaki_durumu",
      type : "textarea",
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
