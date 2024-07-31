import React, { useState, useEffect, Fragment } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { Dialog, Menu, Transition } from "@headlessui/react";
import Timer from "../../components/Timer"; // TimerModal'ın yolu burada örnek olarak verilmiştir.
import swal from "sweetalert2";
import {
  Bars3CenterLeftIcon,
  CogIcon,
  HomeIcon,
  CalculatorIcon,
  ScaleIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { useAuth } from "../../context/AuthContext";
import DoctorLayout from "../../components/layout/doctor/sidebar/Index";

const navigation = [
  { name: "Home", href: "/dashboard", icon: HomeIcon, current: false },
  {
    name: " Metinler & Hesap Makinesi",
    href: "/texts",
    icon: CalculatorIcon,
    current: true,
  },
];
const secondaryNavigation = [
  { name: "Dosyalar", href: "/soon", icon: DocumentIcon },
  { name: "Araçlar", href: "/soon", icon: CogIcon },
];
const cards = [
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
];
const statusStyles = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
};
const placeholderImg = "/placeholder.jpeg";
const Logo = "Logo-v.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const contents = [
  {
    title: "1.sınıf düzeyi okuma metni",
    subtitle: "BEBEK",
    paragraphs: [
      "Nihal sarı saçlı bebeğini çok severdi. Okuldan gelir gelmez gözü bebeğini arardı. Adını buğday koymuştu bebeğinin. Ailesi, bebeğin ismine çok gülmüştü. Ama Nihal koyduğu ismi çok beğeniyordu. Bebeğinin saçlarını tarlalarındaki buğdaylara benzetiyordu.",
      "Hasat zamanıydı. Ağustosun en sıcak günleriydi. Nihal, buğdayları biçen ailesini seyrediyordu. Tarlanın kıyısındaki ağacın altındaydı. Gölgede bebeği ile oynarken uyuyakaldı. Uyandığında buğday yok olmuştu (Ergeneci, 1999)",
    ],
    quote: "172 hece",
  },
  {
    title: "2.sınıf düzeyi okuma metni ",
    subtitle: "ÖKÜZ OLMAK İSTEYEN KURBAĞA",
    paragraphs: [
      "        Kurbağanın biri bir gün dere kenarına gelmiş. Canı çok sıkılıyormuş. Derede kendi etrafında oradan oraya zıplıyormuş.  Keyifle çevresine bakmaya başlamış.  Tam o sırada çayırda otlayan öküzü görmüş. Öküzün büyüklüğüne hayran olmuş. Kendi kendine:        ",
      "-bende öküz gibi olabilirim. O zaman herkes benim büyüklüğüme hayran olur, demiş.",
      "Bunun üzerine kurbağa ne yapabilirim diye düşünmeye başlamış birden aklına parlak bir fikir gelmiş ve kendini şişirmeye başlamış. Şiştikçe şişmiş, şiştikçe şişmiş. Biraz daha biraz daha derken çat diye çatlayıvermiş. Öküz olmak isterken ölü bir kurbağa oluvermiş (Ergeneci, Yurtkulu, 2002)",
    ],
    quote: "217 hece",
  },
  {
    title: "3.sınıf düzeyi okuma metni",
    subtitle: "HAVA TAHMİNLERİ",
    paragraphs: [
      "Hava durumu ile ilgili bilgilere ulaşmak bizler için oldukça önemlidir. İnternetten, televizyon, gazete ve ya radyodan hava durumlarındaki değişiklikleri öğrenebiliriz. Böylece günlük işlerimizi daha rahat ayarlayabilir, hava koşullarına göre giyinebilir ve günlük planımızı daha uygun bir şekilde hazırlayabiliriz.",
      "Ayrıca birçok meslek dalı için hava durumunu bilmek oldukça yararlıdır. Örneğin; kaptanlar, balıkçılar, pilotlar, şoförler ve tarımla ilgilenenler için hava durumunu bilmek yararlıdır. Bizler de bulutların şekline ve rengine bakarak hava durumunu tahmin edebiliriz (Ekiztepe, 2004)."
    ],
    quote: "216 hece"
  },
  {
    title: "4.sınıf düzeyi okuma metni",
    subtitle: "PİNTİ",
    paragraphs: [
      "Pintinin biri nesi var nesi yoksa altınla değiştirirmiş. Altını da külçe halinde götürüp gömmüş. Ama gönlünü de aklını da birlikte gömmüş. Her gün bir kez gelir, toprağı kazar, malına bakarmış.",
      "İşçinin biri bunu uzaktan görmüş. İşi anlamış. Gelmiş, altın külçesini alıp götürmüş. Ertesi gün pinti toprağı gene kazmış. Bakmış ki altın yok. Dövünüp ağlamaya, saçlarını yolmaya başlamış.",
      "Oradan biri geçiyormuş: -Ne var, ne oldu, diye sormuş. İşin aslını öğrenince: -Ne ağlıyorsun, be adam, demiş. Senin altının ha varmış, ha yokmuş. Git bir taş al, onu göm, altındır de, çık işin içinden. Senin için altınla taşın bir farkı mı var? Anlaşılıyor ki sen altının varken bir yararını görmüyormuşsun, demiş (Kobak, 2011)."
    ],
    quote: "237 hece"
  },
  {
    title: "5.sınıf düzeyi okuma metni",
    subtitle: "TİLKİ",
    paragraphs: [
      "Ortalık sıcaktan kavruluyordu. Tilkiciğin dili dışarı sarkmış, kendisine serin gölgelikli bir yer arıyordu. Gide gide kendisini bir meyve bahçesinde buldu. Baktı ki yüksekçe bir asmanın üzeri, iri taneli üzüm salkımlarıyla dopdolu. Ağzı sulandı, hemen asmanın dibine koştu. ‘Aman ne hoş kokusu, ne leziz tadı vardır bunların.’ diyerek asmanın dallarına doğru hücum etti.",
      "Ancak boyu yetişemediği için üzümleri koparamadı. Asmaya tırmanmaya çalıştı, beceremedi. Tuttuğu bir dalı çekerek üzümleri kendisine yaklaştırmaya uğraştı, dal elinde kaldı. Bunun üzerine kızdı ve ‘Aman, kim bilir ne kadar da ekşidir limon gibi o üzümler.’ dedi. Sonra da arkasına bakarak çekti gitti.",
      "Olup bitenleri asmanın üzerinden izleyen küçük kuş ise tilkinin ardından şöyle seslendi: ‘İşte böyledir! Uzanamadığın nimete ekşi der gidersin.’ (Gülpınar, 2014)."
    ],
    quote: "259 hece"
  },
  {
    title: "6.sınıf düzeyi okuma metni",
    subtitle: "KÜRESEL ISINMA, KÜRESEL SORUN",
    paragraphs: [
      "Dünyamızın en önemli sorunlarından birisi de ‘Küresel ısınma’dır. Küresel ısınma; Dünya’nın normal seviyesinin üzerinde ısınmasıyla meydana gelen olumsuz atmosfer olaylarına neden olmaktadır. Kısaca bahsedecek olursak, Dünyamızın ısısı karbondioksit oranının varlığına bağlıdır.",
      "Dünya’da kullanılan bazı gazlar ozon tabakasının delinmesine, böylece karbondioksit dengesinin bozulmasına neden olmaktadır. Böylece Dünya; aşırı ısınmaya, iklim değişmelerine, çöllenmelere, kasırgalara ve buzların erimeleriyle deniz seviyelerinin değişmelerine maruz kalarak yaşanmaz bir hale gelecektir. Bu nedenle ozon tabakasına zarar veren gazların kullanılmaması için gerekli önlemleri almalıyız (Buhan, 2009)."
    ],
    quote: "267 hece"
  },
  {
    title: "7.sınıf düzeyi okuma metni",
    subtitle: "KİBRİTÇİ KIZ",
    paragraphs: [
      "Dehşetli soğuk vardı; kar yağıyor, akşam karanlığı bastırıyordu. Yılbaşı gecesiydi. Bu soğukta, bu karanlıkta küçük bir kızcağız yürüyordu soğukta; başı açık, yalın ayaktı. Evden çıkarken terlik giymesine giymişti, ama bunlar bir işe yaramamıştı. Karşı kaldırıma geçiyordu. Karşısına ansızın doludizgin giden iki araba çıkıverince kızcağız, telaştan bu terlikleri de kaybetti. Birini bir türlü bulamadı, ötekini de bir oğlan alıp kaçtı.",
      "Küçük, işte yalın ayak yürüyordu; minik ayakları soğuktan morarmıştı. Eski püskü önlüğünde bir sürü kibrit vardı. Kibritlerin bir demetini de elinde tutuyordu. Gün boyu kimse ondan bir kibrit bile almamıştı. Karnı acıkmış, üşümüş, yürüyordu; zavallıcık yılgındı, ürkmüştü! Uzun, sarı saçlarına lapa lapa kar yağıyordu. Bütün pencerelerde ışıklar parıldıyor, sokaklar ne de nefis kaz kızartması kokuyordu (Deniz, 2013)."
    ],
    quote: "297 hece"
  },
  {
    title: "8.sınıf düzeyi okuma metni",
    subtitle: "İSTANBUL",
    paragraphs: [
      "İstanbul… Bir köşesinde cicili bicili apartmanları; bir başka köşesinde tenekeden ve kibrit çöpünden evleri; bir başka köşesinde de asil konakları ve yalılarıyla İstanbul. Günde bin kere yüz değiştiren ve en güzelle en çirkin arasında mekik dokuyan İstanbul…",
      "Bu tezat ve zenginlik dünyası, her şeye rağmen tek ve yekpare birlik halinde benim bütün mekân ölçümü, bütün ruhumu billurlaştırıyor. Onun sefaletinde, zavallılığında bile hiçbir yerin devşiremeyeceği, sırrı yalnız bana belli bir mana görüyorum. Yemiş kaldırımlarının vıcık vıcık çamurunda bile Paris’in tahta kaldırımlarında bulmadığım mana ve şahsiyeti okuyorum (Canpekel, 2012)."
    ],
    quote: "225 hece"
  },
  {
    title: "9.sınıf düzeyi okuma metni",
    subtitle: "GÜNÜN ADAMI",
    paragraphs: [
      "Her şey yoluna girdi ve biz tekrar, hatta eskisinden daha kuvvetle günün adamı olduk. Babacanca hallerim halkın hoşuna gidiyordu. Acayip mazim, icat kabiliyetim, açık kalbim her gün bir kere daha övülüyordu. Hiçbir topluluk yoktu ki bulunmam istenilmesin! Doğrusunu isterseniz ben de şöhretin tam tadını çıkarmaktan hiç çekinmiyordum.",
      "Gözlüğüm, şemsiyem, hiçbir zaman yerine tam oturmayan şapkam, biraz bol kesilmiş elbiselerim, babayani hallerime kadar her şeyim bu muvaffakiyeti besleyecek şekilde tanzim edilmişti. Gittiğim her yerde etrafım çevriliyor. Her meselede fikrim soruluyordu. Umuma ait ölçüleri hiç rahatsız etmeyecek şekilde yaşadığım için seviliyordum (Bektaş, 2013)."
    ],
    quote: "267 hece"
  }
  
  
  
  
  
];

