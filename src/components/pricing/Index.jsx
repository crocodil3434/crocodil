import { CheckIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const includedFeatures = [
  {
    header: "Terapi Takip Sistemi",
    content:
      "Danışanlarınızı kayıt edip takibini yapın.Kendiniz için veya danışanınız için notlar alın",
  },
  {
    header: "Danışan Paneli",
    content:
      "Danışanlarınızı sisteme kayıt ettikten sonra danışanların kendilerine giden mail ile şifre koyabilecekler ve süreçlerini takip edebilecekler",
  },
  {
    header: "Ödevlendirme",
    content:
      " Danışanlarınıza verdiğiniz ödevleri danışanlarınız kendi panelleri üzerinden takip edebilecekler.Danışanlarınız için açıklamalı fotoğraf ve videolar yükleyebileceksiniz.",
  },
  {
    header: "Ödev Bilgilendirme ve Takip Sistemi",
    content:
      "Ödev verdiğiniz danışanlar bilgilendirilecek ve ödev tesliminden önce uyarılacaklar",
  },
  {
    header: "Danışan Transfer",
    content:
      "Danışanınız istediğiniz notlar ile birlikte yeni bir terapiste transfer edilebilecek",
  },
  {
    header: "Farklı Araçlar",
    content: "Anketler ve Kekemelik Şiddeti Hesaplayıcı",
  },
];

export default function Example() {
  const { currentUser, userData } = useAuth();
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tüm İhtiyaçlarınız için Tek Paket
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            En iyi hizmet için Crocodil Abonelik Paketini İnceliyiniz
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Aylık Abonelik
            </h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Tüm ihtiyaçlarınızı içeren bu pakete erişmek için aylık abonelik
              satın alabilirsiniz.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                Pakete Dahil Olanlar
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold">{feature.header}</p>
                    <p className="text-xs">{feature.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Aylık</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <div className="flex flex-col">
                    <span className="text-xl  tracking-tight text-gray-900 line-through">
                      850 TRY
                    </span>
                    <span className="text-3xl  tracking-tight text-gray-900">
                      450 TRY
                    </span>
                  </div>
                </p>
                {currentUser && !userData?.paymentStatus && (
                  <Link
                    type="button"
                    to={userData.role === "doctor" ? "/billing2" : "#"}
                    className=" mt-10 block w-full rounded-md bg-gray-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    Abone Ol
                  </Link>
                )}
                {currentUser && userData?.paymentStatus && (
                  <Link
                    type="button"
                    to={"/dashboard"}
                    className=" mt-10 block w-full rounded-md bg-green-500 px-3 py-2 text-center text-sm font-semibold text-green-100 shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    ABONESIN
                  </Link>
                )}
                {!currentUser && (
                  <Link
                    type="button"
                    to={"/register"}
                    className=" mt-10 block w-full rounded-md bg-gray-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    Abone Ol
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
