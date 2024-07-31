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
        "label": "Sese tepkide bulunma",
        name : "sese_tepkide_bulunma",
        options : [
          {
            label : "Yardımlı",
            value : "yardimsiz"
          },
          {
            label : "Yardımsız",
            value : "yardimsiz"
          }
        ],
        "type": "radio"
      },
      {
        "label": "Çocuğunuz dil gelişimi ile ilgili olarak aşağıdakilerden hangilerini gerçekleştirmektedir",
        "name" : "dil_gelisimi",
        options : [
          {
            "label": "Sese tepkide bulunma",
            "value": "0"
          },
          {
            "label": "Konuşanın gözlerini ve ağzını izleme",
            "value": "1"
          },
          {
            "label": "Ses tonundaki farklılıklara uygun tepki verme (kızgın-neşeli vb.)",
            "value": "2"
          },
          {
            "label": "Adı söylenen nesneyi seçme",
            "value": "3"
          },
          {
            "label": "Tek sözcüklü yönergeleri anlama-yerine getirme",
            "value": "4"
          },
          {
            "label": "İki sözcüklü yönergeleri anlama-yerine getirme",
            "value": "5"
          },
          {
            "label": "Çok sözcüklü yönergeleri anlama-yerine getirme",
            "value": "6"
          },
          {
            "label": "Kısa bir öyküyü sonuna kadar dinleme",
            "value": "7"
          },
          {
            "label": "Çoğulları ayırt etme",
            "value": "8"
          },
          {
            "label": "İlgi adıllarını ayırt etme (benim, senin vs.)",
            "value": "9"
          },
          {
            "label": "Yer bildiren sözcüklere (içinde, altında, üstünde vb.) uygun tepki",
            "value": "10"
          }
        ],
        "type": "checkbox"
      },
      {
        "label": "Basit soruları yanıtlama",
        name : "basit_sorulari_yanitlama",
        options : [
          {
            label : "Tek Sözcükle",
            value : "tek"
          },
          {
            label : "İki Sözcükle",
            value : "iki"
          },
          {
            label : "Çok Sözcükle",
            value : "cok"
          }
        ],
        "type": "radio"
      },
      {
        "label": "Çocuğunuz nasıl iletişim kurar",
        "name" : "iletisim_kurmak",
        "type": "textarea"
      },
      {
        "label": "Yardım ister mi",
        name : "yardim_ister",
        options : [
          {
            label : "Yardım ister",
            value : "yardimister"
          },
          {
            label : "Yardım istemez",
            value : "yardimistemez"
          }
        ],
        "type": "radio"
      },
      {
        "label": "Bir nesneyi işaret eder mi",
        name : "nesneyi_isaret_eder",
        options : [
          {
            label : "Eder",
            value : "eder"
          },
          {
            label : "Etmez",
            value : "etmez"
          }
        ],
        "type": "radio"
      },
      {
        "label": "İlgi bekler mi",
        name : "ilgi_bekler",
        options : [
          {
            label: "Bekler",
            value: "bekler"
          },
          {
            label: "Beklemez",
            value: "beklemez"
          }
        ],
        "type": "radio"
      },
      {
        "label": "Hoşlanmadığı şeyleri reddedip protesto eder mi",
        name : "hoslanmadigi_seyleri_reddeder",
        options : [
          {
            label: "Eder",
            value: "eder"
          },
          {
            label: "Etmez",
            value: "etmez"
          }
        ],
        "type": "radio"
      },
      {
        "label": "İletişimi kendisi başlatır mı",
        name : "iletisimi_baslatir",
        options : [
          {
            label : "Başlatır",
            value : "baslatir"
          },
          {
            label : "Başlatmaz",
            value : "baslatmaz"
          }
        ],
        "type": "radio"
      },
      {
        "label": "Sıra alma davranışı sergiler mi",
        name : "sira_alma_davranisi",
        options : [
          {
            label : "Sergiler",
            value : "sergiler"
          },
          {
            label : "Sergilemez",
            value : "sergilemez"
          }
        ],
        "type": "radio"
      },
      {
        "label": "Hangi durumlarda iletişimi kendisi başlatır",
        name : "itelisim_kendisi_baslatir",
        "type": "textarea"
      },
      {
        "label": "Yalnız mı yoksa başkalarıyla oynamayı mı tercih eder",
        name : "oynamayi_tercih",
        options : [
          {
            label : "Yalnız",
            value : "yalniz"
          },
          {
            label : "Başkalarıyla",
            value : "baskalariyla"
          }
        ],
        "type": "radio"
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