export default function Texts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { userData, setUserData } = useAuth(auth);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <DoctorLayout>
    <main className="flex-1 pb-8">
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
            <div className="min-w-0 flex-1">
              {/* Profile */}
              <div className="flex items-center">
                <img
                  className="hidden h-16 w-16 rounded-full sm:block"
                  src={userData?.photoUrl || placeholderImg}
                  alt="Profile Photo"
                />
                <div>
                  <div className="flex items-center">
                    <img
                      className="h-16 w-16 rounded-full sm:hidden"
                      src={userData?.photoUrl || placeholderImg}
                      alt="Profile Photo"
                    />
                    <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                      Merhaba, {userData?.firstName || "User"}{" "}
                      {userData?.lastName}
                    </h1>
                  </div>
                  <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                    <dt className="sr-only">Company</dt>
                    <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                      <BuildingOfficeIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {userData?.workplace}
                    </dd>
                    <dt className="sr-only">Account status</dt>
                    <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                      <CheckCircleIcon
                        className={`mr-1.5 h-5 w-5 flex-shrink-0 ${
                          userData?.paymentStatus
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                        aria-hidden="true"
                      />
                      {userData?.paymentStatus
                        ? "Payment Successful"
                        : "Payment Failed"}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
              <button
                onClick={openModal}
                type="button"
                className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                Hesap Makinesini Aç
              </button>
            </div>
          </div>
        </div>
      </div>

      <Timer isOpen={modalOpen} onClose={closeModal} />

      <div>
        {contents.map((content, index) => (
          <div
            key={index}
            className="bg-white p-8 shadow-md rounded-lg my-6 mx-5"
          >
            {/* Title */}
            <h1 className="text-2xl font-bold text-center">{content.title}</h1>
            {/* Subtitle */}
            <h2 className="text-xl font-semibold text-center mt-4">
              {content.subtitle}
            </h2>
            {/* Paragraphs */}
            {content.paragraphs.map((paragraph, idx) => (
              <p key={idx} className="text-base text-left mt-6">
                {paragraph}
              </p>
            ))}
            {/* Quote Area */}
            <p className="text-base text-right mt-4 italic">{content.quote}</p>
          </div>
        ))}
      </div>
    </main>
    </DoctorLayout>
  );
}
