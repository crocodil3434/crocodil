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
    label: "Emekleme (kaba motor becerileri)",
    name : "emekleme",
    options: [
      {
        label: "Yardımlı",
        value: "yardimli",
      },
      {
        label: "Yardımsız",
        value: "yardimsiz",
      },
    ],
    type: "radio",
  },
  {
    label: "Ayakta durma (kaba motor becerileri)",
    name : "ayakta_durma",
    options: [
      {
        label: "Yardımlı",
        value: "yardimli",
      },
      {
        label: "Yardımsız",
        value: "yardimsiz",
      },
    ],
    type: "radio",
  },
  {
    label: "Otururken ayağa kalkma (kaba motor becerileri)",
    name : "otururken_ayaga_kalkma",
    options: [
      {
        label: "Yardımlı",
        value: "yardimli",
      },
      {
        label: "Yardımsız",
        value: "yardimsiz",
      },
    ],
    type: "radio",
  },
  {
    label: "Merdivenlerden inip çıkma (kaba motor becerileri)",
    name:"merdivenlerden_inip_cikma",
    options: [
      {
        label: "Yardımlı",
        value: "yardimli",
      },
      {
        label: "Yardımsız",
        value: "yardimsiz",
      },
    ],
    type: "radio",
  },
  {
    label: "Zıplama (kaba motor becerileri)",
    name : "ziplama",
    options: [
      {
        label: "Yardımlı",
        value: "yardimli",
      },
      {
        label: "Yardımsız",
        value: "yardimsiz",
      },
    ],
    type: "radio",
  },
  {
    label: "Koşma (kaba motor becerileri)",
    name  : "kosma",
    options: [
      {
        label: "Yardımlı",
        value: "yardimli",
      },
      {
        label: "Yardımsız",
        value: "yardimsiz",
      },
    ],
    type: "radio",
  },
  {
    label: "Bisiklet sürme (kaba motor becerileri)",
    name : "bisiklet_surme",
    options: [
      {
        label: "Yardımlı",
        value: "yardimli",
      },
      {
        label: "Yardımsız",
        value: "yardimsiz",
      },
    ],
    type: "radio",
  },
  {
    label: "Topa tekme vurma (kaba motor becerileri)",
    name : "topa_tekme_vurma",
    options: [
      {
        label: "Yardımlı",
        value: "yardimli",
      },
      {
        label: "Yardımsız",
        value: "yardimsiz",
      },
    ],
    type: "radio",
  },
  {
    label:
      "Çocuğunuz aşağıdaki ince motor becerilerden hangilerini gerçekleştirebilmektedir",
      name : "ince_motor_becerileri", 
    options: [
      {
        label: "Eline verilen oyuncağı tutma",
        value: "0",
      },
      {
        label: "Kağıdı karalama",
        value: "1",
      },
      {
        label: "Oyuncağı bir elinden diğerine geçirme",
        value: "2",
      },
      {
        label: "Kitabın sayfalarını çevirme",
        value: "3",
      },
      {
        label: "Küçük bir nesneyi başparmak ve diğerleriyle tutma",
        value: "4",
      },
      {
        label: "Makasla gelişigüzel kesme",
        value: "5",
      },
      {
        label: "Oyuncak arabayı itme",
        value: "6",
      },
      {
        label: "Basit şekilleri çizerek taklit etme",
        value: "7",
      },
      {
        label: "İki nesneyi birbirine vurma",
        value: "8",
      },
    ],
    type: "checkbox",
  },
  {
    label: "Çocuğunuz çişini kendisi yapabilir mi (tuvalet becerileri)",
    name : "cisi_kendisi_yapabilir",
    options: [
      {
        label: "Yapabilir",
        value: "yapabilir",
      },
      {
        label: "Yapamaz",
        value: "yapamaz",
      },
    ],
    type: "radio",
  },
  {
    label: "Çocuğunuz kakasını kendi yapabilir mi (tuvalet becerileri)",
    name : "kakasini_kendi_yapabilir",
    options: [
      {
        label: "Yapabilir",
        value: "yapabilir",
      },
      {
        label: "Yapamaz",
        value: "yapamaz",
      },
    ],
    type: "radio",
  },
  {
    label:
      "Çocuğunuz tuvalet temizliğini kendisi yapabilir mi (tuvalet becerileri)",
    name : "tuvalet_temizligi_kendi_yapabilir",
    options: [
      {
        label: "Yapabilir",
        value: "yapabilir",
      },
      {
        label: "Yapamaz",
        value: "yapamaz",
      },
    ],
    type: "radio",
  },
  {
    label:
      "Çocuğunuz tuvaletinin geldiğini nasıl ifade ediyor (tuvalet becerileri)",
      name:"tuvaletinin_geldigini_nasil_ifade_ediyor",
    type: "textarea",
  },
  {
    label: "Çocuğunuz giyinme becerilerine ne ölçüde sahiptir",
    name : "giyinme_becerileri",
    options: [
      {
        label: "Kazağını Giyip Çıkarır",
        value: "0",
      },
      {
        label: "Pantolonunu Giyip Çıkarır",
        value: "1",
      },
      {
        label: "Çorabını Giyip Çıkarır",
        value: "2",
      },
      {
        label: "Ayakkabılarını Giyer Çıkarır",
        value: "3",
      },
    ],
    type: "checkbox",
  },
  {
    label: "Yukarıda seçtiğiniz becerilerin hangilerini yardımla yapabilir",
    name : "giyinme_becerileri_yardimla",
    type: "textarea",
  },
  {
    label: "Çocuğunuz hangi yemek yeme becerilerine sahiptir",
    name : "yemek_yeme_becerileri",
    options: [
      {
        label: "Kaşıkla Yemek Yer",
        value: "0",
      },
      {
        label: "Çatal Kullanır",
        value: "1",
      },
      {
        label: "Bıçak Kullanır",
        value: "2",
      },
      {
        label: "Bardaktan Su İçer",
        value: "3",
      },
    ],
    type: "checkbox",
  },
  {
    label:
      "Çocuğunuz yukarıdaki seçtiğiniz yeme becerilerinden hangilerini yardımla yapabilir",
    name : "yemek_yeme_becerileri_yardimla",
    type: "textarea",
  },
  {
    label:
      "Çocuğunuz renk, şekil, sayı, büyüklük kavramlarıyla ilgili olarak hangi becerilere sahiptir",
    name : "renk_sekil_sayi_buyukluk_kavramlari",
    options: [
      {
        label: "Renklerin isimlerini bilir ve yerinde kullanır",
        value: "0",
      },
      {
        label: "Söylenen sayı kadar objeyi getirir",
        value: "1",
      },
      {
        label: "Aynı şekilde objeleri birleştirir",
        value: "2",
      },
      {
        label: "Büyük-küçük sözcüklerini bilir ve yerinde kullanır",
        value: "3",
      },
    ],
    type: "checkbox",
  },
  {
    label:
      "Çocuğunuzda belirgin alışkanlık haline gelmiş davranışlar var mıdır",
    name : "belirgin_aliskanliklar",
    options: [
      {
        label: "Var",
        value: "var",
      },
      {
        label: "Yok",
        value: "yok",
      },
    ],
    type: "radio",
  },
  {
    label: "Varsa nelerdir",
    name : "belirgin_aliskanliklar_detay",
    type: "textarea",
  },
];

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
                  <RadioOption key={index + option.value + "-opt"} value={option.value}>
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